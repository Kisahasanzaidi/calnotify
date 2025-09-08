package com.kisa.calnotify.controller;

import java.time.Instant;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.kisa.calnotify.dto.CalenderDTO;
import com.kisa.calnotify.dto.CreateEventDTO;
import com.kisa.calnotify.entity.EventEntity;
import com.kisa.calnotify.service.EventService;
import com.kisa.calnotify.utils.JwtUtil;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping("/create")
     public ResponseEntity<EventEntity> createEvent(@RequestBody CreateEventDTO request) {
        EventEntity savedEvent = eventService.createEvent(
                request.getEvent(),
                request.getParticipants()
        );
        return ResponseEntity.ok(savedEvent);
    }
      @PutMapping("/{id}")
       public ResponseEntity<EventEntity> updateEvent(
        @PathVariable String id,
        @RequestBody EventEntity updatedEvent) {
        if (!ObjectId.isValid(id)) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid ObjectId");
      }
       EventEntity event = eventService.updateEvent(new ObjectId(id), updatedEvent);
       return ResponseEntity.ok(event);
       }

      @DeleteMapping("/{id}")
       public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        if (!ObjectId.isValid(id)) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid ObjectId");
        }
       eventService.deleteEvent(new ObjectId(id));
       return ResponseEntity.noContent().build();
        }

   @GetMapping("/user/{userId}/calendar-range")
    public ResponseEntity<List<CalenderDTO>> getUserCalendarByRange(
    @PathVariable String userId,
    @RequestParam String start, 
    @RequestParam String end,   
    @RequestHeader("Authorization") String authHeader) {
    List<CalenderDTO> events = eventService.getUserCalendarByRange(
        new ObjectId(userId),
        Instant.parse(start),
        Instant.parse(end)
    );
    return ResponseEntity.ok(events);
}
  

}

