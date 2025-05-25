// backend/socket/socket.js
import { Server } from "socket.io";

let io;
const userSocketMap = {};

export const initializeSocketIO = (httpServerInstance) => {
    if (io) {
        console.warn("[Socket.IO] Socket.IO server is already initialized.");
        return io;
    }

    const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

    io = new Server(httpServerInstance, {
        cors: {
            origin: [
                'http://localhost:3000',
                frontendOrigin
            ],
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });


    io.on('connection', (socket) => {
        const { userId } = socket.handshake.query;

        if (userId && userId !== "undefined" && userId !== "null") {
            userSocketMap[userId] = socket.id;
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        } else {
            console.warn(`[Socket.IO] Connection from socketId '${socket.id}' received without a valid userId in query params. Query:`, socket.handshake.query);
        }

        socket.on('disconnect', () => {
            if (userId && userId !== "undefined" && userId !== "null" && userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId];
                io.emit('getOnlineUsers', Object.keys(userSocketMap));
            }
        });
    });

    return io;
};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

export { io };