package com.example.usermanagement.controller;

import com.example.usermanagement.dto.UpdateUserRequest;
import com.example.usermanagement.dto.UserDto;
import com.example.usermanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** Returns all users – ADMIN only (enforced in SecurityConfig). */
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /** Returns a single user – ADMIN can view any, USER can view only their own. */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails currentUser) {
        checkAccess(id, currentUser);
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /** Updates a user – ADMIN can update any, USER can update only their own. */
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id,
                                              @Valid @RequestBody UpdateUserRequest request,
                                              @AuthenticationPrincipal UserDetails currentUser) {
        checkAccess(id, currentUser);
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    /** Deletes a user – ADMIN only (enforced in SecurityConfig). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Throws AccessDeniedException if the current user is not ADMIN
     * and is trying to access another user's data.
     */
    private void checkAccess(Long targetId, UserDetails currentUser) {
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin) {
            UserDto targetUser = userService.getUserById(targetId);
            if (!targetUser.getUsername().equals(currentUser.getUsername())) {
                throw new AccessDeniedException("Access denied");
            }
        }
    }
}
