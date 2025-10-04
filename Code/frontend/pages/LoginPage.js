// pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Formula1Background from '../assets/Formula1.png';
import '../styles/pages/login-page.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        navigate('/register');
    };

    return (
        <div className="login-page">
            {/* Фоновое изображение Formula1.png */}
            <div
             className="background-image background-top-left"
                style={{ backgroundImage: `url(${Formula1Background})` }}
            />

            <div className="login-content">
                <div className="login-form-container">
                    <div className="login-header">
                        <h1 className="login-title">F1 Prognosis</h1>
                        <p className="login-subtitle">Create an account</p>
                        <p className="login-instruction">Enter your email to sign up</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-signup"
                                onClick={handleSignUp}
                                disabled={loading}
                            >
                                Sign up with email
                            </button>

                            <button
                                type="submit"
                                className="btn btn-login"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Log in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;