package com.kisa.calnotify.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import com.kisa.calnotify.entity.ParticipantStatus;


@Data
@NoArgsConstructor
@Document(collection = "event_participants")
public class EventParticipantEntity {

    @Id
    private ObjectId id;

    private ObjectId eventId; 
    private ObjectId userId;  
     private ObjectId createdBy; 

    private ParticipantStatus status;
    private ParticipantRole role;

    private Instant joinedAt;
}
