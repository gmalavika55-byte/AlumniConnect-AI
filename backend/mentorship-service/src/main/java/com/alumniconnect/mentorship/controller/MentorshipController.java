package com.alumniconnect.mentorship.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.mentorship.entity.MentorshipRequest;
import com.alumniconnect.mentorship.service.MentorshipService;

@RestController
@RequestMapping("/mentorship")
@CrossOrigin(origins = "*")
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
    public String deleteMentorship(@PathVariable Integer id) {
        mentorshipService.deleteMentorship(id);
        return "Mentorship Request deleted successfully";
    }

    @GetMapping("/get/{id}")
    public MentorshipRequest getMentorshipById(@PathVariable Integer id) {
        return mentorshipService.getMentorshipById(id);
    }

    @GetMapping("/getall")
    public List<MentorshipRequest> getAllMentorships() {
        return mentorshipService.getAllMentorships();
    }
}
