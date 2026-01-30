package com.backendAnalyseSalaire.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "socio_data")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int age;

    @Enumerated(EnumType.STRING)
    private Sexe sexe;

    @Column(name = "education_level")
    private String educationLevel;

    private String sector;

    @Column(name = "hours_per_week")
    private int hoursPerWeek;

    @Column(name = "salary")
    private double salary;   // ✅ maintenant un montant réel

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public Sexe getSexe() { return sexe; }
    public void setSexe(Sexe sexe) { this.sexe = sexe; }

    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public int getHoursPerWeek() { return hoursPerWeek; }
    public void setHoursPerWeek(int hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; }

    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }

    public enum Sexe { Male, Female }
}
