// services/adminService.js
import api from './api';

export const adminService = {
    // Базовый метод для всех запросов с обработкой ошибок
    makeRequest: async (method, url, data = null) => {
        try {
            const config = {
                method,
                url,
                data
            };

            const response = await api(config);
            return response.data;
        } catch (error) {
            console.error(`Admin API error (${method} ${url}):`, error.response?.data || error.message);

            if (error.response?.status === 403) {
                throw new Error('Access denied. Please ensure you are logged in as administrator.');
            }

            if (error.response?.status === 401) {
                throw new Error('Authentication required. Please log in again.');
            }

            throw new Error(error.response?.data?.message || `API request failed: ${error.message}`);
        }
    },

    // Получить все гран-при
    getAvailableGrandPrix: async () => {
        return adminService.makeRequest('get', '/admin/results/available-grandprix');
    },

    // Проверить наличие результатов
    hasResults: async (grandPrixId) => {
        try {
            await adminService.makeRequest('get', `/admin/results/has-results/${grandPrixId}`);
            return true;
        } catch (error) {
            if (error.message.includes('404') || error.message.includes('Not Found')) {
                return false;
            }
            throw error;
        }
    },

    // Получить результаты
    getResults: async (grandPrixId) => {
        return adminService.makeRequest('get', `/admin/results/results/${grandPrixId}`);
    },

    // Сохранить результаты
    submitResults: async (resultData) => {
        return adminService.makeRequest('post', '/admin/results/submit-results', resultData);
    },

    // Удалить результаты
    deleteResults: async (grandPrixId) => {
        return adminService.makeRequest('delete', `/admin/results/delete-results/${grandPrixId}`);
    },

    // services/adminService.js

    recalculateScores: async (grandPrixId) => {
        return adminService.makeRequest('post', `/admin/results/recalculate-scores/${grandPrixId}`);
    },

    recalculateAllScores: async () => {
        return adminService.makeRequest('post', '/admin/results/recalculate-all-scores');
    },

    testScoring: async (grandPrixId) => {
        return adminService.makeRequest('post', `/admin/results/test-scoring/${grandPrixId}`);
    },

    createTestPredictions: async (grandPrixId) => {
        return adminService.makeRequest('post', `/admin/results/create-test-predictions/${grandPrixId}`);
    }
};