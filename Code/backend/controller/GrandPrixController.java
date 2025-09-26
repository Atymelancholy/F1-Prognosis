package com.f1prognosis.backend.controller;

import com.f1prognosis.backend.dto.GrandPrixDto;
import com.f1prognosis.backend.model.GrandPrix;
import com.f1prognosis.backend.service.GrandPrixService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grandprix")
@CrossOrigin(origins = "http://localhost:3000")
public class GrandPrixController {

    private final GrandPrixService grandPrixService;

    public GrandPrixController(GrandPrixService grandPrixService) {
        this.grandPrixService = grandPrixService;
    }

    @GetMapping
    public ResponseEntity<List<GrandPrixDto>> getAllGrandPrix() {
        List<GrandPrixDto> grandPrixList = grandPrixService.getAllGrandPrix().stream()
                .map(GrandPrixDto::new)
                .toList();
        return ResponseEntity.ok(grandPrixList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrandPrixDto> getGrandPrixById(@PathVariable Long id) {
        GrandPrix grandPrix = grandPrixService.getGrandPrixById(id)
                .orElseThrow(() -> new RuntimeException("Grand Prix not found"));
        return ResponseEntity.ok(new GrandPrixDto(grandPrix));
    }
}