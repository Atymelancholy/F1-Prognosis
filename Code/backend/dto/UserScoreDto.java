package com.f1prognosis.backend.dto;

import lombok.Data;

@Data
public class UserScoreDto {
    private String username;
    private Integer totalScore;

    public UserScoreDto(String username, Integer totalScore) {
        this.username = username;
        this.totalScore = totalScore;
    }
}