// frontend/src/App.js
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import HomePage from './components/HomePage';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers, setTypingUser } from './redux/userSlice';
import { BASE_URL } from './config';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

function App() {
  const authUser = useSelector((state) => state.user.authUser);
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const userId = authUser?._id;
    if (userId) {
      if (!socketRef.current || socketRef.current.io.opts.query.userId !== userId) {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        const newSocket = io(BASE_URL, {
          query: { userId },
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
        });
        socketRef.current = newSocket;
        newSocket.on('connect', () => dispatch(setSocket(newSocket)));
        newSocket.on('connect_error', (err) => {
          console.error("Socket connection error:", err.message);
          newSocket.disconnect();
          dispatch(setSocket(null));
        });
        newSocket.on('disconnect', () => dispatch(setSocket(null)));
        newSocket.on('getOnlineUsers', (users) => dispatch(setOnlineUsers(users)));
        newSocket.on("typing_started_from_server", (data) => {
          if (data.receiverId === userId) {
            dispatch(setTypingUser({ userId: data.senderId, isTyping: true }));
          }
        });
        newSocket.on("typing_stopped_from_server", (data) => {
          if (data.receiverId === userId) {
            dispatch(setTypingUser({ userId: data.senderId, isTyping: false }));
          }
        });
      }
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        dispatch(setSocket(null));
      }
    }
    return () => {
      if (socketRef.current && (!authUser || socketRef.current.io.opts.query.userId !== authUser._id)) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [authUser?._id, dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: authUser ? <HomePage /> : <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: authUser ? <Navigate to="/" /> : <Login />,
    },
    {
      path: "/signup",
      element: authUser ? <Navigate to="/" /> : <Signup />,
    },
  ]);

  return (
    <div className="app-container w-full min-h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
