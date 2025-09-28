// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Leaderboard from './components/Leaderboard/Leaderboard';
import ProfilePage from './pages/ProfilePage';
import AdminResultsPage from './pages/AdminResultsPage';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import AdminRoute from './components/Layout/AdminRoute';

// App.js
import './styles/index.css'; // Импортируем главный CSS файл

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

                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/results"
                                element={
                                    <AdminRoute>
                                        <AdminResultsPage />
                                    </AdminRoute>
                                }
                            />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;