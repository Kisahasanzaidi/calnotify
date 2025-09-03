package com.kisa.calnotify.dto;

import com.kisa.calnotify.entity.EventEntity;
import lombok.Data;
import org.bson.types.ObjectId;

import java.util.List;

@Data
public class CreateEventDTO {
    private EventEntity event;              
    private List<ObjectId> participants;    
}
