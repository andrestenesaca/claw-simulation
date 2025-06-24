package com.andres.claw_simulation;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class page {
    @GetMapping("/")
    public String home(Model model) {
        return "index";
    }
}
