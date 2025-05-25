import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../redux/themeSlice';
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector(state => state.theme);

  const availableThemes = ["light", "dark"]; // Add more if you defined them in tailwind.config
  // const availableThemes = ["light", "dark", "mycustomlight", "mycustomdark"];


  const toggleTheme = () => {
    const currentIndex = availableThemes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    dispatch(setTheme(availableThemes[nextIndex]));
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle btn-sm tooltip tooltip-bottom"
      data-tip={`Switch to ${availableThemes[(availableThemes.indexOf(currentTheme) + 1) % availableThemes.length]} mode`}
    >
      {currentTheme === 'light' || currentTheme === 'mycustomlight' ? (
        <FiMoon className="w-5 h-5" />
      ) : (
        <FiSun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;