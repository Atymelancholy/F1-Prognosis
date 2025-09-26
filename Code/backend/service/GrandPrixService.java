package com.f1prognosis.backend.service;

import com.f1prognosis.backend.model.GrandPrix;
import com.f1prognosis.backend.repository.GrandPrixRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GrandPrixService {

    private final GrandPrixRepository grandPrixRepository;

    public GrandPrixService(GrandPrixRepository grandPrixRepository) {
        this.grandPrixRepository = grandPrixRepository;
    }

    public List<GrandPrix> getAllGrandPrix() {
        return grandPrixRepository.findAllByOrderByRoundNumberAsc();
    }

    public Optional<GrandPrix> getGrandPrixById(Long id) {
        return grandPrixRepository.findById(id);
    }

    public GrandPrix createGrandPrix(GrandPrix grandPrix) {
        return grandPrixRepository.save(grandPrix);
    }

    public GrandPrix updateGrandPrixStatus(Long id, GrandPrix.Status status) {
        GrandPrix grandPrix = grandPrixRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grand Prix not found"));
        grandPrix.setStatus(status);
        return grandPrixRepository.save(grandPrix);
    }

    public boolean isPredictionsOpen(GrandPrix grandPrix) {
        return grandPrix.getStatus() == GrandPrix.Status.OPEN &&
                LocalDateTime.now().isBefore(grandPrix.getQualifyingTime());
    }
}