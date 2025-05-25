import React, { useEffect } from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
    useGetMessages(); // Fetches messages and potentially marks them as read
    useGetRealTimeMessage(); // Listens for new messages and read receipts

    const { messages } = useSelector(store => store.message);
    const { selectedUser, authUser } = useSelector(store => store.user); // Added authUser for context

    useEffect(() => {
        // This log helps see if the messages array in Redux is updating as expected
        console.log("[Messages.jsx] Messages from Redux store:", JSON.parse(JSON.stringify(messages)));
    }, [messages]);

    if (!authUser) { // Should ideally be handled by router, but good for direct component use
        return <div className='px-4 flex-1 flex justify-center items-center text-base-content/70'>Authenticating...</div>;
    }

    if (!selectedUser) {
        return (
            <div className='px-4 flex-1 overflow-auto flex justify-center items-center text-center text-base-content/70'>
                <p>Welcome, {authUser.fullName}!<br/>Select a user to start chatting.</p>
            </div>
        );
    }
    
    if (!Array.isArray(messages) || messages.length === 0) {
        return (
            <div className='px-4 flex-1 overflow-auto flex justify-center items-center text-center text-base-content/70'>
                No messages yet with {selectedUser.fullName}.<br/> Send a message to start the conversation!
            </div>
        );
    }

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {
               messages.map((message) => {
                    if (!message || !message._id || typeof message.message === 'undefined') { 
                        console.warn("[Messages.jsx] Invalid message object found, skipping render:", message);
                        return null;
                    }
                    return (
                        <Message key={message._id} message={message} />
                    )
                })
            }
        </div>
    )
}

export default Messages;