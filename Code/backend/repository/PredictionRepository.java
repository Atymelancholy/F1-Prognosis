package com.f1prognosis.backend.repository;

import com.f1prognosis.backend.model.Prediction;
import com.f1prognosis.backend.model.User;
import com.f1prognosis.backend.model.GrandPrix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    Optional<Prediction> findByUserAndGrandPrix(User user, GrandPrix grandPrix);
    List<Prediction> findByGrandPrix(GrandPrix grandPrix);
    List<Prediction> findByUser(User user);
}