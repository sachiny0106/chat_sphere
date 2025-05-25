// frontend/src/hooks/useGetRealTimeMessage.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, updateMessagesReadStatus } from "../redux/messageSlice";
import { BASE_URL } from "../config";
import axios from "axios";
import toast from 'react-hot-toast'; // Added toast for potential error messages

const useGetRealTimeMessage = () => {
    const socketFromRedux = useSelector(store => store.socket.socket);
    const authUserId = useSelector(store => store.user.authUser?._id);
    const selectedUserId = useSelector(store => store.user.selectedUser?._id);
    const dispatch = useDispatch();

    useEffect(() => {
        if (socketFromRedux && socketFromRedux.connected && authUserId) {
            console.log(`[useGetRealTimeMessage] Attaching listeners to socket: ${socketFromRedux.id} for authUser: ${authUserId}`);

            const handleNewMessage = async (newMessage) => {
                console.log("[useGetRealTimeMessage] EVENT 'newMessage':", JSON.parse(JSON.stringify(newMessage)));
                let messageToStore = { ...newMessage };

                if (selectedUserId && newMessage.senderId === selectedUserId && newMessage.receiverId === authUserId) {
                    // console.log(`[useGetRealTimeMessage] New message is for current chat. Attempting to mark as read.`);
                    try {
                        if (!BASE_URL) {
                            console.error("[useGetRealTimeMessage] BASE_URL is undefined, cannot mark message as read.");
                        } else {
                            await axios.put(`${BASE_URL}/api/v1/message/read/${selectedUserId}`);
                            messageToStore.isRead = true;
                        }
                    } catch (err) {
                         console.error("[useGetRealTimeMessage] Error marking new message as read via API:", err.response?.data || err.message);
                         // toast.error("Failed to mark incoming message as read."); // Optional user feedback
                    }
                }
                dispatch(setMessages((prevMessages) => {
                    const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
                    const existingMsgIndex = currentMessages.findIndex(msg => msg._id === messageToStore._id);
                    if (existingMsgIndex > -1) {
                        const updatedMessages = [...currentMessages];
                        updatedMessages[existingMsgIndex] = { ...currentMessages[existingMsgIndex], ...messageToStore };
                        return updatedMessages;
                    }
                    return [...currentMessages, messageToStore];
                }));
            };

            const handleMessagesRead = (data) => {
                console.log("[useGetRealTimeMessage] EVENT 'messagesRead':", data);
                if (selectedUserId && data.conversationPartnerId === selectedUserId) {
                     dispatch(updateMessagesReadStatus({
                        conversationPartnerId: data.conversationPartnerId,
                        messageIds: data.messageIds
                    }));
                }
            };

            socketFromRedux.on("newMessage", handleNewMessage);
            socketFromRedux.on("messagesRead", handleMessagesRead);

            return () => {
                console.log(`[useGetRealTimeMessage] Cleaning up listeners from socket: ${socketFromRedux.id}`);
                socketFromRedux.off("newMessage", handleNewMessage);
                socketFromRedux.off("messagesRead", handleMessagesRead);
            };
        } 
    }, [socketFromRedux, dispatch, selectedUserId, authUserId]);

    return null;
};
export default useGetRealTimeMessage;