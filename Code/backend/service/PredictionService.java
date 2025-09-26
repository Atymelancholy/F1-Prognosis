package com.f1prognosis.backend.service;

import com.f1prognosis.backend.model.Prediction;
import com.f1prognosis.backend.model.User;
import com.f1prognosis.backend.model.GrandPrix;
import com.f1prognosis.backend.repository.PredictionRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final GrandPrixService grandPrixService;

    public PredictionService(PredictionRepository predictionRepository, GrandPrixService grandPrixService) {
        this.predictionRepository = predictionRepository;
        this.grandPrixService = grandPrixService;
    }

    public Optional<Prediction> getUserPrediction(User user, GrandPrix grandPrix) {
        return predictionRepository.findByUserAndGrandPrix(user, grandPrix);
    }

    public Prediction saveOrUpdatePrediction(User user, GrandPrix grandPrix,
                                             String polePosition, String p1, String p2, String p3, String fastestLap) {

        if (!grandPrixService.isPredictionsOpen(grandPrix)) {
            throw new RuntimeException("Predictions are closed for this Grand Prix");
        }

        Optional<Prediction> existingPrediction = getUserPrediction(user, grandPrix);

        Prediction prediction;
        if (existingPrediction.isPresent()) {
            prediction = existingPrediction.get();
        } else {
            prediction = new Prediction();
            prediction.setUser(user);
            prediction.setGrandPrix(grandPrix);
        }

        prediction.setPolePositionDriver(polePosition);
        prediction.setP1Driver(p1);
        prediction.setP2Driver(p2);
        prediction.setP3Driver(p3);
        prediction.setFastestLapDriver(fastestLap);

        return predictionRepository.save(prediction);
    }
}