// frontend/src/hooks/useGetRealTimeMessage.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, updateMessagesReadStatus } from "../redux/messageSlice";
import { BASE_URL } from "../config";
import axios from "axios";

const useGetRealTimeMessage = () => {
    const socketFromRedux = useSelector(store => store.socket.socket);
    const authUserId = useSelector(store => store.user.authUser?._id);
    const selectedUserId = useSelector(store => store.user.selectedUser?._id);
    const dispatch = useDispatch();

    useEffect(() => {
        if (socketFromRedux && socketFromRedux.connected && authUserId) {

            const handleNewMessage = async (newMessage) => {
                let messageToStore = { ...newMessage };

                if (selectedUserId && newMessage.senderId === selectedUserId && newMessage.receiverId === authUserId) {
                    try {
                        if (!BASE_URL) {
                            console.error("[useGetRealTimeMessage] BASE_URL is undefined, cannot mark message as read.");
                        } else {
                            await axios.put(`${BASE_URL}/api/v1/message/read/${selectedUserId}`);
                            messageToStore.isRead = true;
                        }
                    } catch (err) {
                         console.error("[useGetRealTimeMessage] Error marking new message as read via API:", err.response?.data || err.message);
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
                socketFromRedux.off("newMessage", handleNewMessage);
                socketFromRedux.off("messagesRead", handleMessagesRead);
            };
        } 
    }, [socketFromRedux, dispatch, selectedUserId, authUserId]);

    return null;
};
export default useGetRealTimeMessage;