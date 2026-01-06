import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const { selectedUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = onlineUsers?.includes(user._id);
    const isSelected = selectedUser?._id === user?._id;

    return (
        <div
            onClick={() => dispatch(setSelectedUser(user))}
            className={`flex gap-3 items-center rounded-lg p-2 cursor-pointer transition-colors mb-1
                ${isSelected ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-base-200 border-l-2 border-transparent'}
            `}
        >
            <div className={`avatar ${isOnline ? 'online' : 'offline'}`}>
                <div className="w-10 h-10 rounded-full">
                    <img src={user?.profilePhoto} alt={user?.fullName} />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-base-content truncate">{user?.fullName}</p>
                <p className="text-xs text-base-content/50 truncate">{isOnline ? 'Online' : 'Offline'}</p>
            </div>
        </div>
    )
}

export default OtherUser