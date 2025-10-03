package com.backendAnalyseSalaire.api.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/ml")
@CrossOrigin(origins = "*")
public class MLController {

    @PostMapping("/evaluate")
    public Object evaluateModels(@RequestBody Map<String, Object> payload) {
        RestTemplate restTemplate = new RestTemplate();
        String flaskUrl = "http://127.0.0.1:5000/evaluate";
        return restTemplate.postForObject(flaskUrl, payload, Object.class);
    }

    @PostMapping("/predict")
    public Object predictSalary(@RequestBody Map<String, Object> payload) {
        RestTemplate restTemplate = new RestTemplate();
        String flaskUrl = "http://127.0.0.1:5000/predict";
        return restTemplate.postForObject(flaskUrl, payload, Object.class);
    }
}
