package com.kisa.calnotify.dto;

import java.time.Instant;

import org.bson.types.ObjectId;

import com.kisa.calnotify.entity.EventStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalenderDTO {
    private ObjectId eventId;
    private String title;
    private String description;
    private Instant start;
    private Instant end;
    private EventStatus status;
    private List<ParticipantsDTO> participants;


    
}
