package com.f1prognosis.backend.service;

import com.f1prognosis.backend.model.User;
import com.f1prognosis.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String email, String username, String password, User.Role role) {
        if (existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        if (existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        // Инициализируем все поля значениями по умолчанию
        user.setTotalScore(0);
        user.setPredictionsMade(0);
        user.setPredictionsWon(0);
        user.setCorrectPodiums(0);
        user.setCorrectPolePositions(0);
        user.setCorrectFastestLaps(0);

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public List<User> getTopUsers(int limit) {
        return userRepository.findAll().stream()
                .sorted((u1, u2) -> u2.getTotalScore().compareTo(u1.getTotalScore()))
                .limit(limit)
                .toList();
    }

    public void updateUserScore(Long userId, Integer scoreToAdd) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Защита от null
        Integer currentScore = user.getTotalScore();
        if (currentScore == null) {
            currentScore = 0;
        }

        user.setTotalScore(currentScore + scoreToAdd);
        userRepository.save(user);
    }

    // Исправленные методы с защитой от null
    public void incrementPredictionsMade(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer current = user.getPredictionsMade();
        if (current == null) {
            current = 0;
        }
        user.setPredictionsMade(current + 1);
        userRepository.save(user);
    }

    public void incrementPredictionsWon(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer current = user.getPredictionsWon();
        if (current == null) {
            current = 0;
        }
        user.setPredictionsWon(current + 1);
        userRepository.save(user);
    }

    public void incrementCorrectPodiums(Long userId, int count) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer current = user.getCorrectPodiums();
        if (current == null) {
            current = 0;
        }
        user.setCorrectPodiums(current + count);
        userRepository.save(user);
    }

    public void incrementCorrectPolePositions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer current = user.getCorrectPolePositions();
        if (current == null) {
            current = 0;
        }
        user.setCorrectPolePositions(current + 1);
        userRepository.save(user);
    }

    public void incrementCorrectFastestLaps(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer current = user.getCorrectFastestLaps();
        if (current == null) {
            current = 0;
        }
        user.setCorrectFastestLaps(current + 1);
        userRepository.save(user);
    }

    public User getUserStats(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsersWithStats() {
        return userRepository.findAll();
    }

    // service/UserService.java - добавим новые методы
    // service/UserService.java - упростим на время тестирования
// service/UserService.java
    public User updateUserAvatar(String email, String avatarData) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("=== UPDATING USER AVATAR ===");
        System.out.println("User: " + user.getUsername());
        System.out.println("Avatar data length: " + (avatarData != null ? avatarData.length() : 0));
        System.out.println("Avatar data preview: " + (avatarData != null ? avatarData.substring(0, Math.min(100, avatarData.length())) : "null"));

        user.setAvatar(avatarData);
        User savedUser = userRepository.save(user);

        System.out.println("✅ Avatar saved to database");
        System.out.println("Saved user avatar length: " + (savedUser.getAvatar() != null ? savedUser.getAvatar().length() : 0));

        return savedUser;
    }

    public User removeUserAvatar(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAvatar(null);
        return userRepository.save(user);
    }
}