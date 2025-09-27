// AdminInitializationService.java
package com.f1prognosis.backend.service;

import com.f1prognosis.backend.model.User;
import com.f1prognosis.backend.repository.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminInitializationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Фиксированные учетные данные администратора
    private static final String ADMIN_EMAIL = "admin@f1prognosis.com";
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "2101068080";

    public AdminInitializationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializeAdminUser() {
        // Проверяем, существует ли уже администратор
        if (!userRepository.existsByEmail(ADMIN_EMAIL)) {
            User adminUser = new User();
            adminUser.setEmail(ADMIN_EMAIL);
            adminUser.setUsername(ADMIN_USERNAME);
            adminUser.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            adminUser.setRole(User.Role.ADMIN);
            adminUser.setTotalScore(0);
            adminUser.setPredictionsMade(0);
            adminUser.setPredictionsWon(0);
            adminUser.setCorrectPodiums(0);
            adminUser.setCorrectPolePositions(0);
            adminUser.setCorrectFastestLaps(0);

            userRepository.save(adminUser);
            System.out.println("Admin user created successfully");
        } else {
            System.out.println("Admin user already exists");
        }
    }
}