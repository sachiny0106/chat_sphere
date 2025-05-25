import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '../config'; 
// New S-Logo
const SLogoIcon = () => (
  <div className="w-20 h-20 bg-primary flex items-center justify-center rounded-full text-primary-content"> {/* Ensure contrast for S */}
    <span className="text-5xl font-bold">S</span>
  </div>
);


const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "", // Re-added gender
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
      toast.error("All fields are required, including gender.");
      setLoading(false);
      return;
    }
    
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    const userToRegister = {
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      username: formData.email, // Using email as username
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      gender: formData.gender, // Sending selected gender
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, userToRegister, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message || "Signup successful! Please login.");
      } else {
        toast.error(res.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred during signup.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-indigo-200 to-purple-300 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl lg:max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Welcome Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 bg-white space-y-6">
          <SLogoIcon /> {/* UPDATED LOGO */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">Welcome!</h1>
          <p className="text-base sm:text-lg text-gray-600 text-center max-w-xs">
            Explore the ideas throughout the world.
          </p>
        </div>

        {/* Right Signup Form Section */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-base-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">Sign Up</h2>
          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary w-full h-12 text-sm sm:text-base"
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary w-full h-12 text-sm sm:text-base"
                disabled={loading}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary w-full h-12 text-sm sm:text-base"
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary w-full h-12 text-sm sm:text-base"
              disabled={loading}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input input-bordered bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary w-full h-12 text-sm sm:text-base"
              disabled={loading}
            />
            {/* Gender Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Gender</span>
              </label>
              <div className="flex gap-4">
                <label className="label cursor-pointer gap-2">
                  <span className="label-text text-base-content">Male</span>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={() => handleGenderChange("male")}
                    className="radio radio-primary"
                    disabled={loading}
                  />
                </label>
                <label className="label cursor-pointer gap-2">
                  <span className="label-text text-base-content">Female</span>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={() => handleGenderChange("female")}
                    className="radio radio-primary"
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            <p className="text-sm text-center text-gray-600 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="link link-secondary hover:link-primary font-medium">
                Login here
              </Link>
            </p>
            <button
              type="submit"
              className="btn btn-primary btn-block h-12 text-lg capitalize mt-2"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;