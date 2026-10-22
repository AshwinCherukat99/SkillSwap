import { useCallback, useState, useEffect, useRef } from 'react';

const useChatSocket = (
    conversationId,
    onMessage,
    tokenKey = 'access_token'
) => {
    const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    const socketRef = useRef(null);
    const onMessageRef = useRef(onMessage);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        if (!conversationId) {
            setConnected(false);
            return;
        }

        const accessToken = localStorage.getItem(tokenKey);

        if (!accessToken) {
            console.error(`No token found for key: ${tokenKey}`);
            setConnected(false);
            return;
        }

        const socketUrl =
            `${wsBaseUrl}/ws/chat/${conversationId}/` +
            `?token=${encodeURIComponent(accessToken)}`;

        const socket = new WebSocket(socketUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('Chat WebSocket connected');
            setConnected(true);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'message' && data.message) {
                    onMessageRef.current?.(data.message);
                } else if (data.error) {
                    console.error('Chat server error:', data.error);
                }
            } catch (err) {
                console.error('Invalid WebSocket message:', err);
            }
        };

        socket.onclose = (event) => {
            console.log('Chat WebSocket disconnected:', event.code);

            if (socketRef.current === socket) {
                socketRef.current = null;
                setConnected(false);
            }
        };

        socket.onerror = (error) => {
            console.error('Chat WebSocket error:', error);
        };

        return () => {
            if (socketRef.current === socket) {
                socketRef.current = null;
                setConnected(false);
            }

            socket.close();
        };
    }, [conversationId, wsBaseUrl, tokenKey]);

    const sendMessage = useCallback((message) => {
        const socket = socketRef.current;

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return false;
        }

        socket.send(JSON.stringify(message));
        return true;
    }, []);

    return { connected, sendMessage };
};

export default useChatSocket;