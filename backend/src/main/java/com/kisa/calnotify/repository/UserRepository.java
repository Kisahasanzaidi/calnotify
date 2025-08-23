package com.kisa.calnotify.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.kisa.calnotify.entity.UserEntity;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, ObjectId> {

    UserEntity findByEmail(String email);

    UserEntity findByUserId(ObjectId userId);
}
