package com.f1prognosis.backend.service;

import com.f1prognosis.backend.model.Prediction;
import com.f1prognosis.backend.model.GrandPrixResult;
import com.f1prognosis.backend.repository.PredictionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoringService {

    private final PredictionRepository predictionRepository;
    private final UserService userService;

    public ScoringService(PredictionRepository predictionRepository, UserService userService) {
        this.predictionRepository = predictionRepository;
        this.userService = userService;
    }

    public void calculateScores(GrandPrixResult result) {
        List<Prediction> predictions = predictionRepository.findByGrandPrix(result.getGrandPrix());

        for (Prediction prediction : predictions) {
            int score = calculatePredictionScore(prediction, result);
            prediction.setScore(score);
            predictionRepository.save(prediction);

            // Обновляем общий счет пользователя
            userService.updateUserScore(prediction.getUser().getId(), score);
        }
    }

    private int calculatePredictionScore(Prediction prediction, GrandPrixResult result) {
        int score = 0;

        // Поул-позиция: 3 очка
        if (prediction.getPolePositionDriver().equals(result.getPolePositionDriver())) {
            score += 3;
        }

        // Подиум (1-2-3 места): 5 очков за каждое правильное место
        if (prediction.getP1Driver().equals(result.getP1Driver())) score += 5;
        if (prediction.getP2Driver().equals(result.getP2Driver())) score += 5;
        if (prediction.getP3Driver().equals(result.getP3Driver())) score += 5;

        // Быстрый круг: 2 очка
        if (prediction.getFastestLapDriver().equals(result.getFastestLapDriver())) {
            score += 2;
        }

        return score;
    }
}