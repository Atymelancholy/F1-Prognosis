// controller/ResultsController.java
package com.f1prognosis.backend.controller;

import com.f1prognosis.backend.dto.ResultsDto;
import com.f1prognosis.backend.model.GrandPrixResult;
import com.f1prognosis.backend.service.GrandPrixService;
import com.f1prognosis.backend.repository.GrandPrixResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:3000")
public class ResultsController {

    private final GrandPrixService grandPrixService;
    private final GrandPrixResultRepository grandPrixResultRepository;

    public ResultsController(GrandPrixService grandPrixService,
                             GrandPrixResultRepository grandPrixResultRepository) {
        this.grandPrixService = grandPrixService;
        this.grandPrixResultRepository = grandPrixResultRepository;
    }

    @GetMapping("/{grandPrixId}")
    public ResponseEntity<GrandPrixResult> getGrandPrixResults(@PathVariable Long grandPrixId) {
        try {
            // Проверяем существование гран-при
            var grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                    .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

            // Ищем результаты
            Optional<GrandPrixResult> result = grandPrixResultRepository.findByGrandPrix(grandPrix);

            if (result.isPresent()) {
                return ResponseEntity.ok(result.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{grandPrixId}/exists")
    public ResponseEntity<Boolean> checkResultsExist(@PathVariable Long grandPrixId) {
        try {
            var grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                    .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

            boolean exists = grandPrixResultRepository.existsByGrandPrix(grandPrix);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    // Добавьте этот метод в ResultsController.java
    @GetMapping("/{grandPrixId}/dto")
    public ResponseEntity<ResultsDto> getGrandPrixResultsDto(@PathVariable Long grandPrixId) {
        try {
            var grandPrix = grandPrixService.getGrandPrixById(grandPrixId)
                    .orElseThrow(() -> new RuntimeException("Grand Prix not found"));

            Optional<GrandPrixResult> result = grandPrixResultRepository.findByGrandPrix(grandPrix);

            if (result.isPresent()) {
                ResultsDto dto = new ResultsDto(result.get());
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}