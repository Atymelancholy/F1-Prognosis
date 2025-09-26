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
        user.setTotalScore(0);

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
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
        user.setTotalScore(user.getTotalScore() + scoreToAdd);
        userRepository.save(user);
    }
}