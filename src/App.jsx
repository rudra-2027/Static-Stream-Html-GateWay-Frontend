import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import DashBoard from './components/Dashboard/DashBoard';
import Active from './components/Button/Active';
import MenuBar from './components/MenuBar.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { PublicRoute } from './routes/PublicRoute.jsx';


function App() {
  const location = useLocation();
  const hideMenuBar = location.pathname === '/login' || location.pathname === '/email-verify' || location.pathname === "/eset-password";

  return (
    <div>
      {!hideMenuBar && <MenuBar />}
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route path="/active" element={
          <ProtectedRoute>
            <Active />
          </ProtectedRoute>
        } />
        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
