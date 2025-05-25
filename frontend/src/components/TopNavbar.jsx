import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '../config'; 
import ThemeToggle from './ThemeToggle';
import { FiSearch, FiSettings, FiBell, FiHome, FiMessageSquare, FiUser, FiLogOut } from 'react-icons/fi';

// S-Logo for TopNavbar
const SLogoIconSmall = () => (
  <div className="w-7 h-7 bg-primary flex items-center justify-center rounded-md text-primary-content"> {/* Smaller, rounded-md */}
    <span className="text-xl font-bold">S</span>
  </div>
);

const TopNavbar = () => {
  const { authUser } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.success(`Searching for: ${searchQuery}`);
  };

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
        toast.error("Logout failed.");
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full p-2 sm:p-3 bg-base-100 shadow-md border-b border-base-300/50">
      <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Link to="/" className="text-primary">
            <SLogoIconSmall /> {/* UPDATED LOGO */}
          </Link>
          <form onSubmit={handleSearch} className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="#Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm w-48 md:w-64 lg:w-80 bg-base-200 focus:bg-base-100 !pr-10"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-primary">
              <FiSearch className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <button className="btn btn-ghost btn-circle btn-sm" title="Notifications">
            <FiBell className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-circle btn-sm" title="Settings">
            <FiSettings className="w-5 h-5" />
          </button>
          {authUser && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-1 ring-primary ring-offset-base-100 ring-offset-1">
                  <img src={authUser.profilePhoto || `https://avatar.iran.liara.run/public/${authUser.gender === 'female' ? 'girl' : 'boy'}?username=${authUser.username}`} alt={authUser.fullName} />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <Link to={`/profile/${authUser.username}`} className="justify-between"> {/* Assuming profile route uses username */}
                    Profile
                  </Link>
                </li>
                <li><Link to="/settings">Settings</Link></li>
                <li><button onClick={logoutHandler}>Logout <FiLogOut /></button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;