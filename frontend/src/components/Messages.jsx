import React, { useMemo, useRef } from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = ({ searchTerm = "", density = "cozy", bindFirstUnreadRef }) => {
    useGetMessages();
    useGetRealTimeMessage();

    const { messages } = useSelector(store => store.message);
    const { selectedUser, authUser } = useSelector(store => store.user);

    const firstUnreadSet = useRef(false);

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

    const filteredMessages = useMemo(() => {
        if (!Array.isArray(messages)) return [];
        if (!searchTerm.trim()) return messages;
        const term = searchTerm.toLowerCase();
        return messages.filter((msg) => (msg.message || "").toLowerCase().includes(term));
    }, [messages, searchTerm]);

    const bubbleSpacing = density === "compact" ? "space-y-2" : "space-y-3";

    return (
        <div className={`px-4 flex-1 overflow-auto ${bubbleSpacing}`}>
            {filteredMessages.map((message) => {
                if (!message || !message._id || typeof message.message === 'undefined') {
                    return null;
                }
                const isUnreadForMe = message.receiverId === authUser._id && !message.isRead;
                const refProp = !firstUnreadSet.current && isUnreadForMe
                  ? {
                      ref: (el) => {
                        if (el) {
                          firstUnreadSet.current = true;
                          if (bindFirstUnreadRef) bindFirstUnreadRef(el);
                        }
                      }
                    }
                  : {};
                return (
                    <div key={message._id} {...refProp}>
                        <Message message={message} />
                    </div>
                );
            })}
        </div>
    )
}

export default Messages;