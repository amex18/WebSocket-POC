import { useEffect, useState } from "react";

const WebSocketClient = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socket = new WebSocket("http://localhost:8080/ws/websocket");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Notifications</h1>
      <div className="notifications">
        {messages.map((message, index) => (
          <div key={index} className="notification">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebSocketClient;