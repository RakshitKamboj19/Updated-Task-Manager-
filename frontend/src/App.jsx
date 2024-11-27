import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Task from "./pages/Task";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/otp";
import { saveProfile } from "./redux/actions/authActions";
import NotFound from "./pages/NotFound";

function App() {

  const authState = useSelector(state => state.authReducer);
  const dispatch = useDispatch();
  const [Dark,setDark] = React.useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    dispatch(saveProfile(token));
  }, [authState.isLoggedIn, dispatch]);


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home Dark={Dark} setDark={setDark} />} />
          <Route path="/signup" element={authState.isLoggedIn ? <Navigate to="/" /> : <Signup  Dark={Dark} setDark={setDark}/>} />
          <Route path="/login" element={<Login Dark={Dark} setDark={setDark} />} />
          <Route path="/otp" element={<Otp Dark={Dark} setDark={setDark} />} />
          <Route path="/tasks/add" element={authState.isLoggedIn ? <Task Dark={Dark} setDark={setDark} /> : <Navigate to="/login" state={{ redirectUrl: "/tasks/add" }} />} />
          <Route path="/tasks/:taskId" element={authState.isLoggedIn ? <Task Dark={Dark} setDark={setDark} /> : <Navigate to="/login" state={{ redirectUrl: window.location.pathname }} />} />
          <Route path="*" element={<NotFound Dark={Dark} setDark={setDark} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
