package com.alumniconnect.fundraising.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.alumniconnect.fundraising.entity.Fundraising;
import com.alumniconnect.fundraising.service.FundraisingService;

@RestController
@RequestMapping("/fundraising")
@CrossOrigin(origins = "*")
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
    public String deleteFundraising(@PathVariable Long id) {
        fundraisingService.deleteFundraising(id);
        return "Fundraising deleted successfully";
    }

    @GetMapping("/get/{id}")
    public Fundraising getFundraisingById(@PathVariable Long id) {
        return fundraisingService.getFundraisingById(id);
    }

    @GetMapping("/getall")
    public List<Fundraising> getAllFundraisings() {
        return fundraisingService.getAllFundraisings();
    }
}
