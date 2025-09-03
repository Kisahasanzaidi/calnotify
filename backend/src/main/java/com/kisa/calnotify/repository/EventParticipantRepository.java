package com.kisa.calnotify.repository;

import com.kisa.calnotify.entity.EventParticipantEntity;
import com.kisa.calnotify.entity.ParticipantStatus;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EventParticipantRepository extends MongoRepository<EventParticipantEntity, ObjectId> {

    List<EventParticipantEntity> findByEventId(ObjectId eventId);

    List<EventParticipantEntity> findByUserId(ObjectId userId);

    List<EventParticipantEntity> findByEventIdAndStatus(ObjectId eventId, ParticipantStatus status);

    Optional<EventParticipantEntity> findByEventIdAndUserId(ObjectId eventId, ObjectId userId);
}
