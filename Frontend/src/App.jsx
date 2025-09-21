import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { healthCheck } from "./app/Slices/healthcheck";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import lodder from "./assets/lodder.gif";
import lightLoader from "./assets/lightLoader.gif";

function App() {
  const dispatch = useDispatch();

  // added dark ode functionality
  const darkMode = useSelector((state) => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

 


  useEffect(() => {
    setInterval(() => {
      dispatch(healthCheck());
    }, 5 * 60 * 1000);
  }, []);

  return (
    <>
      <Outlet />
      <div id="popup-models" className="bg-purple-400 relative"></div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </>
  );
}

export default App;
