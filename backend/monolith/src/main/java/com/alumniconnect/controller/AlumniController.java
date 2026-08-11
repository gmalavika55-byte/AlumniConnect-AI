package com.alumniconnect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.entity.Alumni;
import com.alumniconnect.entity.LoginRequest;
import com.alumniconnect.repository.AlumniRepository;
import com.alumniconnect.service.AlumniService;

@RestController
@RequestMapping("/alumni")
public class AlumniController {

    @Autowired
    private AlumniService alumniService;

    @PostMapping("/add")
    public Alumni addAlumni(@RequestBody Alumni alumni) {
        return alumniService.addAlumni(alumni);
    }

    @PutMapping("/update")
    public Alumni updateAlumni(@RequestBody Alumni alumni) {
        return alumniService.updateAlumni(alumni);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteAlumni(@PathVariable Integer id) {
        alumniService.deleteAlumni(id);
        return "Alumni deleted successfully";
    }

    @GetMapping("/get/{id}")
    public Alumni getAlumniById(@PathVariable Integer id) {
        return alumniService.getAlumniById(id);
    }

    @GetMapping("/getall")
    public List<Alumni> getAllAlumni() {
        return alumniService.getAllAlumni();
    }

    @PostMapping("/login")
    public Alumni login(@RequestBody LoginRequest loginRequest) {

        return alumniService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword());
    }
}