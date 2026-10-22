
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getValidVideoAccessToken from "../../utils/getValidVideoAccessToken";
import ActiveVideoCall from "../../components/video_call/ActiveVideoCall";

import './VideoCallPage.css'

const VideoCallPage = () => {
  const { roomName, conversationId } = useParams();
  const [accessToken, setAccessToken] = useState(null);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getValidVideoAccessToken()
      .then((token) => {
        if (!cancelled) setAccessToken(token);
      })
      .catch((error) => {
        console.error("Unable to prepare video call token:", error);
        if (!cancelled) setTokenError(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (tokenError) {
    return <p>{tokenError}</p>;
  }

  if (!accessToken) {
    return <p>Preparing secure video connection...</p>;
  }

  return (
    <ActiveVideoCall
      roomName={roomName}
      conversationId={conversationId}
      accessToken={accessToken}
    />
  );
};

export default VideoCallPage;
