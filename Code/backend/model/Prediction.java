package com.f1prognosis.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "grand_prix_id", nullable = false)
    private GrandPrix grandPrix;

    @Column(name = "pole_position_driver", nullable = false)
    private String polePositionDriver;

    @Column(name = "p1_driver", nullable = false)
    private String p1Driver;

    @Column(name = "p2_driver", nullable = false)
    private String p2Driver;

    @Column(name = "p3_driver", nullable = false)
    private String p3Driver;

    @Column(name = "fastest_lap_driver", nullable = false)
    private String fastestLapDriver;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    private Integer score;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}