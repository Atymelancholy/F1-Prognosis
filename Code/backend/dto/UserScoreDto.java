package com.f1prognosis.backend.dto;

import lombok.Data;

@Data
public class UserScoreDto {
    private String username;
    private Integer totalScore;
    private String avatar; // ДОБАВЛЯЕМ ЭТО ПОЛЕ


    public UserScoreDto(String username, Integer totalScore, String avatar) {
        this.username = username;
        this.totalScore = totalScore;
        this.avatar = avatar;
    }
}