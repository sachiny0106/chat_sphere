// frontend/src/hooks/useGetOtherUsers.jsx
import { useEffect } from 'react'; // Removed unused React import
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '../config'; // CORRECTED IMPORT
import toast from 'react-hot-toast';

const useGetOtherUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                const urlToFetch = `${BASE_URL}/api/v1/user`;
                console.log("[useGetOtherUsers] Effective BASE_URL from config.js:", BASE_URL);
                console.log("[useGetOtherUsers] Attempting to fetch other users from URL:", urlToFetch);

                if (!BASE_URL || typeof BASE_URL !== 'string' || BASE_URL.trim() === '') {
                    console.error("[useGetOtherUsers] BASE_URL is invalid or empty inside hook:", BASE_URL);
                    toast.error("Configuration error: Backend URL is not set.");
                    return;
                }
                const res = await axios.get(urlToFetch);
                console.log("[useGetOtherUsers] Fetched other users API response:", res.data);
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.error("[useGetOtherUsers] Error fetching other users:", error.response?.data || error.message, error);
                 if (error.message.includes("Invalid URL") || error.message.includes("Failed to execute 'open'")) {
                    toast.error("Configuration Error: Could not connect to backend (Invalid URL).");
                } else {
                    toast.error(error.response?.data?.message || "Failed to fetch other users.");
                }
            }
        }
        fetchOtherUsers();
    }, [dispatch]);
}

export default useGetOtherUsers;