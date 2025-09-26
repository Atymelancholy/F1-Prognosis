package com.f1prognosis.backend.controller;

import com.f1prognosis.backend.dto.PredictionDto;
import com.f1prognosis.backend.model.Prediction;
import com.f1prognosis.backend.model.User;
import com.f1prognosis.backend.model.GrandPrix;
import com.f1prognosis.backend.service.PredictionService;
import com.f1prognosis.backend.service.UserService;
import com.f1prognosis.backend.service.GrandPrixService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "http://localhost:3000")
public class PredictionController {

    private final PredictionService predictionService;
    private final UserService userService;
    private final GrandPrixService grandPrixService;

    public PredictionController(PredictionService predictionService,
                                UserService userService,
                                GrandPrixService grandPrixService) {
        this.predictionService = predictionService;
        this.userService = userService;
        this.grandPrixService = grandPrixService;
    }

    @GetMapping
    public ResponseEntity<PredictionDto> getUserPrediction(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long grandPrixId) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        GrandPrix grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

        Prediction prediction = predictionService.getUserPrediction(user, grandPrix)
                .orElse(null);

        if (prediction == null) {
            return ResponseEntity.notFound().build();
        }

        PredictionDto dto = new PredictionDto();
        dto.setGrandPrixId(prediction.getGrandPrix().getId());
        dto.setPolePositionDriver(prediction.getPolePositionDriver());
        dto.setP1Driver(prediction.getP1Driver());
        dto.setP2Driver(prediction.getP2Driver());
        dto.setP3Driver(prediction.getP3Driver());
        dto.setFastestLapDriver(prediction.getFastestLapDriver());

        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<PredictionDto> savePrediction(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody PredictionDto predictionDto) {

        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        GrandPrix grandPrix = grandPrixService.getGrandPrixById(predictionDto.getGrandPrixId())
                .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

        Prediction prediction = predictionService.saveOrUpdatePrediction(
                user, grandPrix,
                predictionDto.getPolePositionDriver(),
                predictionDto.getP1Driver(),
                predictionDto.getP2Driver(),
                predictionDto.getP3Driver(),
                predictionDto.getFastestLapDriver()
        );

        PredictionDto responseDto = new PredictionDto();
        responseDto.setGrandPrixId(prediction.getGrandPrix().getId());
        responseDto.setPolePositionDriver(prediction.getPolePositionDriver());
        responseDto.setP1Driver(prediction.getP1Driver());
        responseDto.setP2Driver(prediction.getP2Driver());
        responseDto.setP3Driver(prediction.getP3Driver());
        responseDto.setFastestLapDriver(prediction.getFastestLapDriver());

        return ResponseEntity.ok(responseDto);
    }
}