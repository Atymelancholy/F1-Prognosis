package com.f1prognosis.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "total_score")
    private Integer totalScore = 0;

    // Добавляем поля для статистики
    @Column(name = "predictions_made")
    private Integer predictionsMade = 0;

    @Column(name = "predictions_won")
    private Integer predictionsWon = 0;

    @Column(name = "correct_podiums")
    private Integer correctPodiums = 0;

    @Column(name = "correct_pole_positions")
    private Integer correctPolePositions = 0;

    @Column(name = "correct_fastest_laps")
    private Integer correctFastestLaps = 0;

    public enum Role {
        USER, ADMIN
    }
}