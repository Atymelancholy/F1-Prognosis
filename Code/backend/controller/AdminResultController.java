package com.f1prognosis.backend.controller;

import com.f1prognosis.backend.model.GrandPrix;
import com.f1prognosis.backend.model.GrandPrixResult;
import com.f1prognosis.backend.service.GrandPrixService;
import com.f1prognosis.backend.service.ScoringService;
import com.f1prognosis.backend.repository.GrandPrixResultRepository;
import com.f1prognosis.backend.repository.PredictionRepository;
import com.f1prognosis.backend.repository.UserRepository;
import com.f1prognosis.backend.model.User;
import com.f1prognosis.backend.model.Prediction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/results")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminResultController {

    private final GrandPrixService grandPrixService;
    private final ScoringService scoringService;
    private final GrandPrixResultRepository grandPrixResultRepository;
    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;

    public AdminResultController(GrandPrixService grandPrixService,
                                 ScoringService scoringService,
                                 GrandPrixResultRepository grandPrixResultRepository,
                                 PredictionRepository predictionRepository,
                                 UserRepository userRepository) {
        this.grandPrixService = grandPrixService;
        this.scoringService = scoringService;
        this.grandPrixResultRepository = grandPrixResultRepository;
        this.predictionRepository = predictionRepository;
        this.userRepository = userRepository;
    }

    public static class ResultInputDto {
        private Long grandPrixId;
        private String polePositionDriver;
        private String p1Driver;
        private String p2Driver;
        private String p3Driver;
        private String fastestLapDriver;

        public Long getGrandPrixId() { return grandPrixId; }
        public void setGrandPrixId(Long grandPrixId) { this.grandPrixId = grandPrixId; }
        public String getPolePositionDriver() { return polePositionDriver; }
        public void setPolePositionDriver(String polePositionDriver) { this.polePositionDriver = polePositionDriver; }
        public String getP1Driver() { return p1Driver; }
        public void setP1Driver(String p1Driver) { this.p1Driver = p1Driver; }
        public String getP2Driver() { return p2Driver; }
        public void setP2Driver(String p2Driver) { this.p2Driver = p2Driver; }
        public String getP3Driver() { return p3Driver; }
        public void setP3Driver(String p3Driver) { this.p3Driver = p3Driver; }
        public String getFastestLapDriver() { return fastestLapDriver; }
        public void setFastestLapDriver(String fastestLapDriver) { this.fastestLapDriver = fastestLapDriver; }
    }

    @GetMapping("/available-grandprix")
    public ResponseEntity<List<GrandPrix>> getAvailableGrandPrix() {
        List<GrandPrix> grandPrixList = grandPrixService.getAllGrandPrix();
        return ResponseEntity.ok(grandPrixList);
    }

    @GetMapping("/has-results/{grandPrixId}")
    public ResponseEntity<Boolean> hasResults(@PathVariable Long grandPrixId) {
        GrandPrix grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                .orElseThrow(() -> new RuntimeException("Grand Prix not found"));
        boolean hasResults = grandPrixResultRepository.existsByGrandPrix(grandPrix);
        return ResponseEntity.ok(hasResults);
    }

    @GetMapping("/results/{grandPrixId}")
    public ResponseEntity<GrandPrixResult> getResults(@PathVariable Long grandPrixId) {
        GrandPrix grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                .orElseThrow(() -> new RuntimeException("Grand Prix not found"));
        Optional<GrandPrixResult> result = grandPrixResultRepository.findByGrandPrix(grandPrix);
        return result.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/submit-results")
    public ResponseEntity<String> submitResults(@RequestBody ResultInputDto resultInput) {
        try {
            System.out.println("=== 🚀 SUBMIT RESULTS STARTED ===");

            GrandPrix grandPrix = grandPrixService.getGrandPrixById(resultInput.getGrandPrixId())
                    .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

            System.out.println("Processing Grand Prix: " + grandPrix.getName());

            Optional<GrandPrixResult> existingResult = grandPrixResultRepository.findByGrandPrix(grandPrix);

            GrandPrixResult result;
            if (existingResult.isPresent()) {
                result = existingResult.get();
                System.out.println("Updating existing results");
            } else {
                result = new GrandPrixResult();
                result.setGrandPrix(grandPrix);
                System.out.println("Creating new results");
            }

            result.setPolePositionDriver(resultInput.getPolePositionDriver().toUpperCase().trim());
            result.setP1Driver(resultInput.getP1Driver().toUpperCase().trim());
            result.setP2Driver(resultInput.getP2Driver().toUpperCase().trim());
            result.setP3Driver(resultInput.getP3Driver().toUpperCase().trim());
            result.setFastestLapDriver(resultInput.getFastestLapDriver().toUpperCase().trim());

            GrandPrixResult savedResult = grandPrixResultRepository.save(result);
            System.out.println("✅ Results saved with ID: " + savedResult.getId());

            // 🔥 ВАЖНО: Запускаем подсчет очков
            System.out.println("🔥 Starting score calculation...");
            scoringService.calculateScores(savedResult);
            System.out.println("✅ Score calculation completed");

            grandPrixService.updateGrandPrixStatus(grandPrix.getId(), GrandPrix.Status.COMPLETED);

            String action = existingResult.isPresent() ? "updated" : "submitted";
            return ResponseEntity.ok("Results " + action + " and scores calculated successfully for " + grandPrix.getName());

        } catch (Exception e) {
            System.err.println("❌ Error submitting results: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error submitting results: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-results/{grandPrixId}")
    public ResponseEntity<String> deleteResults(@PathVariable Long grandPrixId) {
        try {
            GrandPrix grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                    .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

            Optional<GrandPrixResult> result = grandPrixResultRepository.findByGrandPrix(grandPrix);
            if (result.isEmpty()) {
                return ResponseEntity.badRequest().body("No results found for this Grand Prix");
            }

            grandPrixResultRepository.delete(result.get());
            grandPrixService.updateGrandPrixStatus(grandPrixId, GrandPrix.Status.CLOSED);

            return ResponseEntity.ok("Results deleted successfully for " + grandPrix.getName());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting results: " + e.getMessage());
        }
    }

    @PostMapping("/create-test-predictions/{grandPrixId}")
    public ResponseEntity<String> createTestPredictions(@PathVariable Long grandPrixId) {
        try {
            GrandPrix grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                    .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

            List<User> users = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == User.Role.USER)
                    .collect(java.util.stream.Collectors.toList());

            if (users.isEmpty()) {
                return ResponseEntity.badRequest().body("No users found to create test predictions");
            }

            String[] testDrivers = {"VERSTAPPEN", "LECLERC", "SAINZ", "HAMILTON", "RUSSELL"};
            int predictionsCreated = 0;

            for (User user : users) {
                Optional<Prediction> existingPrediction = predictionRepository.findByUserAndGrandPrix(user, grandPrix);

                if (existingPrediction.isEmpty()) {
                    Prediction prediction = new Prediction();
                    prediction.setUser(user);
                    prediction.setGrandPrix(grandPrix);
                    prediction.setPolePositionDriver(testDrivers[0]);
                    prediction.setP1Driver(testDrivers[0]);
                    prediction.setP2Driver(testDrivers[1]);
                    prediction.setP3Driver(testDrivers[2]);
                    prediction.setFastestLapDriver(testDrivers[0]);

                    predictionRepository.save(prediction);
                    predictionsCreated++;
                }
            }

            return ResponseEntity.ok("Created " + predictionsCreated + " test predictions for " + grandPrix.getName());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating test predictions: " + e.getMessage());
        }
    }

    @PostMapping("/recalculate-scores/{grandPrixId}")
    public ResponseEntity<String> recalculateScores(@PathVariable Long grandPrixId) {
        try {
            System.out.println("=== RECALCULATING SCORES FOR GRAND PRIX ===");

            GrandPrix grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                    .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

            GrandPrixResult result = grandPrixResultRepository.findByGrandPrix(grandPrix)
                    .orElseThrow(() -> new RuntimeException("Results not found for this Grand Prix"));

            System.out.println("Recalculating scores for: " + grandPrix.getName());
            scoringService.calculateScores(result);

            return ResponseEntity.ok("Scores recalculated successfully for " + grandPrix.getName());
        } catch (Exception e) {
            System.err.println("Error recalculating scores: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error recalculating scores: " + e.getMessage());
        }
    }

    @PostMapping("/recalculate-all-scores")
    public ResponseEntity<String> recalculateAllScores() {
        try {
            System.out.println("=== RECALCULATING ALL SCORES STARTED ===");

            List<GrandPrix> completedGrandPrix = grandPrixService.getAllGrandPrix().stream()
                    .filter(gp -> gp.getStatus() == GrandPrix.Status.COMPLETED)
                    .collect(java.util.stream.Collectors.toList());

            System.out.println("Found " + completedGrandPrix.size() + " completed Grand Prix");

            int totalProcessed = 0;

            for (GrandPrix gp : completedGrandPrix) {
                Optional<GrandPrixResult> resultOpt = grandPrixResultRepository.findByGrandPrix(gp);
                if (resultOpt.isPresent()) {
                    System.out.println("Processing: " + gp.getName());
                    scoringService.calculateScores(resultOpt.get());
                    totalProcessed++;
                }
            }

            System.out.println("=== RECALCULATING ALL SCORES COMPLETED ===");
            return ResponseEntity.ok("Recalculated scores for " + totalProcessed + " Grand Prix events");

        } catch (Exception e) {
            System.err.println("Error recalculating all scores: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error recalculating scores: " + e.getMessage());
        }
    }

    @PostMapping("/test-scoring/{grandPrixId}")
    public ResponseEntity<String> testScoring(@PathVariable Long grandPrixId) {
        try {
            System.out.println("=== TEST SCORING STARTED ===");

            GrandPrix grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                    .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

            GrandPrixResult result = grandPrixResultRepository.findByGrandPrix(grandPrix)
                    .orElseThrow(() -> new RuntimeException("Results not found"));

            System.out.println("Testing scoring for: " + grandPrix.getName());
            scoringService.calculateScores(result);

            return ResponseEntity.ok("Scoring test completed for " + grandPrix.getName());

        } catch (Exception e) {
            System.err.println("Test scoring error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Test scoring failed: " + e.getMessage());
        }
    }
}