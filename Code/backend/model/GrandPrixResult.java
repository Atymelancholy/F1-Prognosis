package com.f1prognosis.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "grand_prix_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrandPrixResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "grand_prix_id", nullable = false, unique = true)
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
}