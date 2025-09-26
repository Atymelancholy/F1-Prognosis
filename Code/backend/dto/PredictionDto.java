package com.f1prognosis.backend.dto;

import lombok.Data;

@Data
public class PredictionDto {
    private Long grandPrixId;
    private String polePositionDriver;
    private String p1Driver;
    private String p2Driver;
    private String p3Driver;
    private String fastestLapDriver;
}