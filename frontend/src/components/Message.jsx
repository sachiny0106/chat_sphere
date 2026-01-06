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
                className={`chat-bubble text-sm md:text-md py-2 px-4 shadow-lg transition-all hover:shadow-xl
                    ${isMyMessage
                        ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-bl-3xl rounded-tl-3xl rounded-tr-3xl rounded-br-md border border-blue-500/20'
                        : 'bg-slate-800/60 backdrop-blur-md text-white rounded-br-3xl rounded-tr-3xl rounded-tl-3xl rounded-bl-md border border-slate-700/50'
                    }
                `}
            >
                <div className="flex flex-col">
                    <span className="font-normal leading-relaxed">{message.message}</span>
                    <span className={`text-[10px] mt-1 self-end ${isMyMessage ? 'text-blue-100' : 'text-slate-400'}`}>
                        {messageTime}
                    </span>
                 </div>
            </div>
            {isMyMessage && (
                <div className="chat-footer opacity-50 flex items-center gap-1 mt-1">
                    {message.isRead ? (
                        <IoCheckmarkDoneSharp className="w-4 h-4 text-blue-400" />
                    ) : (
                        <IoCheckmarkSharp className="w-4 h-4 text-slate-400" />
                    )}
                </div>
            )}
        </div>
    )
            </div>
        </div>
    )
}

export default Message;