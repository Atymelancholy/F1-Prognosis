package com.f1prognosis.backend.service;

import com.f1prognosis.backend.model.Prediction;
import com.f1prognosis.backend.model.GrandPrixResult;
import com.f1prognosis.backend.repository.PredictionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ScoringService {

    private final PredictionRepository predictionRepository;
    private final UserService userService;

    public ScoringService(PredictionRepository predictionRepository, UserService userService) {
        this.predictionRepository = predictionRepository;
        this.userService = userService;
    }

    public void calculateScores(GrandPrixResult result) {
        System.out.println("🎯 === CALCULATE SCORES CALLED ===");
        System.out.println("Grand Prix: " + result.getGrandPrix().getName());

        try {
            // Находим прогнозы по ID гран-при
            List<Prediction> predictions = predictionRepository.findByGrandPrixId(result.getGrandPrix().getId());
            System.out.println("📊 Found " + predictions.size() + " predictions");

            if (predictions.isEmpty()) {
                System.out.println("⚠️ No predictions found - nothing to calculate");
                return;
            }

            int totalProcessed = 0;
            int totalScoresGiven = 0;

            for (Prediction prediction : predictions) {
                try {
                    System.out.println("👤 Processing prediction for user: " + prediction.getUser().getUsername());

                    // Увеличиваем счетчик сделанных прогнозов
                    userService.incrementPredictionsMade(prediction.getUser().getId());

                    int score = calculatePredictionScore(prediction, result);
                    System.out.println("✅ Calculated score: " + score + " points");

                    // Сохраняем счет в прогноз
                    prediction.setScore(score);
                    predictionRepository.save(prediction);

                    // Обновляем общий счет пользователя
                    userService.updateUserScore(prediction.getUser().getId(), score);

                    // Если пользователь набрал очки - считаем это "победой"
                    if (score > 0) {
                        userService.incrementPredictionsWon(prediction.getUser().getId());
                        totalScoresGiven++;
                    }

                    totalProcessed++;
                    System.out.println("💾 Completed processing for user: " + prediction.getUser().getUsername());

                } catch (Exception e) {
                    System.err.println("❌ Error processing prediction for user " + prediction.getUser().getUsername() + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }

            System.out.println("🎉 === SCORING COMPLETED ===");
            System.out.println("Processed: " + totalProcessed + " predictions, Scores given: " + totalScoresGiven);

        } catch (Exception e) {
            System.err.println("💥 FATAL ERROR in calculateScores: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error calculating scores: " + e.getMessage(), e);
        }
    }

    private int calculatePredictionScore(Prediction prediction, GrandPrixResult result) {
        int score = 0;
        int correctPodiums = 0;

        // Приводим к одному регистру для сравнения
        String predictedPole = safeTrim(prediction.getPolePositionDriver());
        String actualPole = safeTrim(result.getPolePositionDriver());

        String predictedP1 = safeTrim(prediction.getP1Driver());
        String actualP1 = safeTrim(result.getP1Driver());

        String predictedP2 = safeTrim(prediction.getP2Driver());
        String actualP2 = safeTrim(result.getP2Driver());

        String predictedP3 = safeTrim(prediction.getP3Driver());
        String actualP3 = safeTrim(result.getP3Driver());

        String predictedFastest = safeTrim(prediction.getFastestLapDriver());
        String actualFastest = safeTrim(result.getFastestLapDriver());

        System.out.println("🔍 Comparing predictions vs actual results:");
        System.out.println("  Pole: " + predictedPole + " vs " + actualPole);
        System.out.println("  P1: " + predictedP1 + " vs " + actualP1);
        System.out.println("  P2: " + predictedP2 + " vs " + actualP2);
        System.out.println("  P3: " + predictedP3 + " vs " + actualP3);
        System.out.println("  Fastest: " + predictedFastest + " vs " + actualFastest);

        // Поул-позиция: 3 очка
        if (predictedPole.equals(actualPole)) {
            score += 3;
            userService.incrementCorrectPolePositions(prediction.getUser().getId());
            System.out.println("  ✅ Correct pole position! +3 points");
        }

        // Подиум: 5 очков за каждое правильное место
        if (predictedP1.equals(actualP1)) {
            score += 5;
            correctPodiums++;
            System.out.println("  ✅ Correct P1! +5 points");
        }
        if (predictedP2.equals(actualP2)) {
            score += 5;
            correctPodiums++;
            System.out.println("  ✅ Correct P2! +5 points");
        }
        if (predictedP3.equals(actualP3)) {
            score += 5;
            correctPodiums++;
            System.out.println("  ✅ Correct P3! +5 points");
        }

        // Увеличиваем счетчик правильных подиумов
        if (correctPodiums > 0) {
            userService.incrementCorrectPodiums(prediction.getUser().getId(), correctPodiums);
            System.out.println("  ✅ Correct podiums: " + correctPodiums);
        }

        // Быстрый круг: 2 очка
        if (predictedFastest.equals(actualFastest)) {
            score += 2;
            userService.incrementCorrectFastestLaps(prediction.getUser().getId());
            System.out.println("  ✅ Correct fastest lap! +2 points");
        }

        System.out.println("  📈 Total score for " + prediction.getUser().getUsername() + ": " + score + " points");
        return score;
    }

    private String safeTrim(String str) {
        return (str == null) ? "" : str.toUpperCase().trim();
    }
}