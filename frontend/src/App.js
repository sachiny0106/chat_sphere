// frontend/src/App.js
import Signup from './components/Signup';
import './App.css'; // Keep for truly global styles if any, but index.css is primary
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers, setTypingUser } from './redux/userSlice';
import { BASE_URL } from './config';

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const authUserFromStore = useSelector(store => store.user.authUser);
  const currentTheme = useSelector(store => store.theme.currentTheme);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    // This sets the data-theme on the <html> element for DaisyUI
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  // ... (Socket connection useEffect - keep the last robust version I provided) ...
  useEffect(() => {
    const currentAuthUserId = authUserFromStore?._id;
    if (currentAuthUserId) {
      if (!socketRef.current ||
          (socketRef.current.io && socketRef.current.io.opts.query.userId !== currentAuthUserId) ||
          !socketRef.current.connected) {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        socketRef.current = null;
        const newSocket = io(BASE_URL, {
          query: { userId: currentAuthUserId },
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
        });
        socketRef.current = newSocket;
        newSocket.on('connect', () => dispatch(setSocket(newSocket)));
        newSocket.on('connect_error', (err) => {
          console.error("[App.js] Socket connection error:", err.message);
          if (socketRef.current && socketRef.current.id === newSocket.id) {
            socketRef.current.disconnect();
            socketRef.current = null;
          }
          dispatch(setSocket(null));
        });
        newSocket.on('disconnect', (reason) => {
          if (socketRef.current && socketRef.current.id === newSocket.id) {
            dispatch(setSocket(null));
            socketRef.current = null;
          }
        });
        newSocket.on('getOnlineUsers', (onlineUsers) => dispatch(setOnlineUsers(onlineUsers)));
        newSocket.on("typing_started_from_server", (data) => {
          const currentAuth = authUserFromStore;
          if (currentAuth && data.receiverId === currentAuth._id) {
            dispatch(setTypingUser({ userId: data.senderId, isTyping: true }));
          }
        });
        newSocket.on("typing_stopped_from_server", (data) => {
          const currentAuth = authUserFromStore;
          if (currentAuth && data.receiverId === currentAuth._id) {
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
      if (socketRef.current && (!authUserFromStore || socketRef.current.io.opts.query.userId !== authUserFromStore?._id)) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [authUserFromStore?._id, dispatch]);


  return (
    // This div will take full viewport height and center its content (the RouterProvider's output)
    // This is suitable if HomePage is the main content you want centered.
    // Login/Signup pages will manage their own full-screen centering.
    <div className="app-container w-full min-h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;