package com.rally.canarias.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
public class Tramo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; 
    private String nombre;
    private int distancia;

    @Enumerated(EnumType.STRING)
    private Dificultad dificultad;

    @Enumerated(EnumType.STRING)
    private Isla isla;

    @ManyToOne
    @JoinColumn(name = "etapa_id", nullable = false) 
    private Etapa etapa;

    public Tramo() {
    }

    public Tramo(int id, String nombre, int distancia, Dificultad dificultad, Isla isla) {
        this.id = id;
        this.nombre = nombre;
        this.distancia = distancia;
        this.dificultad = dificultad;
        this.isla = isla;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getDistancia() {
        return distancia;
    }

    public void setDistancia(int distancia) {
        this.distancia = distancia;
    }

    public Dificultad getDificultad() {
        return dificultad;
    }

    public void setDificultad(Dificultad dificultad) {
        this.dificultad = dificultad;
    }

    public Isla getIsla() {
        return isla;
    }

    public void setIsla(Isla isla) {
        this.isla = isla;
    }

    public Etapa getEtapa() {
        return etapa;
    }

    public void setEtapa(Etapa etapa) {
        this.etapa = etapa;
    }

}
