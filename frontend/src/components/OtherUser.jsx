import React from 'react'
import { useDispatch,useSelector } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';

const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const {selectedUser, onlineUsers} = useSelector(store=>store.user);
    const isOnline = onlineUsers?.includes(user._id);

    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
    }
    return (
        <>
            <div
              onClick={() => selectedUserHandler(user)}
              className={`
                flex gap-2 items-center rounded p-2 cursor-pointer
                transition-all duration-200 ease-in-out group
                ${selectedUser?._id === user?._id
                  ? 'bg-primary text-primary-content' // Active state
                  : 'hover:bg-base-300 text-base-content' // Hover state
                }
              `}
            >
                <div className={`avatar ${isOnline ? 'online' : 'offline'} `}>
                    <div className='w-10 sm:w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 group-hover:ring-secondary transition-all'>
                        <img src={user?.profilePhoto} alt="user-profile" />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between gap-2 items-center'>
                        <p className="font-semibold">{user?.fullName}</p>
                        {/* You could add a small dot or last message preview here */}
                    </div>
                    {/* <span className="text-xs text-base-content/70">Last message preview...</span> */}
                </div>
            </div>
            <div className='divider my-0 py-0 h-1 opacity-50'></div>
        </>
    )
}

export default OtherUser