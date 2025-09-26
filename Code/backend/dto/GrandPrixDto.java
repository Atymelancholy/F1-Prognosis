package com.f1prognosis.backend.dto;

import com.f1prognosis.backend.model.GrandPrix;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class GrandPrixDto {
    private Long id;
    private String name;
    private Integer roundNumber;
    private String circuit;
    private LocalDateTime qualifyingTime;
    private LocalDateTime raceTime;
    private GrandPrix.Status status;

    public GrandPrixDto(GrandPrix grandPrix) {
        this.id = grandPrix.getId();
        this.name = grandPrix.getName();
        this.roundNumber = grandPrix.getRoundNumber();
        this.circuit = grandPrix.getCircuit();
        this.qualifyingTime = grandPrix.getQualifyingTime();
        this.raceTime = grandPrix.getRaceTime();
        this.status = grandPrix.getStatus();
    }
}