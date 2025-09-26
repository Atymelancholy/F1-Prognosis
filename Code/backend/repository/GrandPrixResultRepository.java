package com.f1prognosis.backend.repository;

import com.f1prognosis.backend.model.GrandPrixResult;
import com.f1prognosis.backend.model.GrandPrix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GrandPrixResultRepository extends JpaRepository<GrandPrixResult, Long> {
    Optional<GrandPrixResult> findByGrandPrix(GrandPrix grandPrix);
    Boolean existsByGrandPrix(GrandPrix grandPrix);
}