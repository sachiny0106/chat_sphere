import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '../config'; // CORRECTED IMPORT

// New S-Logo
const SLogoIcon = () => (
  <div className="w-20 h-20 bg-primary flex items-center justify-center rounded-full text-primary-content">
    <span className="text-5xl font-bold">S</span>
  </div>
);

const Login = () => {
  const [user, setUser] = useState({
    username: "", 
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      navigate("/");
      dispatch(setAuthUser(res.data));
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <div className="flex flex-col md:flex-row w-full max-w-4xl lg:max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 bg-transparent space-y-6 order-last md:order-first border-t md:border-t-0 md:border-r border-white/10">
          <SLogoIcon /> {/* UPDATED LOGO */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Welcome Back!</h1>
          <p className="text-base sm:text-lg text-gray-200 text-center max-w-xs">
            Continue exploring the ideas throughout the world.
          </p>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-transparent flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Login</h2>
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
              <label className='label p-2 sr-only'>
                <span className='text-base label-text text-gray-200'>Username</span>
              </label>
              <input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className='input input-bordered bg-slate-800/50 focus:bg-slate-900/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-white border-none w-full h-12 text-sm sm:text-base'
                type="text"
                placeholder='Username or Email'
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className='label p-2 sr-only'>
                <span className='text-base label-text text-gray-200'>Password</span>
              </label>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className='input input-bordered bg-slate-800/50 focus:bg-slate-900/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-white border-none w-full h-12 text-sm sm:text-base'
                type="password"
                placeholder='Password'
                disabled={loading}
                required
              />
            </div>
            <p className='text-sm text-center text-gray-300'>
              Don't have an account?{' '}
              <Link to="/signup" className="link text-white hover:text-indigo-200 font-medium decoration-transparent hover:decoration-white">
                Sign up here
              </Link>
            </p>
            <div>
              <button
                type="submit"
                className='btn btn-primary btn-block h-12 text-lg capitalize bg-indigo-600 border-none hover:bg-indigo-700 text-white shadow-lg'
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;