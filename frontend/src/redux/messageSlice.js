// frontend/src/redux/messageSlice.js
import {createSlice} from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages: [],
    },
    reducers:{
        setMessages:(state,action)=>{
            // console.log("[messageSlice] Reducer 'setMessages'. Payload:", action.payload);
            state.messages = Array.isArray(action.payload) ? action.payload : [];
        },
        updateMessagesReadStatus: (state, action) => {
            const { conversationPartnerId, messageIds } = action.payload;
            // console.log("[messageSlice] Reducer 'updateMessagesReadStatus'. Payload:", action.payload);

            if (!Array.isArray(state.messages) || !Array.isArray(messageIds) || messageIds.length === 0) {
                return;
            }
            state.messages = state.messages.map(msg => {
                if (msg.receiverId === conversationPartnerId && messageIds.includes(msg._id) && !msg.isRead) {
                    return { ...msg, isRead: true };
                }
                return msg;
            });
        }
    }
});
export const {setMessages, updateMessagesReadStatus } = messageSlice.actions;
export default messageSlice.reducer;