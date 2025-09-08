package com.kisa.calnotify.dto;

import java.time.Instant;

import org.bson.types.ObjectId;

import com.kisa.calnotify.entity.EventStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CalenderDTO {
    private String  eventId;
    private String title;
    private String description;
    private Instant start;
    private Instant end;
    private EventStatus status;
    private List<ParticipantsDTO> participants;
     private String organizerName;
      private boolean allDay;


    
}
