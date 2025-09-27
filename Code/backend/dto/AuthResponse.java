// dto/AuthResponse.java - убедимся что включает аватар
package com.f1prognosis.backend.dto;

import com.f1prognosis.backend.model.User;
import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String email;
    private String username;
    private User.Role role;
    private String avatar; // Добавляем аватар

    public AuthResponse(String token, User user) {
        this.token = token;
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.role = user.getRole();
        this.avatar = user.getAvatar(); // Включаем аватар
    }
}