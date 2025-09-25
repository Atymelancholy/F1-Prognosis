import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Leaderboard from './components/Leaderboard/Leaderboard';
// App.js - добавить новый маршрут
import ProfilePage from './pages/ProfilePage';

// В компоненте Routes добавить:

import './styles/App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Sidebar />
                    <div className="main-content">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/" element={<HomePage />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;