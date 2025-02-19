import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { over, Client } from 'stompjs';
import './App.css';

const App = () => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  interface Message {
    sender: string;
    content: string;
    type: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws/websocket');
    const client = over(socket);
    client.connect({}, onConnected, onError);
    setStompClient(client);
  }, []);

  const onConnected = () => {
    stompClient?.subscribe('/topic/public', onMessageReceived);
  };

  const onError = (error: any) => {
    console.error('Could not connect to WebSocket server. Please refresh this page to try again!', error);
  };

  interface Payload {
    body: string;
  }

  const onMessageReceived = (payload: Payload) => {
    const message: Message = JSON.parse(payload.body);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessage = () => {
    if (stompClient) {
      const chatMessage = {
        sender: username,
        content: message,
        type: 'CHAT',
      };
      stompClient.send('/app/sendMessage', {}, JSON.stringify(chatMessage));
      setMessage('');
    }
  };

  const addUser = () => {
    if (stompClient) {
      const chatMessage = {
        sender: username,
        type: 'JOIN',
      };
      stompClient.send('/app/addUser', {}, JSON.stringify(chatMessage));
    }
  };

  return (
    <div className="App">
      <div id="root">
        <h2>WebSocket Chat</h2>
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={addUser}>Join</button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.sender}: </strong> {msg.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;