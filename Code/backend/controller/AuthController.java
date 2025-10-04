// AuthController.java - ЗАМЕНИТЕ СУЩЕСТВУЮЩИЙ МЕТОД register
package com.f1prognosis.backend.controller;

import com.f1prognosis.backend.dto.AuthResponse;
import com.f1prognosis.backend.dto.LoginRequest;
import com.f1prognosis.backend.model.User;
import com.f1prognosis.backend.service.UserService;
import com.f1prognosis.backend.service.JwtService;
import com.f1prognosis.backend.service.CustomUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          CustomUserDetailsService userDetailsService,
                          JwtService jwtService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    // 🔥 ИСПРАВЛЕННЫЙ МЕТОД РЕГИСТРАЦИИ - ДОБАВЬТЕ АННОТАЦИЮ @PostMapping
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("=== REGISTER REQUEST ===");
            System.out.println("Email: " + request.getEmail());

            // Генерируем username из email
            String username = request.getEmail().split("@")[0];

            // Проверяем, не существует ли уже пользователь с таким username
            String finalUsername = username;
            int counter = 1;
            while (userService.existsByUsername(finalUsername)) {
                finalUsername = username + counter;
                counter++;
            }

            User user = userService.registerUser(
                    request.getEmail(),
                    finalUsername,
                    request.getPassword(),
                    User.Role.USER
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtService.generateToken(userDetails);

            System.out.println("✅ User registered successfully: " + user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, user));

        } catch (Exception e) {
            System.err.println("❌ Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Метод входа
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("=== LOGIN REQUEST ===");
            System.out.println("Email: " + request.getEmail());

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtService.generateToken(userDetails);

            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            System.out.println("✅ User logged in successfully: " + user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, user));

        } catch (Exception e) {
            System.err.println("❌ Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }
    }
}