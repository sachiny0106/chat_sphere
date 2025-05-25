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
                    // Use theme-aware background for the chat area if desired, or let HomePage handle it
                    <div className='flex-grow flex flex-col bg-base-100'> {/* Changed md:min-w to flex-grow */}
                        {/* Header with selected user - theme aware */}
                        <div className='flex gap-3 items-center bg-base-200 text-base-content px-4 py-3 mb-2 border-b border-base-300 shadow-sm'>
                            {/* <button onClick={handleBack} className="btn btn-ghost btn-sm sm:hidden">←</button> For back navigation on mobile */}
                            <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
                                <div className='w-10 sm:w-12 rounded-full ring ring-primary'>
                                    <img src={selectedUser?.profilePhoto} alt="user-profile" />
                                </div>
                            </div>
                            <div className='flex flex-col flex-1'>
                                <div className='flex justify-between gap-2'>
                                    <p className="text-lg font-semibold">{selectedUser?.fullName}</p>
                                </div>
                                <span className="text-xs text-base-content/70">{isOnline ? "Online" : "Offline"}</span>
                            </div>
                        </div>
                        <Messages />
                        <SendInput />
                    </div>
                ) : (
                    <div className='flex-grow flex flex-col justify-center items-center text-center p-4 bg-base-100'>
                        {/* Theme-aware text */}
                        <div className="avatar mb-4">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                                <img src={authUser?.profilePhoto || "/placeholder-avatar.png"} alt={authUser?.fullName} />
                            </div>
                        </div>
                        <h1 className='text-3xl md:text-4xl text-base-content font-bold'>Hi, {authUser?.fullName}! </h1>
                        <p className='text-lg md:text-xl text-base-content/80 mt-2'>Select a chat to start messaging.</p>
                    </div>
                )
            }
        </>
    )
}

export default MessageContainer