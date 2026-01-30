package com.backendAnalyseSalaire.api.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;


@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "<h1>Bienvenue sur Backend Analyse Salaire</h1>"
             + "<p>Endpoints disponibles : /api/ml/evaluate, /api/ml/predict</p>";
    }
}
