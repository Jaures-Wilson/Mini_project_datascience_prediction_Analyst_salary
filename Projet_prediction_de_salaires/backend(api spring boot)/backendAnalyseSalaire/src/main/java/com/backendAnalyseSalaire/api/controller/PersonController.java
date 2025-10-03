package com.backendAnalyseSalaire.api.controller;

import com.backendAnalyseSalaire.api.model.Person;
import com.backendAnalyseSalaire.api.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")  // Autorise les requêtes depuis React
public class PersonController {

    @Autowired
    private PersonRepository personRepository;

    // GET all persons
    @GetMapping
    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    // POST new person
    @PostMapping
    public Person addPerson(@RequestBody Person person) {
        return personRepository.save(person);
    }
}



