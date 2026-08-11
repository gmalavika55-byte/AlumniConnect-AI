package com.alumniconnect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.entity.Fundraising;
import com.alumniconnect.service.FundraisingService;

@RestController
@RequestMapping("/fundraising")
public class FundraisingController {

    @Autowired
    private FundraisingService fundraisingService;

    @PostMapping("/add")
    public Fundraising addFundraising(@RequestBody Fundraising fundraising) {
        return fundraisingService.addFundraising(fundraising);
    }

    @PutMapping("/update")
    public Fundraising updateFundraising(@RequestBody Fundraising fundraising) {
        return fundraisingService.updateFundraising(fundraising);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteFundraising(@PathVariable Integer id) {
        fundraisingService.deleteFundraising(id);
        return "Fundraising deleted successfully";
    }

    @GetMapping("/get/{id}")
    public Fundraising getFundraisingById(@PathVariable Integer id) {
        return fundraisingService.getFundraisingById(id);
    }

    @GetMapping("/getall")
    public List<Fundraising> getAllFundraisings() {
        return fundraisingService.getAllFundraisings();
    }

}