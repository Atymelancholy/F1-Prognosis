package com.f1prognosis.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "grand_prix")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrandPrix {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;

    @Column(nullable = false)
    private String circuit;

    @Column(name = "qualifying_time", nullable = false)
    private LocalDateTime qualifyingTime;

    @Column(name = "race_time", nullable = false)
    private LocalDateTime raceTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.AWAITING;

    public enum Status {
        AWAITING, OPEN, CLOSED, COMPLETED
    }
}