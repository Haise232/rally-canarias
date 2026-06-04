package com.rally.canarias.entity;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "tramos")
public class Tramo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    private String nombre;
    private Double distanciaKm;

    @Convert(converter = DificultadConverter.class)
    private Dificultad dificultad;

    @Convert(converter = IslaConverter.class)
    private Isla isla;

    @Convert(converter = SuperficieConverter.class)
    private Superficie superficie;

    @ManyToMany(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinTable(
        name = "tramo_piloto",
        joinColumns = @JoinColumn(name = "tramo_id"),
        inverseJoinColumns = @JoinColumn(name = "piloto_id")
    )
    @JsonIgnoreProperties({"equipo"})
    private List<Piloto> pilotos = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "etapa_id", nullable = false)
    private Etapa etapa;

    public Tramo() {
    }

    public Tramo(Long id, String nombre, Double distanciaKm, Dificultad dificultad, Isla isla, Superficie superficie, Etapa etapa) {
        this.id = id;
        this.nombre = nombre;
        this.distanciaKm = distanciaKm;
        this.dificultad = dificultad;
        this.isla = isla;
        this.superficie = superficie;
        this.etapa = etapa;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Double getDistanciaKm() {
        return distanciaKm;
    }

    public void setDistanciaKm(Double distanciaKm) {
        this.distanciaKm = distanciaKm;
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

    public Superficie getSuperficie() {
        return superficie;
    }

    public void setSuperficie(Superficie superficie) {
        this.superficie = superficie;
    }

    public List<Piloto> getPilotos() {
        return pilotos;
    }

    public void setPilotos(List<Piloto> pilotos) {
        this.pilotos = pilotos;
    }

}
