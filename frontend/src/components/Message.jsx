import React, { useEffect, useRef } from 'react';
import {useSelector} from "react-redux";
import { formatTimestamp } from '../utils/formatTimestamp';
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";

const Message = ({message}) => {
    const scroll = useRef();
    const {authUser,selectedUser} = useSelector(store=>store.user);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"});
    },[message]);

    // Defensive checks for message and authUser
    if (!message || !authUser || !authUser._id) {
        console.warn("[Message.jsx] Missing message or authUser data for rendering.");
        return null; // Don't render if essential data is missing
    }

    const messageTime = formatTimestamp(message.createdAt); // No optional chaining if message is guaranteed
    const isMyMessage = message.senderId === authUser._id;

    // DEBUG LOGS
    if (isMyMessage) {
        console.log(`[Message.jsx] Rendering MY Message ID: ${message._id}, isRead: ${message.isRead}, Content: "${message.message}"`);
    } else {
        // Only log if it's a message from the currently selected user to avoid too much noise
        if (selectedUser && message.senderId === selectedUser._id) {
            console.log(`[Message.jsx] Rendering THEIR Message (from selectedUser) ID: ${message._id}, isRead: ${message.isRead}, Content: "${message.message}"`);
        }
    }

    return (
        <div ref={scroll} className={`chat ${isMyMessage ? 'chat-end' : 'chat-start'} mb-2`}>
            <div className="chat-image avatar">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full">
                    <img
                        alt="User avatar"
                        src={isMyMessage ? authUser.profilePhoto : selectedUser?.profilePhoto } // authUser.profilePhoto should exist if authUser exists
                    />
                </div>
            </div>
            <div
                className={`chat-bubble relative group flex flex-col max-w-xs md:max-w-md lg:max-w-lg break-words
                    ${isMyMessage
                        ? 'bg-primary text-primary-content'
                        : 'bg-base-300 text-base-content'
                    }
                `}
            >
                <span>{message.message}</span>
                <div className={`flex items-center gap-1 mt-1 self-end ${isMyMessage ? 'text-primary-content/70' : 'text-base-content/70'}`}>
                    <span className={`text-xs opacity-70`}>
                        {messageTime}
                    </span>
                    {isMyMessage && ( // Only show read status for messages sent by the authUser
                        message.isRead ? (
                            <IoCheckmarkDoneSharp className="w-4 h-4 text-blue-400" />
                        ) : (
                            <IoCheckmarkSharp className="w-4 h-4" /> 
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default Message;