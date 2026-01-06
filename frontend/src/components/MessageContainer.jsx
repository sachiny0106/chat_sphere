import React, { useEffect } from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector,useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const isOnline = onlineUsers?.includes(selectedUser?._id);

    // On smaller screens, if a user is selected, clicking back could clear selectedUser
    // const handleBack = () => {
    //     dispatch(setSelectedUser(null));
    // };

    return (
        <>
            {
                selectedUser !== null ? (
                    <div className='flex-grow flex flex-col bg-slate-900/10 backdrop-blur-sm rounded-r-2xl overflow-hidden'> 
                        
                        {/* Header */}
                        <div className='flex gap-4 items-center bg-slate-800/60 backdrop-blur-md text-white px-6 py-3 border-b border-slate-700/50 shadow-sm z-10'>
                            <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
                                <div className='w-11 h-11 rounded-full ring-2 ring-slate-100/20'>
                                    <img src={selectedUser?.profilePhoto} alt="user-profile" className="object-cover" />
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <p className="text-lg font-bold tracking-wide text-white drop-shadow-md">{selectedUser?.fullName}</p>
                                <span className={`text-xs font-medium ${isOnline ? 'text-green-400' : 'text-slate-400'}`}>
                                    {isOnline ? "● Online" : `Last seen recently`} 
                                </span>
                            </div>
                        </div>

                        {/* Messages Area with conditional scrollbar style if needed */}
                        <div className="flex-1 overflow-auto bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-fixed opacity-90"> 
                             {/* You can remove the bg patterns if you prefer clean glass */}
                             <Messages />
                        </div>

                        {/* Input Area */}
                        
                        <div className="p-3 bg-slate-800/40 backdrop-blur-md border-t border-slate-700/50">
                            <SendInput />
                        </div>
                    </div>
                ) : (
                    <div className='flex-grow flex flex-col justify-center items-center text-center p-8 bg-slate-900/10 backdrop-blur-sm rounded-r-2xl'>
                        <div className="bg-slate-800/50 p-6 rounded-full ring-4 ring-slate-700/30 mb-6 shadow-2xl animate-pulse-slow">
                            <div className="w-24 h-24 rounded-full overflow-hidden">
                                <img src={authUser?.profilePhoto || "/placeholder-avatar.png"} alt="profile" className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <h1 className='text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 font-extrabold mb-2'>
                            Welcome, {authUser?.fullName}!
                        </h1>
                        <p className='text-xl text-slate-300 font-light max-w-md'>
                            Select a conversation from the sidebar to start chatting globally.
                        </p>
                    </div>
                )
            }
        </>
    )
}

export default MessageContainer