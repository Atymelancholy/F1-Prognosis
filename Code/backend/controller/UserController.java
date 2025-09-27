// controller/UserController.java
package com.f1prognosis.backend.controller;

import com.f1prognosis.backend.dto.AvatarUpdateDto;
import com.f1prognosis.backend.model.User;
import com.f1prognosis.backend.service.UserService;
import java.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/avatar")
    public ResponseEntity<User> updateAvatar(
            @RequestParam("avatar") MultipartFile file, // Измените на @RequestParam
            Authentication authentication) {
        try {
            System.out.println("=== AVATAR UPDATE REQUEST ===");
            System.out.println("User: " + authentication.getName());
            System.out.println("File: " + file.getOriginalFilename() + ", size: " + file.getSize());

            String email = authentication.getName();

            // Конвертируем MultipartFile в base64
            String base64Avatar = convertToBase64(file);
            User updatedUser = userService.updateUserAvatar(email, base64Avatar);

            System.out.println("✅ Avatar updated successfully");
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            System.err.println("❌ Avatar update error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    private String convertToBase64(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }

    // Удалить аватар текущего пользователя
    @DeleteMapping("/avatar")
    public ResponseEntity<User> removeAvatar(Authentication authentication) {
        try {
            String email = authentication.getName();
            User updatedUser = userService.removeUserAvatar(email);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Получить данные текущего пользователя (дублируем из AuthController для удобства)
    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUserProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // controller/UserController.java - добавим тестовый endpoint
    @PostMapping("/avatar-test")
    public ResponseEntity<String> testAvatarEndpoint(@RequestBody Map<String, Object> requestData) {
        try {
            System.out.println("=== TEST AVATAR ENDPOINT ===");
            System.out.println("Request data: " + requestData);
            System.out.println("Avatar key exists: " + requestData.containsKey("avatar"));

            if (requestData.containsKey("avatar")) {
                String avatar = (String) requestData.get("avatar");
                System.out.println("Avatar data length: " + (avatar != null ? avatar.length() : 0));
            }

            return ResponseEntity.ok("Test endpoint works!");
        } catch (Exception e) {
            System.err.println("Test error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Test failed: " + e.getMessage());
        }
    }
    // Добавьте этот метод в UserController.java
    @PostMapping("/avatar-test-formdata")
    public ResponseEntity<String> testAvatarFormData(@RequestParam("avatar") MultipartFile file) {
        try {
            System.out.println("=== TEST FORMDATA ENDPOINT ===");
            System.out.println("File: " + file.getOriginalFilename());
            System.out.println("Size: " + file.getSize());
            System.out.println("Type: " + file.getContentType());

            return ResponseEntity.ok("FormData received: " + file.getOriginalFilename());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}