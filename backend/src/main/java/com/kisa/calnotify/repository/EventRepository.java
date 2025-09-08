package com.kisa.calnotify.repository;

import com.kisa.calnotify.entity.EventEntity;
import com.kisa.calnotify.entity.EventStatus;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface EventRepository extends MongoRepository<EventEntity, ObjectId> {

    List<EventEntity> findByCreatedBy(ObjectId userId);

    List<EventEntity> findByStatus(EventStatus status);

    List<EventEntity> findByCreatedByAndStartBetween(ObjectId userId, Instant start, Instant end);

    List<EventEntity> findByCreatedByAndStartAfter(ObjectId userId, Instant now);

    List<EventEntity> findByStatusIn(List<EventStatus> statuses);
}
