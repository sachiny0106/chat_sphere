import React, { useState } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import { IoLogOutOutline } from "react-icons/io5";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '../config';
import ThemeToggle from './ThemeToggle';
import { setTheme } from "../redux/themeSlice";
import { setDensity, setSoundOn } from "../redux/uiSlice";

const Sidebar = () => {
    const [search, setSearch] = useState("");
    const {otherUsers, authUser} = useSelector(store=>store.user);
    const { currentTheme } = useSelector(store => store.theme);
    const { density, soundOn } = useSelector(store => store.ui);
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
                if (!search.trim()) {
                    dispatch(setOtherUsers(null));
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
                <div className="w-full sm:w-[280px] md:w-[320px] border-r border-base-300 p-4 flex flex-col bg-base-100/95 backdrop-blur h-full">
                        <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-base-content">Chats</h2>
              <ThemeToggle /> 
            </div>

                        <details className="collapse collapse-arrow bg-base-200/80 border border-base-300 rounded-xl mb-3">
                            <summary className="collapse-title text-sm font-semibold text-base-content/80">Settings</summary>
                            <div className="collapse-content flex flex-col gap-3">
                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text text-xs">Theme</span>
                                    </label>
                                    <select
                                        className="select select-bordered select-sm w-full"
                                        value={currentTheme}
                                        onChange={(e) => dispatch(setTheme(e.target.value))}
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label pb-1">
                                        <span className="label-text text-xs">Density</span>
                                    </label>
                                    <select
                                        className="select select-bordered select-sm w-full"
                                        value={density}
                                        onChange={(e) => dispatch(setDensity(e.target.value))}
                                    >
                                        <option value="cozy">Cozy</option>
                                        <option value="compact">Compact</option>
                                    </select>
                                </div>
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary toggle-sm"
                                        checked={soundOn}
                                        onChange={(e) => dispatch(setSoundOn(e.target.checked))}
                                    />
                                    <span className="label-text text-xs">Notification sound</span>
                                </label>
                            </div>
                        </details>
            
            <form onSubmit={searchSubmitHandler} className="relative mb-4">
                <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className="input input-bordered w-full bg-base-200 text-base-content placeholder-base-content/50 rounded-lg h-10 pr-10"
                    type="text"
                    placeholder="Search users..."
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs text-base-content/70 hover:text-primary">
                    <BiSearchAlt2 className="w-5 h-5"/>
                </button>
            </form>
            
            <div className="divider my-1"></div>
            
            <div className="flex-1 overflow-y-auto pr-1">
                <OtherUsers/>
            </div>

            <div className="mt-3 pt-3 border-t border-base-300 flex items-center justify-between"> 
                <div className="flex items-center gap-3">
                    <div className="avatar online">
                        <div className="w-10 h-10 rounded-full ring-2 ring-primary/30">
                            <img src={authUser?.profilePhoto} alt={authUser?.fullName} className="object-cover" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-base-content">{authUser?.fullName}</span>
                        <span className="text-xs text-base-content/60">Online</span>
                    </div>
                </div>
                <button
                    onClick={logoutHandler}
                    className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                    title="Logout"
                >
                    <IoLogOutOutline className="w-5 h-5"/>
                </button>
            </div>
        </div>
    )
}

export default Sidebar