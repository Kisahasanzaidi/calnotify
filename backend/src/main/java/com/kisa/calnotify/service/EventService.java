package com.kisa.calnotify.service;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventParticipantRepository eventParticipantRepository;

    @Autowired
    private UserRepository userRepository;

    public EventEntity createEvent(EventEntity event, List<ObjectId> participants) {
        if (event.getStatus() == null) {
            event.setStatus(EventStatus.ACTIVE);
        }

         if (event.isAllDay() && event.getStart() != null) {
        LocalDate startDate = event.getStart().atZone(ZoneOffset.UTC).toLocalDate();
        event.setStart(startDate.atStartOfDay().toInstant(ZoneOffset.UTC));
        event.setEnd(startDate.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC));
       } else if (event.getStart() != null && event.getEnd() != null &&
            event.getStart().isAfter(event.getEnd())) {
        throw new IllegalArgumentException("Event start must be before end");
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

        UserEntity organizer = userRepository.findById(event.getCreatedBy()).orElse(null);
        if (organizer != null) {
            try {
                emailService.sendOrganizerMail(
                    organizer.getEmail(),
                    organizer.getName(),
                    savedEvent.getTitle(),
                    savedEvent.getDescription(),
                    savedEvent.getStart().toString(),
                    savedEvent.getEnd().toString()
                );
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (participants != null && !participants.isEmpty()) {
            for (ObjectId userId : participants) {
                EventParticipantEntity participant = new EventParticipantEntity();
                participant.setEventId(savedEvent.getId());
                participant.setUserId(userId);
                participant.setRole(ParticipantRole.PARTCIPANT);
                participant.setStatus(ParticipantStatus.INVITED);
                eventParticipantRepository.save(participant);

                UserEntity user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    try {
                        emailService.participantsMail(
                            user.getEmail(),
                            user.getName(),
                            savedEvent.getTitle(),
                            savedEvent.getDescription(),
                            savedEvent.getStart().toString(),
                            savedEvent.getEnd().toString()
                        );
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
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

                    UserEntity organizer = userRepository.findById(e.getCreatedBy()).orElse(null);
                    String organizerName = organizer != null ? organizer.getName() : "Unknown";

                    return new CalenderDTO(
                            e.getId().toString(),  
                            e.getTitle(),
                            e.getDescription(),
                            e.getStart(),
                            e.getEnd(),
                            e.getStatus(),
                            participantDTOs,
                            organizerName,
                              e.isAllDay()
                    );
                }).collect(Collectors.toList());
    }

    public EventEntity updateEvent(ObjectId id, EventEntity updatedEvent) {
        EventEntity existing = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (updatedEvent.getTitle() != null) existing.setTitle(updatedEvent.getTitle());
        if (updatedEvent.getDescription() != null) existing.setDescription(updatedEvent.getDescription());
        if (updatedEvent.getStart() != null) existing.setStart(updatedEvent.getStart());
        if (updatedEvent.getEnd() != null) existing.setEnd(updatedEvent.getEnd());
        existing.setAllDay(updatedEvent.isAllDay());
        if (updatedEvent.getStatus() != null) existing.setStatus(updatedEvent.getStatus());

        return eventRepository.save(existing);
    }

    @Transactional
    public void deleteEvent(ObjectId id) {
        eventParticipantRepository.deleteByEventId(id);
        eventRepository.deleteById(id);
    }
}
