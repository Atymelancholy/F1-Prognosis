package com.f1prognosis.backend.config;

import com.f1prognosis.backend.model.GrandPrix;
import com.f1prognosis.backend.model.User;
import com.f1prognosis.backend.repository.GrandPrixRepository;
import com.f1prognosis.backend.repository.UserRepository;
import com.f1prognosis.backend.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GrandPrixRepository grandPrixRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public DataInitializer(UserRepository userRepository,
                           GrandPrixRepository grandPrixRepository,
                           PasswordEncoder passwordEncoder,
                           UserService userService) {
        this.userRepository = userRepository;
        this.grandPrixRepository = grandPrixRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Создаем тестовых пользователей
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail("admin@f1.com");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setTotalScore(0);
            userRepository.save(admin);

            User testUser = new User();
            testUser.setEmail("user@f1.com");
            testUser.setUsername("testuser");
            testUser.setPassword(passwordEncoder.encode("user123"));
            testUser.setRole(User.Role.USER);
            testUser.setTotalScore(0);
            userRepository.save(testUser);

            // Создаем несколько тестовых пользователей для рейтинга
            String[] testUsers = {"racer1", "racer2", "racer3", "speedster", "f1fan"};
            for (int i = 0; i < testUsers.length; i++) {
                User user = new User();
                user.setEmail(testUsers[i] + "@f1.com");
                user.setUsername(testUsers[i]);
                user.setPassword(passwordEncoder.encode("password123"));
                user.setRole(User.Role.USER);
                user.setTotalScore(100 - i * 10); // Разные очки для теста рейтинга
                userRepository.save(user);
            }
        }

        // Создаем тестовые Гран-При
        if (grandPrixRepository.count() == 0) {
            // Прошедшие гонки
            GrandPrix gp1 = new GrandPrix();
            gp1.setName("Emilia Romagna Grand Prix");
            gp1.setRoundNumber(7);
            gp1.setCircuit("Imola, Italy");
            gp1.setQualifyingTime(LocalDateTime.now().minusDays(30));
            gp1.setRaceTime(LocalDateTime.now().minusDays(29));
            gp1.setStatus(GrandPrix.Status.COMPLETED);
            grandPrixRepository.save(gp1);

            // Текущая гонка (прогнозы открыты)
            GrandPrix gp2 = new GrandPrix();
            gp2.setName("Canadian Grand Prix");
            gp2.setRoundNumber(9);
            gp2.setCircuit("Circuit Gilles Villeneuve, Montreal");
            gp2.setQualifyingTime(LocalDateTime.now().plusDays(2));
            gp2.setRaceTime(LocalDateTime.now().plusDays(3));
            gp2.setStatus(GrandPrix.Status.OPEN);
            grandPrixRepository.save(gp2);

            // Будущие гонки
            GrandPrix gp3 = new GrandPrix();
            gp3.setName("British Grand Prix");
            gp3.setRoundNumber(12);
            gp3.setCircuit("Silverstone, UK");
            gp3.setQualifyingTime(LocalDateTime.now().plusDays(15));
            gp3.setRaceTime(LocalDateTime.now().plusDays(16));
            gp3.setStatus(GrandPrix.Status.AWAITING);
            grandPrixRepository.save(gp3);
        }
    }
}