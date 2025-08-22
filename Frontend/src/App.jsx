import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UploadVideo from './components/UploadVideo';
import Videoplayer from './pages/Videoplayer';
import Reels from './pages/Reels';
import Channel from './pages/Channel';
import Subscription from './pages/Subscription.jsx';
import History from './pages/History.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Reels" element={<Reels />} />
        <Route
          path="/channel"
          element={
            <ProtectedRoute>
              <Channel />
            </ProtectedRoute>
          }
        />
        <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadVideo />
          </ProtectedRoute>
          }
        />
        <Route
        path="/Subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
        ></Route>
        <Route path="/watch" element={<Videoplayer />} />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
