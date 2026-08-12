package com.alumniconnect.mentorship.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.mentorship.entity.MentorshipRequest;
import com.alumniconnect.mentorship.service.MentorshipService;

@RestController
@RequestMapping("/mentorship")
public class MentorshipController {

    @Autowired
    private MentorshipService mentorshipService;

    @PostMapping("/add")
    public MentorshipRequest addMentorship(@RequestBody MentorshipRequest mentorship) {
        return mentorshipService.addMentorship(mentorship);
    }

    @PutMapping("/update")
    public MentorshipRequest updateMentorship(@RequestBody MentorshipRequest mentorship) {
        return mentorshipService.updateMentorship(mentorship);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteMentorship(@PathVariable Long id) {
        mentorshipService.deleteMentorship(id);
        return "Mentorship Request deleted successfully";
    }

    @GetMapping("/get/{id}")
    public MentorshipRequest getMentorshipById(@PathVariable Long id) {
        return mentorshipService.getMentorshipById(id);
    }

    @GetMapping("/getall")
    public List<MentorshipRequest> getAllMentorships() {
        return mentorshipService.getAllMentorships();
    }

    // Student cancels their own PENDING request
    @PutMapping("/cancel/{requestId}")
    public MentorshipRequest cancelMentorshipRequest(
            @PathVariable Long requestId,
            @RequestParam Integer studentId) {
        return mentorshipService.cancelMentorshipRequest(requestId, studentId);
    }

    // Alumni accepts a PENDING request (ownership verified by alumniId)
    @PutMapping("/accept/{requestId}")
    public MentorshipRequest acceptMentorshipRequest(
            @PathVariable Long requestId,
            @RequestParam Integer alumniId) {
        return mentorshipService.acceptMentorshipRequest(requestId, alumniId);
    }

    // Alumni rejects a PENDING request (ownership verified by alumniId)
    @PutMapping("/reject/{requestId}")
    public MentorshipRequest rejectMentorshipRequest(
            @PathVariable Long requestId,
            @RequestParam Integer alumniId) {
        return mentorshipService.rejectMentorshipRequest(requestId, alumniId);
    }

    // Alumni completes an ACCEPTED request (ownership verified by alumniId)
    @PutMapping("/complete/{requestId}")
    public MentorshipRequest completeMentorshipRequest(
            @PathVariable Long requestId,
            @RequestParam Integer alumniId) {
        return mentorshipService.completeMentorshipRequest(requestId, alumniId);
    }
}
