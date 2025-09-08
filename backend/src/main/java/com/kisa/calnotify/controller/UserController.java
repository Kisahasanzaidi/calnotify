package com.kisa.calnotify.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kisa.calnotify.entity.UserEntity;
import com.kisa.calnotify.service.UserService;

import java.util.*;
@RestController
public class UserController {

    @Autowired UserService userService;

    @GetMapping("/user/all")
    public List<UserEntity> getAllUsers() {
        return userService.getAllUsers();
    }

    
}
