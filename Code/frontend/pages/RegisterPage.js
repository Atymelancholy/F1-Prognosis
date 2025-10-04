import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Formula1Background from '../assets/Formula1.png';
import '../styles/pages/login-page.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters long');
        }

        setLoading(true);

        try {
            const result = await register(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="login-page">
            {/* Фоновое изображение Formula1.png */}
            <div
                className="background-image"
                style={{ backgroundImage: `url(${Formula1Background})` }}
            />

            <div className="login-content">
                <div className="login-form-container">
                    <div className="login-header">
                        <h1 className="login-title">F1 Prognosis</h1>
                        <p className="login-subtitle">Create an account</p>
                        <p className="login-instruction">Enter your details to sign up</p>
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

                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-signup"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Sign up with email'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-login"
                                onClick={handleLoginRedirect}
                            >
                                Log in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;