package com.example.usermanagement.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[A-Z]).{8,}$",
        message = "Password must be at least 8 characters long and contain at least one digit and one uppercase letter"
    )
    private String password;
}
