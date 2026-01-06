import React, { useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { formatTimestamp } from '../utils/formatTimestamp';
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";

const Message = ({message}) => {
    const scroll = useRef();
    const {authUser,selectedUser} = useSelector(store=>store.user);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"});
    },[message]);

    if (!message || !authUser || !authUser._id) {
        return null;
    }

    const messageTime = formatTimestamp(message.createdAt);
    const isMyMessage = message.senderId === authUser._id;

    return (
        <div ref={scroll} className={`chat ${isMyMessage ? 'chat-end' : 'chat-start'} mb-1`}>
            <div className="chat-image avatar">
                <div className="w-8 h-8 rounded-full">
                    <img alt="avatar" src={isMyMessage ? authUser.profilePhoto : selectedUser?.profilePhoto} />
                </div>
            </div>
            <div className={`chat-bubble text-sm ${isMyMessage ? 'chat-bubble-primary' : 'bg-base-300 text-base-content'}`}>
                {message.message}
            </div>
            <div className="chat-footer opacity-50 text-xs flex items-center gap-1">
                {messageTime}
                {isMyMessage && (
                    message.isRead ? (
                        <IoCheckmarkDoneSharp className="w-3 h-3 text-info" />
                    ) : (
                        <IoCheckmarkSharp className="w-3 h-3" />
                    )
                )}
            </div>
        </div>
    )
}

export default Message;