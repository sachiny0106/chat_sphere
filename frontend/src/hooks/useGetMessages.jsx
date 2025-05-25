// frontend/src/hooks/useGetMessages.jsx
import { useEffect } from 'react';
import axios from "axios";
import {useSelector,useDispatch} from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '../config'; // CORRECTED IMPORT
import toast from 'react-hot-toast';

const useGetMessages = () => {
    const {selectedUser, authUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMessagesAndMarkRead = async () => {
            if (!selectedUser?._id) {
                dispatch(setMessages([]));
                return;
            }
            if (!authUser?._id) {
                dispatch(setMessages([]));
                return;
            }
            try {
                axios.defaults.withCredentials = true;
                const messageUrlToFetch = `${BASE_URL}/api/v1/message/${selectedUser._id}`;
            

                if (!BASE_URL || typeof BASE_URL !== 'string' || BASE_URL.trim() === '') {
                    console.error("[useGetMessages] BASE_URL is invalid or empty inside hook:", BASE_URL);
                    toast.error("Configuration error: Backend URL is not set for messages.");
                    dispatch(setMessages([])); // Clear messages on config error
                    return;
                }
                const res = await axios.get(messageUrlToFetch);
                const fetchedMessages = Array.isArray(res.data) ? res.data : [];
                dispatch(setMessages(fetchedMessages));

                const unreadMessagesExist = fetchedMessages.some(
                    (msg) => msg.senderId === selectedUser._id && msg.receiverId === authUser._id && !msg.isRead
                );

                if (unreadMessagesExist) {
                    console.log(`[useGetMessages] Unread messages from ${selectedUser.fullName} exist. Marking them as read.`);
                    await axios.put(`${BASE_URL}/api/v1/message/read/${selectedUser._id}`);
                    console.log(`[useGetMessages] Mark as read API call successful for messages from ${selectedUser._id}.`);
                }

            } catch (error) {
                console.error("[useGetMessages] Error fetching/marking messages:", error.response?.data || error.message, error);
                if (error.message.includes("Invalid URL") || error.message.includes("Failed to execute 'open'")) {
                    toast.error("Configuration Error: Could not connect to backend (Invalid URL).");
                } else {
                    toast.error(error.response?.data?.message || "Failed to fetch messages.");
                }
                dispatch(setMessages([]));
            }
        }

        if (selectedUser?._id && authUser?._id) {
             fetchMessagesAndMarkRead();
        } else {
            dispatch(setMessages([]));
        }

    }, [
        selectedUser?._id,
        selectedUser?.fullName,
        authUser?._id,
        authUser?.username,
        dispatch
    ]);
};

export default useGetMessages;