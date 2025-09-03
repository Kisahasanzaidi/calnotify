package com.kisa.calnotify.dto;

import org.bson.types.ObjectId;

import com.kisa.calnotify.entity.ParticipantRole;
import com.kisa.calnotify.entity.ParticipantStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantsDTO {
    private ObjectId userId;
    private String name;
    private ParticipantStatus status;
    private ParticipantRole role;
    
}
