package com.kisa.calnotify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.kisa.calnotify.entity.UserEntity;
import com.kisa.calnotify.service.UserDetailsServiceImpl;
import com.kisa.calnotify.service.UserService;
import com.kisa.calnotify.utils.JwtUtil;
import java.util.*;

import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/public")
@Slf4j
public class PublicController {

    @Autowired PasswordEncoder  passwordEncoder;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/health-check")
    public String healthCheck() {
        return "Ok";
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserEntity user) {
        try {
            UserEntity savedUser = userService.registerUser(user);
            return new ResponseEntity<>("User registered successfully with email: " + savedUser.getEmail(), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            log.error("Error during signup", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


   @PostMapping("/login")
public ResponseEntity<Map<String, String>> login(@RequestBody UserEntity user) {
    try {
        UserEntity foundUser = userService.getUserByEmail(user.getEmail());
        if (foundUser == null || !passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Incorrect username or password"));
        }
        System.out.println(foundUser+ " " +"kisssaaa");

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        String jwt = jwtUtil.generateToken(userDetails.getUsername(), foundUser.getUserId().toString(),foundUser.getRole());

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("userId", foundUser.getUserId().toString());

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        log.error("Exception occurred while creating authentication token", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Server error"));
    }
}

}