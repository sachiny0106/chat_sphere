import React, {useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '../config'; 
import toast from 'react-hot-toast'; // Make sure toast is imported

const SendInput = () => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Renamed for clarity
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.user);
    const {messages} = useSelector(store=>store.message); // messages from Redux

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;
        if (!selectedUser || !selectedUser._id) {
            toast.error("No user selected to send a message to.");
            return;
        }
        setIsLoading(true);
        try {
            console.log("[SendInput] Attempting to send message:", { text: message, toUserId: selectedUser._id });
            const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser._id}`, {message}, { // Ensure selectedUser._id is correct
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });

            if (res.data && res.data.newMessage) {
                // Ensure messages is an array before spreading
                const currentMessages = Array.isArray(messages) ? messages : [];
                dispatch(setMessages([...currentMessages, res.data.newMessage]));
            } else {
                console.error("[SendInput] API response did not contain newMessage:", res.data);
                toast.error("Error processing server response.");
            }
        } catch (error) {
            console.error("[SendInput] Error sending message:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Failed to send message.");
        } finally {
            setIsLoading(false);
        }
        setMessage("");
    }
    return (
        <form onSubmit={onSubmitHandler} className='px-4 my-3'>
            <div className='w-full relative'>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder='Send a message...'
                    className='input input-bordered w-full p-3 bg-base-200 focus:bg-base-100 text-base-content' // Adjusted styling for theme
                    disabled={isLoading || !selectedUser}
                />
                <button 
                    type="submit" 
                    className='absolute flex inset-y-0 end-0 items-center pr-4 text-primary disabled:text-base-content/50'
                    disabled={isLoading || !message.trim() || !selectedUser}
                >
                    <IoSend className="w-5 h-5"/>
                </button>
            </div>
        </form>
    )
}

export default SendInput;