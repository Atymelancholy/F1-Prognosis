import api from './api';

export const dataService = {
    getGrandPrix: async () => {
        const response = await api.get('/grandprix');
        return response.data;
    },

    getGrandPrixById: async (id) => {
        const response = await api.get(`/grandprix/${id}`);
        return response.data;
    },

    getPrediction: async (grandPrixId) => {
        const response = await api.get(`/predictions?grandPrixId=${grandPrixId}`);
        return response.data;
    },

    savePrediction: async (predictionData) => {
        const response = await api.post('/predictions', predictionData);
        return response.data;
    },

    getLeaderboard: async () => {
        const response = await api.get('/leaderboard');
        return response.data;
    },
    // services/dataService.js - добавить этот метод
    getGrandPrixResults: async (grandPrixId) => {
        const response = await api.get(`/results/${grandPrixId}/dto`);
        return response.data;
    }
};