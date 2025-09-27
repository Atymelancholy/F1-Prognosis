// AvatarUpload.js - обновите компонент
import React, { useState, useRef } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

const AvatarUpload = ({ currentAvatar, onAvatarChange }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentAvatar);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);
    const { user } = useAuth(); // Только для чтения

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Проверяем размер файла (макс 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setMessage('File size should be less than 2MB');
            return;
        }

        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
            setMessage('Please select an image file');
            return;
        }

        setSelectedImage(file);

        // Создаем preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('avatar', selectedImage);

            console.log('📤 Sending FormData with file:', {
                fileName: selectedImage.name,
                fileSize: selectedImage.size,
                fileType: selectedImage.type
            });

            const response = await userService.updateAvatar(formData);

            console.log('✅ Avatar update response:', response);

            // ВЫЗЫВАЕМ callback вместо setUser
            if (onAvatarChange) {
                onAvatarChange(response);
            }

            setMessage('Avatar updated successfully!');
            setSelectedImage(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (error) {
            console.error('❌ Avatar upload error:', error);
            setMessage('Error uploading avatar: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await userService.removeAvatar();

            // ВЫЗЫВАЕМ callback вместо setUser
            if (onAvatarChange) {
                onAvatarChange(response);
            }

            setPreviewUrl(null);
            setMessage('Avatar removed successfully!');
        } catch (error) {
            setMessage('Error removing avatar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="avatar-upload">
            <div className="avatar-preview">
                {previewUrl ? (
                    <img src={previewUrl} alt="Profile Avatar" className="avatar-image" />
                ) : (
                    <div className="avatar-placeholder">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                )}
            </div>

            <div className="avatar-actions">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                <button
                    onClick={triggerFileInput}
                    className="btn btn-primary"
                    disabled={loading}
                >
                    Choose Image
                </button>

                {selectedImage && (
                    <button
                        onClick={handleUpload}
                        className="btn btn-success"
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload Avatar'}
                    </button>
                )}

                {previewUrl && !selectedImage && (
                    <button
                        onClick={handleRemove}
                        className="btn btn-danger"
                        disabled={loading}
                    >
                        {loading ? 'Removing...' : 'Remove Avatar'}
                    </button>
                )}
            </div>

            {selectedImage && (
                <div className="file-info">
                    Selected: {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
                </div>
            )}

            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="upload-help">
                <p>Supported formats: JPEG, PNG, GIF</p>
                <p>Max file size: 2MB</p>
            </div>
        </div>
    );
};

export default AvatarUpload;