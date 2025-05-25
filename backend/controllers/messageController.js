// backend/controllers/messageController.js
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js"; // io is imported here

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message // isRead defaults to false from model
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };

        await Promise.all([gotConversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId && io){ // Check if io is initialized
            io.to(receiverSocketId).emit("newMessage", newMessage);
        } else if (!io) {
            console.warn("[sendMessage Controller] Socket.IO instance (io) is not initialized. Cannot emit newMessage.");
        }
        return res.status(201).json({
            newMessage
        });
    } catch (error) {
        console.error("[sendMessage Controller] Error:", error);
        res.status(500).json({ message: "Error sending message" });
    }
};

// ***** THIS IS THE FUNCTION THAT WAS LIKELY MISSING ITS EXPORT *****
export const getMessage = async (req,res) => {
    try {
        const otherUserId = req.params.id; // This is the user whose messages we are fetching (selectedUser)
        const currentUserId = req.id;    // This is the logged-in user (authUser)

        const conversation = await Conversation.findOne({
            participants:{$all : [currentUserId, otherUserId]}
        }).populate("messages");

        if (conversation && conversation.messages && conversation.messages.length > 0) {
            const messagesToMarkAsRead = conversation.messages.filter(
                msg => msg.senderId.toString() === otherUserId &&    // Message sent by the other user
                       msg.receiverId.toString() === currentUserId && // Received by me (current user)
                       !msg.isRead                                  // And is unread
            );

            const messageIdsToUpdate = messagesToMarkAsRead.map(msg => msg._id);

            if (messageIdsToUpdate.length > 0) {
                await Message.updateMany(
                    { _id: { $in: messageIdsToUpdate } },
                    { $set: { isRead: true } }
                );

                // Emit event to the sender of these messages (otherUserId)
                // to let them know their messages to currentUserId have been read.
                const senderSocketId = getReceiverSocketId(otherUserId); // Socket of the 'other user'
                if (senderSocketId && io) { // Check if io is initialized
                    io.to(senderSocketId).emit("messagesRead", {
                        conversationPartnerId: currentUserId, // The user who just read the messages
                        messageIds: messageIdsToUpdate
                    });
                } else if (!io) {
                     console.warn("[getMessage Controller] Socket.IO instance (io) is not initialized. Cannot emit messagesRead.");
                }
                // Update the messages in the current response to reflect they are now read for the client fetching
                conversation.messages.forEach(msg => {
                    if (messageIdsToUpdate.includes(msg._id)) {
                        msg.isRead = true;
                    }
                });
            }
        }
        return res.status(200).json(conversation?.messages || []); // Ensure sending an array
    } catch (error) {
        console.error("[getMessage Controller] Error:", error);
        res.status(500).json({ message: "Error fetching messages" });
    }
};

export const markConversationAsRead = async (req, res) => {
    try {
        const currentUserId = req.id; // The one who is reading
        const otherUserId = req.params.otherUserId; // The sender of messages being read by currentUserId

        const result = await Message.updateMany(
            { senderId: otherUserId, receiverId: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );

        if (result.modifiedCount > 0) {
            const messagesNowRead = await Message.find({
                senderId: otherUserId, receiverId: currentUserId, isRead: true
            }).select('_id');

            const otherUserSocketId = getReceiverSocketId(otherUserId);
            if (otherUserSocketId && io) { // Check if io is initialized
                io.to(otherUserSocketId).emit("messagesRead", {
                    conversationPartnerId: currentUserId, // User who read the messages
                    messageIds: messagesNowRead.map(m => m._id)
                });
            } else if (!io) {
                console.warn("[markConversationAsRead Controller] Socket.IO instance (io) is not initialized. Cannot emit messagesRead.");
            }
        }
        res.status(200).json({ message: "Messages marked as read.", count: result.modifiedCount });
    } catch (error) {
        console.error("[markConversationAsRead Controller] Error:", error);
        res.status(500).json({ message: "Internal server error while marking messages as read" });
    }
};