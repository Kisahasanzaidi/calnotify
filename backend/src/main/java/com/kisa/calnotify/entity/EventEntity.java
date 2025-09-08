package com.kisa.calnotify.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.kisa.calnotify.entity.EventStatus;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "events")
public class EventEntity {

    @Id
    private ObjectId id;

    private String title;
    private String description;

    private Instant start;
    private Instant end;

    private ObjectId createdBy; 


    private EventStatus status;

    private boolean allDay; 
}
