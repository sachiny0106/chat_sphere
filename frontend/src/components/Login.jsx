import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '../config'; 

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
    <div className="min-h-screen flex items-center justify-center p-4">
       {/* Main Card Container */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-gray-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        
        {/* Left Side - Visual/Welcome */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-12 flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Abstract Shapes for background interest */}
            <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            
             <div className="relative z-10">
                 <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-lg mb-8">
                     <span className="text-5xl font-extrabold text-white">S</span>
                 </div>
                 <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Welcome Back!</h1>
                 <p className="text-indigo-200 text-lg max-w-sm mx-auto leading-relaxed">
                   Connect with friends and the world around you on ChatSphere.
                 </p>
             </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-transparent">
          <div className="md:hidden text-center mb-8">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-lg text-white text-3xl font-bold">
                 S
             </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2 text-center md:text-left">Sign In</h2>
          <p className="text-slate-400 mb-8 text-center md:text-left">Enter your details to continue</p>
          
          <form onSubmit={onSubmitHandler} className="space-y-5">
            <div className="form-control">
              <label className="label pl-0">
                <span className="label-text text-slate-300 font-medium">Username</span>
              </label>
              <input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="input input-bordered w-full bg-slate-800/50 text-white placeholder-slate-500 border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-6 transition-all"
                type="text"
                placeholder="Enter your username"
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label pl-0">
                <span className="label-text text-slate-300 font-medium">Password</span>
              </label>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="input input-bordered w-full bg-slate-800/50 text-white placeholder-slate-500 border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-6 transition-all"
                type="password"
                placeholder="Enter your password"
                disabled={loading}
                required
              />
              <label className="label pt-1 pb-0">
                 <a href="#" className="label-text-alt link link-hover text-indigo-400 hover:text-indigo-300 ml-auto">Forgot password?</a>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="btn btn-block bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 border-none text-white text-lg font-semibold rounded-xl h-12 shadow-lg shadow-indigo-500/20 transform active:scale-95 transition-all duration-200"
                disabled={loading}
              >
                {loading ? <span className="loading loading-dots loading-md"></span> : "Log In"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
             <p className="text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-sky-400 hover:text-sky-300 font-semibold hover:underline transition-colors">
                  Create Account
                </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;