import React, { useState, useEffect } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import connectToStomp from './Stomp';
import { useParams } from 'react-router-dom';
import { MessageWithTime } from 'components/molecules/cards/MessageCard/MessageWithTime';
import { ArrowIcon } from 'components/atoms/icons/Arrow/ArrowIcon';

interface Message {
  type: string;
  roomId: string;
  sender: string;
  message: string;
}
type Props = {
  sessionId: string;
};

interface ChattingProps {
  userName: string;
  arrowOn: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Chatting: React.FC<ChattingProps> = ({ userName, onClick, arrowOn }) => {
  const { sessionId } = useParams<Props>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [roomId] = useState<string>(sessionId || 'default_room_id'); // Example roomId
  const [sender] = useState<string>(userName);
  useEffect(() => {
    console.log('현재 룸아이디: ', roomId);
    // Create and connect client
    const client: Client = connectToStomp(onConnected);
    setStompClient(client);

    // Set up subscription when connected
    function onConnected() {
      if (client) {
        client.subscribe(`/api/chat/sub/chat/room/${roomId}`, onMessageReceived);
      }
    }

    // Handle received messages
    function onMessageReceived(message: IMessage) {
      console.log('Received message:', message.body); // Debugging log
      const parsedMessage: Message = JSON.parse(message.body);
      setMessages((prevMessages) => [...prevMessages, parsedMessage]);
    }

    // Cleanup function
    return () => {
      if (client) client.deactivate();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (stompClient && input.trim() !== '') {
      const messagePayload: Message = {
        type: 'ENTER',
        roomId,
        sender: sender, // Set dynamically as needed
        message: input,
      };

      stompClient.publish({
        destination: '/api/chat/pub/chat/message',
        body: JSON.stringify(messagePayload),
      });
      setInput('');
    }
  };

  return (
    <div style={{ padding: '20px' }} className='w-full h-full'>
      <div className='flex flex-row justify-center w-full'>
        <h1 className='mb-3 text-center kor-h-h3'>채팅</h1>
        {arrowOn && (
          <button onClick={onClick} className='mb-3 ml-2'>
            <ArrowIcon direction='down' size={16} color='black' />
          </button>
        )}
      </div>

      <div className=' h-[70%] p-2.5 w-full mt-2 border rounded-lg shadow-md solid 3px overflow-y-scroll text-xs'>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.sender === sender ? 'flex-end' : 'flex-start',
              marginBottom: '10px',
              width: '100%',
            }}
          >
            <MessageWithTime
              flag={msg.sender === sender ? false : true}
              contents={msg.message}
              time={'23:00'}
              sender={msg.sender}
            />
          </div>
        ))}
      </div>
      <div className='mt-4'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={{ width: '80%' }}
          className='h-20 mt-2 border rounded-lg shadow-md solid 3px'
        />
        <button onClick={sendMessage} style={{ width: '20%' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatting;
