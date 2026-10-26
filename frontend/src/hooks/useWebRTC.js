
import { useEffect, useState, useRef, useCallback } from 'react';

import { WS_BASE_URL } from '../config';

const useWebRTC = (roomName, conversationId, accessToken) => {
  const remoteCameraThumbnailRef = useRef(null);
  const screenSenderRef = useRef(null);
  const screenMidRef = useRef(null);
  const remoteScreenVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const initiatorRef = useRef(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const callEndedRef = useRef(false);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteScreenSharing, setRemoteScreenSharing] = useState(false);
  const [remoteHandRaised, setRemoteHandRaised] = useState(false);
  const [connected, setConnected] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const sendSignal = useCallback((data) => {
    const socket = socketRef.current;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  }, []);

  // Find the MID of the second video media section.
  // The first video section is the camera; the second is screen sharing.
  const getScreenMidFromSdp = (sdp) => {
    if (!sdp) return null;

    const sections = sdp.split(/(?=^m=)/m);
    const videoSections = sections.filter((section) =>
      section.startsWith('m=video')
    );

    if (videoSections.length < 2) return null;

    const match = videoSections[1].match(/^a=mid:(.+)$/m);
    return match ? match[1].trim() : null;
  };

  const attachStream = (video, stream, label) => {
    if (!video) {
      console.error(`${label}: video element is missing`);
      return;
    }

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    video.play().catch((error) => {
      if (error.name !== 'AbortError') {
        console.error(`${label}: could not play video`, error);
      }
    });
  };

  const createPeerConnection = () => {
    if (peerConnectionRef.current) {
      return peerConnectionRef.current;
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    });

    peerConnectionRef.current = peerConnection;

    // Add the existing camera and microphone tracks.
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }

    // Do not create the screen transceiver here.
    // The answering peer must reuse the screen m-line from the offer.
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;

      console.log('WebRTC connection state:', state);
      setCallConnected(state === 'connected');
    };

    peerConnection.ontrack = (event) => {
      if (event.track.kind !== 'video') return;

      const transceiver = event.transceiver;

      const isScreenTrack =
        (screenMidRef.current != null &&
          transceiver.mid === screenMidRef.current) ||
        (screenSenderRef.current != null &&
          transceiver === screenSenderRef.current);

      const stream =
        event.streams[0] || new MediaStream([event.track]);

      console.log('Incoming video mapping:', {
        incomingMid: transceiver.mid,
        screenMid: screenMidRef.current,
        screenSenderMid: screenSenderRef.current?.mid ?? null,
        isScreenTrack,
      });

      if (isScreenTrack) {
        attachStream(
          remoteScreenVideoRef.current,
          stream,
          'Remote screen'
        );

        console.log('Remote screen track attached');
      } else {
        console.log("Attaching remote CAMERA stream:", {
    incomingMid: transceiver.mid,
    streamId: stream.id,
    tracks: stream.getVideoTracks().map((track) => ({
      id: track.id,
      enabled: track.enabled,
      readyState: track.readyState,
    })),
    thumbnailExists: Boolean(remoteCameraThumbnailRef.current),
  });
        attachStream(
          remoteVideoRef.current,
          stream,
          'Remote camera'
        );

        // The thumbnail is a separate video element.
        if (remoteCameraThumbnailRef.current) {
          attachStream(
            remoteCameraThumbnailRef.current,
            stream,
            'Remote camera thumbnail'
          );
        }

        console.log('Remote camera track attached');
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: 'ice-candidate',
          candidate: event.candidate,
        });
      }
    };

    return peerConnection;
  };

  const createOffer = async () => {
    const peerConnection = createPeerConnection();

    // Only the offerer creates the dedicated screen-sharing m-line.
    if (!screenSenderRef.current) {
      screenSenderRef.current = peerConnection.addTransceiver(
        'video',
        { direction: 'sendrecv' }
      );
    }

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    screenMidRef.current = screenSenderRef.current.mid;

    console.log(
      'Local offer transceivers:',
      peerConnection.getTransceivers().map((t) => ({
        mid: t.mid,
        direction: t.direction,
        currentDirection: t.currentDirection,
        senderTrack: t.sender.track?.kind ?? null,
        receiverTrack: t.receiver.track?.kind ?? null,
        isScreenSender: t === screenSenderRef.current,
      }))
    );

    sendSignal({
      type: 'offer',
      offer: peerConnection.localDescription,
    });
  };

  const handleSignal = async (data) => {
    if (data.type === 'peer-ready') {
      if (initiatorRef.current) return;

      initiatorRef.current = true;
      await createOffer();
      return;
    }

    if (data.type === 'offer') {
      const peerConnection = createPeerConnection();
      const offerSdp = data.offer?.sdp;

      // Set this before applying the remote description because ontrack
      // may fire while the remote offer is being processed.
      screenMidRef.current = getScreenMidFromSdp(offerSdp);

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      // Reuse the transceiver corresponding to the screen m-line.
      // Do not create another transceiver on the answering peer.
      if (screenMidRef.current != null) {
        screenSenderRef.current =
          peerConnection.getTransceivers().find(
            (t) => t.mid === screenMidRef.current
          ) ?? null;
      }

      console.log(
        'Transceivers after remote offer:',
        peerConnection.getTransceivers().map((t) => ({
          mid: t.mid,
          direction: t.direction,
          currentDirection: t.currentDirection,
          senderTrack: t.sender.track?.kind ?? null,
          receiverTrack: t.receiver.track?.kind ?? null,
          isScreenSender: t === screenSenderRef.current,
        }))
      );

      for (const candidate of pendingCandidatesRef.current) {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }

      pendingCandidatesRef.current = [];

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      sendSignal({
        type: 'answer',
        answer: peerConnection.localDescription,
      });

      return;
    }

    if (data.type === 'answer') {
      const peerConnection = peerConnectionRef.current;
      if (!peerConnection) return;

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      screenMidRef.current =
        screenSenderRef.current?.mid ?? screenMidRef.current;

      console.log(
        'Transceivers after remote answer:',
        peerConnection.getTransceivers().map((t) => ({
          mid: t.mid,
          direction: t.direction,
          currentDirection: t.currentDirection,
          senderTrack: t.sender.track?.kind ?? null,
          receiverTrack: t.receiver.track?.kind ?? null,
          isScreenSender: t === screenSenderRef.current,
        }))
      );

      for (const candidate of pendingCandidatesRef.current) {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }

      pendingCandidatesRef.current = [];
      return;
    }

    if (data.type === 'ice-candidate') {
      if (!data.candidate) return;

      const peerConnection = peerConnectionRef.current;

      if (peerConnection?.remoteDescription) {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      } else {
        pendingCandidatesRef.current.push(data.candidate);
      }

      return;
    }

    if (data.type === 'hand-state') {
      setRemoteHandRaised(Boolean(data.raised));
      return;
    }

    if (data.type === 'screen-state') {
      setRemoteScreenSharing(Boolean(data.sharing));
      return;
    }

    if (data.type === 'peer-left') {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      screenSenderRef.current = null;
      screenMidRef.current = null;
      pendingCandidatesRef.current = [];
      initiatorRef.current = false;

      setCallConnected(false);
      setRemoteScreenSharing(false);
    }
  };

  useEffect(() => {
    callEndedRef.current = false;

    if (!roomName || !conversationId || !accessToken) {
      console.warn(
        'Video call requires roomName, conversationId, and accessToken'
      );
      return undefined;
    }

    let mounted = true;

    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted || callEndedRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;

          localVideoRef.current.play().catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('Local video playback failed:', error);
            }
          });
        }

        const wsBaseUrl =
          WS_BASE_URL

        const wsUrl =
          `${wsBaseUrl}/ws/video/${roomName}/${conversationId}/` +
          `?token=${encodeURIComponent(accessToken)}`;

        console.log('Connecting to video websocket:', wsUrl);

        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          setConnected(true);
        };

        socket.onmessage = async (event) => {
          try {
            await handleSignal(JSON.parse(event.data));
          } catch (error) {
            console.error('Failed to process video signal:', error);
          }
        };

        socket.onerror = (error) => {
          console.error('Video websocket error:', error);
        };

        socket.onclose = () => {
          setConnected(false);
        };
      } catch (error) {
        console.error('Failed to start video call:', error);
      }
    };

    startCall();

    return () => {
      mounted = false;

      if (socketRef.current) {
        socketRef.current.onopen = null;
        socketRef.current.onmessage = null;
        socketRef.current.onerror = null;
        socketRef.current.onclose = null;
        socketRef.current.close();
        socketRef.current = null;
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      screenSenderRef.current = null;
      screenMidRef.current = null;
      pendingCandidatesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName, conversationId, accessToken]);

  const toggleMicrophone = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setMicEnabled(audioTrack.enabled);

    sendSignal({
      type: 'media-state',
      media: 'audio',
      enabled: audioTrack.enabled,
    });
  };

  const toggleCamera = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setCameraEnabled(videoTrack.enabled);

    sendSignal({
      type: 'media-state',
      media: 'video',
      enabled: videoTrack.enabled,
    });
  };

  const stopScreenSharing = async () => {
    const screenStream = screenStreamRef.current;
    screenStreamRef.current = null;

    if (screenStream) {
      screenStream.getTracks().forEach((track) => {
        track.onended = null;
        track.stop();
      });
    }

    try {
      const sender = screenSenderRef.current?.sender;

      if (sender) {
        await sender.replaceTrack(null);
      }
    } catch (error) {
      console.error('Failed to stop screen sharing:', error);
    }

    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
    }

    setIsScreenSharing(false);
    sendSignal({ type: 'screen-state', sharing: false });
  };

  const shareScreen = async () => {
    if (isScreenSharing) {
      await stopScreenSharing();
      return;
    }

    try {
      const peerConnection = peerConnectionRef.current;

      if (!peerConnection || peerConnection.connectionState !== 'connected') {
        console.warn(
          'Wait until the video call is connected before sharing your screen.'
        );
        return;
      }

      const sender = screenSenderRef.current?.sender;

      if (!sender) {
        console.error('Screen-sharing transceiver is not available.');
        return;
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      if (!screenTrack) {
        screenStream.getTracks().forEach((track) => track.stop());
        return;
      }

      await sender.replaceTrack(screenTrack);

      screenStreamRef.current = screenStream;
      attachStream(screenVideoRef.current, screenStream, 'Local screen preview');

      setIsScreenSharing(true);
      sendSignal({ type: 'screen-state', sharing: true });

      screenTrack.onended = () => {
        stopScreenSharing();
      };

      console.log('Screen sharing started:', {
        screenMid: screenSenderRef.current?.mid,
        senderHasTrack: sender.track === screenTrack,
      });
    } catch (error) {
      console.error('Failed to share screen:', error);
    }
  };

  const leaveCall = useCallback(() => {
    if (callEndedRef.current) return;
    callEndedRef.current = true;

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => {
        track.onended = null;
        track.stop();
      });
      screenStreamRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.onended = null;
        track.stop();
      });
      localStreamRef.current = null;
    }

    [
      screenVideoRef,
      localVideoRef,
      remoteVideoRef,
      remoteScreenVideoRef,
      remoteCameraThumbnailRef,
    ].forEach((ref) => {
      if (ref.current) ref.current.srcObject = null;
    });

    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (socketRef.current) {
      const socket = socketRef.current;

      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }

      socketRef.current = null;
    }

    screenSenderRef.current = null;
    screenMidRef.current = null;
    pendingCandidatesRef.current = [];
    initiatorRef.current = false;

    setConnected(false);
    setCallConnected(false);
    setRemoteHandRaised(false);
    setIsHandRaised(false);
    setIsScreenSharing(false);
    setRemoteScreenSharing(false);
  }, []);

  const toggleHand = () => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);

    sendSignal({
      type: 'hand-state',
      raised: newState,
    });
  };

  return {
    localVideoRef,
    remoteVideoRef,
    connected,
    callConnected,
    micEnabled,
    cameraEnabled,
    createOffer,
    toggleMicrophone,
    toggleCamera,
    leaveCall,
    shareScreen,
    isHandRaised,
    remoteHandRaised,
    toggleHand,
    screenVideoRef,
    isScreenSharing,
    remoteScreenSharing,
    stopScreenSharing,
    remoteScreenVideoRef,
    remoteCameraThumbnailRef,
  };
};

export default useWebRTC;
