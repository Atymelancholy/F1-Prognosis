import React, { useState, useRef, useEffect } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

const AvatarUpload = ({ currentAvatar, onAvatarChange, showControls = false }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);
    const { user } = useAuth();

    const createDataUrl = (base64Data, mimeType = 'image/jpeg') => {
        if (!base64Data) return '';
        return `data:${mimeType};base64,${base64Data}`;
    };

    useEffect(() => {
        if (currentAvatar) {
            const url = currentAvatar.startsWith('data:')
                ? currentAvatar
                : createDataUrl(currentAvatar);
            setPreviewUrl(url);
        } else {
            setPreviewUrl('');
        }
    }, [currentAvatar]);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setMessage('File size should be less than 2MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setMessage('Please select an image file');
            return;
        }

        setSelectedImage(file);
        setMessage('');

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('avatar', selectedImage);

            const response = await userService.updateAvatar(formData);

            // Создаем data URL для preview
            if (response.avatar) {
                const dataUrl = createDataUrl(response.avatar);
                setPreviewUrl(dataUrl);
            }

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
            if (currentAvatar) {
                const dataUrl = createDataUrl(currentAvatar);
                setPreviewUrl(dataUrl);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await userService.removeAvatar();

            setPreviewUrl('');

            if (onAvatarChange) {
                onAvatarChange(response);
            }

            setMessage('Avatar removed successfully!');
        } catch (error) {
            console.error('❌ Avatar remove error:', error);
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
            <div className="avatar-preview" onClick={triggerFileInput}>
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Avatar"
                        className="avatar-image"
                        onError={(e) => {
                            console.error('Error loading avatar image');
                            setPreviewUrl('');
                        }}
                    />
                ) : (
                    <div className="avatar-placeholder">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                )}
            </div>

            {/* Скрытый input для выбора файла */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* Показываем кнопки только когда showControls = true */}
            {showControls && (
                <div className="avatar-controls">
                    {selectedImage ? (
                        <div className="avatar-actions">
                            <button onClick={handleUpload} className="btn btn-success" disabled={loading}>
                                {loading ? 'Uploading...' : 'Upload Avatar'}
                            </button>
                            <button onClick={() => setSelectedImage(null)} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="avatar-actions">
                            <button onClick={triggerFileInput} className="btn btn-primary">
                                Change Image
                            </button>
                            {previewUrl && (
                                <button onClick={handleRemove} className="btn btn-danger" disabled={loading}>
                                    {loading ? 'Removing...' : 'Remove Avatar'}
                                </button>
                            )}
                        </div>
                    )}

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
                </div>
            )}
        </div>
    );
};

export default AvatarUpload;