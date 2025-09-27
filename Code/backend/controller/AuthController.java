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

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody LoginRequest request) {
        // Генерируем username из email (все до символа @)
        String username = request.getEmail().split("@")[0];

        // Проверяем, не существует ли уже пользователь с таким username
        // Если существует, добавляем цифру
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

        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(userDetails);

        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new AuthResponse(token, user));
    }


}