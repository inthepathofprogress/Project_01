package com.suvida.userservice.seeder;

import com.suvida.userservice.model.User;
import com.suvida.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Seeds default accounts for local UI testing so an administrator exists out of the box.
 * Runs on every startup but only creates accounts that are missing (idempotent).
 *
 *   Admin -> admin@suvida.com / admin123
 *   Demo  -> user@suvida.com  / user123
 */
@Component
@RequiredArgsConstructor
public class UserDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("admin@suvida.com", "admin123", "Admin", "User", User.Role.ADMIN);
        seedUser("user@suvida.com", "user123", "John", "Doe", User.Role.USER);
    }

    private void seedUser(String email, String rawPassword, String firstName, String lastName, User.Role role) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }
}

