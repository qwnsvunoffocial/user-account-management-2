package com.example.usermanagement.service;

import com.example.usermanagement.dto.*;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserService {
    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id, Authentication auth);
    UserResponse updateUser(Long id, UpdateUserRequest request, Authentication auth);
    void deleteUser(Long id);
}
