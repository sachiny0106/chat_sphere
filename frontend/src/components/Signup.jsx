import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '../config'; 

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (selectedGender) => {
    setFormData({ ...formData, gender: selectedGender });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.gender) {
      toast.error("All fields are required.");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    const userToRegister = {
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      username: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      gender: formData.gender,
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, userToRegister, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message || "Signup successful!");
      } else {
        toast.error(res.data.message || "Signup failed.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary text-primary-content text-2xl font-bold mb-4">
            CS
          </div>
          <h2 className="text-2xl font-bold text-base-content">Create Account</h2>
          <p className="text-base-content/60 mt-1">Join our community</p>
        </div>
        
        <form onSubmit={onSubmitHandler} className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            disabled={loading}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input input-bordered w-full"
            disabled={loading}
          />
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input input-bordered w-full"
            disabled={loading}
          />
          
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text">Gender</span>
            </label>
            <div className="flex gap-4">
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === "male"}
                  onChange={() => handleGenderChange("male")}
                  className="radio radio-primary radio-sm"
                  disabled={loading}
                />
                <span className="label-text">Male</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === "female"}
                  onChange={() => handleGenderChange("female")}
                  className="radio radio-primary radio-sm"
                  disabled={loading}
                />
                <span className="label-text">Female</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block mt-4"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-base-content/60">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;