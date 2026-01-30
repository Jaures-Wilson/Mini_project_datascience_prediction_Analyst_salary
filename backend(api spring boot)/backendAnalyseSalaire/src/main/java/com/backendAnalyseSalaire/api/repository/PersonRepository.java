package com.backendAnalyseSalaire.api.repository;

import com.backendAnalyseSalaire.api.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    // Tu peux ajouter des méthodes personnalisées si besoin
}
