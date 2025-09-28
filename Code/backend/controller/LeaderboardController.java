package com.f1prognosis.backend.controller;

import com.f1prognosis.backend.dto.UserScoreDto;
import com.f1prognosis.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaderboardController {

    private final UserService userService;

    public LeaderboardController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserScoreDto>> getLeaderboard() {
        List<UserScoreDto> leaderboard = userService.getTopUsers(20).stream()
                .map(user -> new UserScoreDto(
                        user.getUsername(),
                        user.getTotalScore(),
                        user.getAvatar() // ДОБАВЛЯЕМ АВАТАР
                ))
                .toList();

        // Для отладки
        System.out.println("=== LEADERBOARD WITH AVATARS ===");
        leaderboard.forEach(dto -> {
            System.out.println("User: " + dto.getUsername() +
                    ", Avatar: " + (dto.getAvatar() != null ? "EXISTS" : "NULL"));
        });

        return ResponseEntity.ok(leaderboard);
    }
}