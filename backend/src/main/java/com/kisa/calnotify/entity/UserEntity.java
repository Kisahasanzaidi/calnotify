package com.kisa.calnotify.entity;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.NonNull;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@NoArgsConstructor
@Document(collection = "users")
public class UserEntity {

    @Id  
    private ObjectId userId;
     @NonNull
    private String email;
    @NonNull
    private String password;
    private String role;
}
