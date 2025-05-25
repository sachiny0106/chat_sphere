// frontend/src/redux/userSlice.js
import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        authUser:null,
        otherUsers:null,
        selectedUser:null,
        onlineUsers:null,
        typingUsers: {},
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser = action.payload;
        },
        setOtherUsers:(state, action)=>{
            state.otherUsers = action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload;
            if (typeof state.typingUsers !== 'object' || state.typingUsers === null) {
                state.typingUsers = {};
            }
            if (action.payload && action.payload._id && state.typingUsers[action.payload._id]) {
                state.typingUsers[action.payload._id] = false;
            }
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        },
        setTypingUser: (state, action) => {
            const { userId, isTyping } = action.payload;
            if (typeof state.typingUsers !== 'object' || state.typingUsers === null) {
                state.typingUsers = {};
            }
            state.typingUsers[userId] = isTyping;
        },
    }
});
export const {
    setAuthUser,
    setOtherUsers,
    setSelectedUser,
    setOnlineUsers,
    setTypingUser,
} = userSlice.actions;
export default userSlice.reducer;