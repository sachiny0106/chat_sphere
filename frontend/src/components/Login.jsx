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
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-base-200">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-3xl shadow-2xl overflow-hidden border border-base-300 bg-base-100/90 backdrop-blur">
        <div className="hidden md:flex flex-col gap-4 justify-center px-10 py-12 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/80 text-primary-content">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-bold shadow-lg">CS</div>
          <h2 className="text-3xl font-bold leading-tight">Welcome back</h2>
          <p className="text-sm leading-relaxed text-primary-content/80">
            Stay in sync with your conversations. Switch between light and dark for a comfy reading experience.
          </p>
        </div>

        <div className="px-6 sm:px-10 py-10 flex flex-col gap-6">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-content flex items-center justify-center text-xl font-semibold">CS</div>
            <div>
              <h2 className="text-xl font-semibold text-base-content">Welcome back</h2>
              <p className="text-sm text-base-content/60">Sign in to continue</p>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-base-content/70">Username</span>
              </label>
              <input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="input input-bordered w-full bg-base-200/70"
                type="text"
                placeholder="Enter your username"
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-base-content/70">Password</span>
              </label>
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="input input-bordered w-full bg-base-200/70"
                type="password"
                placeholder="Enter your password"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mt-4"
              disabled={loading}
            >
              {loading ? <span className="loading loading-dots loading-md"></span> : "Sign in"}
            </button>
          </form>

          <div className="text-center text-base-content/70 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="link link-primary font-semibold">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;