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
                flex gap-3 items-center rounded-xl p-3 cursor-pointer
                transition-all duration-300 ease-in-out group mb-1
                ${selectedUser?._id === user?._id
                  ? 'bg-sky-500/20 text-white shadow-md border-l-4 border-sky-400' // Active state
                  : 'hover:bg-slate-800/30 text-slate-200 hover:text-white border-l-4 border-transparent' // Hover state
                }
              `}
            >
                <div className={`avatar ${isOnline ? 'online' : ''} `}>
                    <div className='w-11 h-11 rounded-full ring-2 ring-slate-600 group-hover:ring-sky-400 transition-all'>
                        <img src={user?.profilePhoto} alt="user-profile" className="object-cover" />
                    </div>
                </div>
                <div className='flex flex-col flex-1 min-w-0'> 
                    <div className='flex justify-between gap-2 items-center'>
                        <p className="font-semibold truncate">{user?.fullName}</p>
                    </div>
                </div>
            </div>
            {/* <div className='divider my-0 py-0 h-1 opacity-50'></div> */}
        </>
    )
}

export default OtherUser