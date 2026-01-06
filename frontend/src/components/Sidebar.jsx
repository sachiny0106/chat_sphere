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
        <div className='w-full sm:w-[300px] md:w-[350px] border-r border-slate-400/20 p-4 flex flex-col bg-black/20 h-full backdrop-blur-sm'>
            <div className="flex justify-between items-center mb-5 px-1">
              <h2 className="text-2xl font-bold text-white tracking-wide">Chats</h2>
              <ThemeToggle /> 
            </div>
            
            <form onSubmit={searchSubmitHandler} className='relative mb-4 flex items-center gap-2'>
                <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className='input w-full bg-slate-800/50 text-white placeholder-slate-400 rounded-xl px-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all shadow-inner' // enhanced input
                    type="text"
                    placeholder='Search users...'
                />
                <button type='submit' className='absolute right-3 btn btn-circle btn-xs btn-ghost text-slate-300 hover:text-white'>
                    <BiSearchAlt2 className='w-5 h-5'/>
                </button>
            </form>
            
            <div className="divider my-2 mt-0 h-px bg-slate-700/50 opacity-100"></div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <OtherUsers/>
            </div>

            <div className='mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between px-1'> 
                <div className="flex items-center gap-3">
                    <div className="avatar online">
                        <div className="w-10 h-10 rounded-full ring-2 ring-sky-500/50">
                            <img src={authUser?.profilePhoto} alt={authUser?.fullName} className="object-cover" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{authUser?.fullName}</span>
                        <span className="text-xs text-slate-400">My Account</span>
                    </div>
                </div>
                <button
                    onClick={logoutHandler}
                    className='btn btn-ghost btn-circle btn-sm text-red-400 hover:bg-red-500/20 hover:text-red-200 transition-colors'
                    title="Logout"
                >
                    <IoLogOutOutline className='w-6 h-6'/>
                </button>
            </div>
        </div>
    )
}

export default Sidebar