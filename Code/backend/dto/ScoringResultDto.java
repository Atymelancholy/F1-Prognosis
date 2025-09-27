// ScoringResultDto.java
package com.f1prognosis.backend.dto;

import lombok.Data;

@Data
public class ScoringResultDto {
    private String message;
    private int processedPredictions;
    private int totalScoresGiven;

    public ScoringResultDto(String message, int processedPredictions, int totalScoresGiven) {
        this.message = message;
        this.processedPredictions = processedPredictions;
        this.totalScoresGiven = totalScoresGiven;
    }
}