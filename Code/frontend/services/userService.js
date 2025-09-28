// services/userService.js
import api from './api';

export const userService = {
    // ОБНОВЛЕНО: Отправляем FormData
    updateAvatar: async (formData) => {
        console.log('🔄 Sending FormData to /api/user/avatar');

        const response = await api.put('/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Важно!
            }
        });
        return response.data;
    },

    // Удалить аватар
    removeAvatar: async () => {
        const response = await api.delete('/user/avatar');
        return response.data;
    },

    // Получить профиль пользователя
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    // Тестовый endpoint
    testAvatarEndpoint: async (testData) => {
        const response = await api.post('/user/avatar-test', testData);
        return response.data;
    },
    // Добавьте в userService.js
    testAvatarFormData: async (formData) => {
        const response = await api.post('/user/avatar-test-formdata', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

};