import React, { useState } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import { IoLogOutOutline } from "react-icons/io5"; // Logout Icon
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '../config'; 
import ThemeToggle from './ThemeToggle'; // Import ThemeToggle

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const {otherUsers, authUser} = useSelector(store=>store.user); // Get authUser for display
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
            navigate("/login");
            toast.success(res.data.message);
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    }
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (!search.trim()) { // If search is empty, reset to all other users
          dispatch(setOtherUsers(null)); // This will trigger useGetOtherUsers to refetch
          // Or, if you have the original full list stored, dispatch that.
          // For simplicity, null will make the hook refetch.
          return;
        }
        const conversationUser = otherUsers?.find((user)=> user.fullName.toLowerCase().includes(search.toLowerCase()));
        if(conversationUser){
            dispatch(setOtherUsers([conversationUser]));
        }else{
            toast.error("User not found!");
        }
    }
    return (
        // Responsive width and theme-aware background
        <div className='w-full sm:w-1/3 md:w-1/4 border-r border-slate-500/30 p-4 flex flex-col bg-slate-400/10 backdrop-blur-sm'>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Chats</h2>
              <ThemeToggle /> {/* Add ThemeToggle here */}
            </div>
            <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2 mb-4'>
                <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className='input input-bordered input-sm rounded-full flex-grow bg-white/10 text-white placeholder-gray-300 focus:ring-1 focus:ring-white border-none' type="text"
                    placeholder='Search users...'
                />
                <button type='submit' className='btn btn-circle btn-sm bg-white/10 border-none text-white hover:bg-white/20'>
                    <BiSearchAlt2 className='w-5 h-5'/>
                </button>
            </form>
            <div className="divider px-3"></div>
            <OtherUsers/>
            <div className='mt-auto pt-4 flex items-center justify-between'> {/* mt-auto pushes to bottom */}
                <div className="flex items-center gap-2">
                    <div className="avatar online"> {/* Assuming authUser is always online here */}
                        <div className="w-8 h-8 rounded-full">
                            <img src={authUser?.profilePhoto} alt={authUser?.fullName} />
                        </div>
                    </div>
                    <span className="text-sm font-medium text-base-content">{authUser?.fullName}</span>
                </div>
                <button
                    onClick={logoutHandler}
                    className='btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content tooltip tooltip-top'
                    data-tip="Logout"
                >
                    <IoLogOutOutline className='w-5 h-5'/>
                </button>
            </div>
        </div>
    )
}

export default Sidebar