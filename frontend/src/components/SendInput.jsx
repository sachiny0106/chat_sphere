import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '../config'; 
import toast from 'react-hot-toast';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.user);
    const {messages} = useSelector(store=>store.message); // messages from Redux

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;
        if (!selectedUser || !selectedUser._id) return toast.error("No user selected.");
        setIsLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser._id}`, {message}, { // Ensure selectedUser._id is correct
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });

            if (res.data && res.data.newMessage) {
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
        <form onSubmit={onSubmitHandler} className='w-full'>
            <div className='w-full relative flex items-center bg-base-200/80 backdrop-blur rounded-full px-3 shadow-inner border border-base-300'>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder='Type a message...'
                    className='input input-ghost w-full pr-14 bg-transparent text-base-content placeholder-base-content/50 focus:bg-transparent'
                    disabled={isLoading || !selectedUser}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !message.trim()}
                    className={`absolute right-2 btn btn-circle btn-sm ${message.trim() ? 'btn-primary' : 'btn-ghost text-base-content/30'}`}
                >
                    <IoSend className='w-4 h-4'/> 
                </button>
            </div>
        </form>
    )
}

export default SendInput;