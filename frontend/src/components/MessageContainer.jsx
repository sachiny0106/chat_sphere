import React from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector } from "react-redux";

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = onlineUsers?.includes(selectedUser?._id);

    return (
        <div className="flex-grow flex flex-col bg-base-200 h-full bg-gradient-to-br from-base-200 via-base-200 to-base-300">
            {selectedUser ? (
                <>
                    <div className="flex gap-3 items-center bg-base-100/90 backdrop-blur px-4 py-3 border-b border-base-300 shadow-sm">
                        <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
                            <div className="w-10 h-10 rounded-full">
                                <img src={selectedUser?.profilePhoto} alt="user" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-semibold text-base-content">{selectedUser?.fullName}</p>
                            <div className="flex items-center gap-2 text-xs text-base-content/60">
                                <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-success' : 'bg-base-300'}`}></span>
                                {isOnline ? 'Online' : 'Offline'}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-4"> 
                        <Messages />
                    </div>

                    <div className="p-3 bg-base-100/90 backdrop-blur border-t border-base-300 shadow-sm">
                        <SendInput />
                    </div>
                </>
            ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-8">
                    <div className="avatar mb-4">
                        <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={authUser?.profilePhoto} alt="profile" />
                        </div>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-2">
                        Welcome, {authUser?.fullName}!
                    </h1>
                    <p className="text-base-content/60 max-w-sm">
                        Select a conversation from the sidebar to start chatting.
                    </p>
                </div>
            )}
        </div>
    )
}

export default MessageContainer