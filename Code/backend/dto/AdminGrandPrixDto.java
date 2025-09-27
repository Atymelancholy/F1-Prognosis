// AdminGrandPrixDto.java
package com.f1prognosis.backend.dto;

import com.f1prognosis.backend.model.GrandPrix;
import lombok.Data;

@Data
public class AdminGrandPrixDto {
    private Long id;
    private String name;
    private Integer roundNumber;
    private String circuit;
    private String status;
    private boolean hasResults;

    public AdminGrandPrixDto(GrandPrix grandPrix, boolean hasResults) {
        this.id = grandPrix.getId();
        this.name = grandPrix.getName();
        this.roundNumber = grandPrix.getRoundNumber();
        this.circuit = grandPrix.getCircuit();
        this.status = grandPrix.getStatus().name();
        this.hasResults = hasResults;
    }
}