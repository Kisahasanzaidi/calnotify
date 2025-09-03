package com.kisa.calnotify.service;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kisa.calnotify.dto.CalenderDTO;
import com.kisa.calnotify.dto.ParticipantsDTO;
import com.kisa.calnotify.entity.EventEntity;
import com.kisa.calnotify.entity.EventParticipantEntity;
import com.kisa.calnotify.entity.EventStatus;
import com.kisa.calnotify.entity.ParticipantRole;
import com.kisa.calnotify.entity.ParticipantStatus;
import com.kisa.calnotify.entity.UserEntity;
import com.kisa.calnotify.repository.EventParticipantRepository;
import com.kisa.calnotify.repository.EventRepository;
import com.kisa.calnotify.repository.UserRepository;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventService {


    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventParticipantRepository eventParticipantRepository;

    @Autowired UserRepository userRepository;


   public EventEntity createEvent(EventEntity event, List<ObjectId> participants) {
    if (event.getStatus() == null) {
        event.setStatus(EventStatus.ACTIVE);
    }

    if (event.getStart() != null && event.getEnd() != null && event.getStart().isAfter(event.getEnd())) {
        throw new IllegalArgumentException("Event start must be before end");
    }

    EventEntity savedEvent = eventRepository.save(event);

    EventParticipantEntity creatorParticipant = new EventParticipantEntity();
    creatorParticipant.setEventId(savedEvent.getId());
    creatorParticipant.setUserId(event.getCreatedBy());
    creatorParticipant.setRole(ParticipantRole.ORGANISER);
    eventParticipantRepository.save(creatorParticipant);

    if (participants != null && !participants.isEmpty()) {
        for (ObjectId userId : participants) {
            EventParticipantEntity participant = new EventParticipantEntity();
            participant.setEventId(savedEvent.getId());
            participant.setUserId(userId);
            participant.setRole(ParticipantRole.PARTCIPANT);
            participant.setStatus(ParticipantStatus.INVITED);
            eventParticipantRepository.save(participant);
        }
    }

    return savedEvent;
}


public List<CalenderDTO> getUserCalendarByRange(ObjectId userId, Instant start, Instant end) {
    List<EventParticipantEntity> myParticipation = eventParticipantRepository.findByUserId(userId);
    Set<ObjectId> eventIds = myParticipation.stream()
        .map(EventParticipantEntity::getEventId)
        .collect(Collectors.toSet());

    List<EventEntity> createdEvents = eventRepository.findByCreatedBy(userId);
    for (EventEntity event : createdEvents) eventIds.add(event.getId());

    List<EventEntity> events = eventRepository.findAllById(eventIds);

    return events.stream()
        .filter(e -> e.getStart() != null && e.getEnd() != null)
        .filter(e -> !e.getEnd().isBefore(start) && !e.getStart().isAfter(end))
        .map(e -> {
            List<EventParticipantEntity> participants = eventParticipantRepository.findByEventId(e.getId());
            List<ParticipantsDTO> participantDTOs = participants.stream()
                .map(p -> {
                    UserEntity user = userRepository.findById(p.getUserId()).orElse(null);
                    return new ParticipantsDTO(
                        p.getUserId(),
                        user != null ? user.getName() : "Unknown",
                        p.getStatus(),
                        p.getRole()
                    );
                }).collect(Collectors.toList());

            return new CalenderDTO(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getStart(),
                e.getEnd(),
                e.getStatus(),
                participantDTOs
            );
        }).collect(Collectors.toList());
}


}