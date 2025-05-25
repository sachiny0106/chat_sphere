// This file is on the BACKEND.
// You need to update your backend models/messageModel.js
// with the `isRead` field as shown in the previous response.
// For clarity, here's what it should look like:

import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    isRead:{ // New field for read status
        type: Boolean,
        default: false
    }
},{timestamps:true});
export const Message = mongoose.model("Message", messageModel);