package com.f1prognosis.backend.repository;

import com.f1prognosis.backend.model.GrandPrix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GrandPrixRepository extends JpaRepository<GrandPrix, Long> {
    List<GrandPrix> findAllByOrderByRoundNumberAsc();
    Optional<GrandPrix> findByName(String name);
}