package com.rally.canarias.service;

import com.rally.canarias.entity.Equipo;
import com.rally.canarias.repository.EquipoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipoService {

    private final EquipoRepository equipoRepository;

    public EquipoService(EquipoRepository equipoRepository) {
        this.equipoRepository = equipoRepository;
    }

    // CRUD básico
    public List<Equipo> findAll() {
        return equipoRepository.findAll();
    }

    public Equipo findById(Long id) {
        return equipoRepository.findById(id).orElse(null);
    }

    public Equipo save(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    public void deleteById(Long id) {
        equipoRepository.deleteById(id);
    }

    // Búsqueda
    public List<Equipo> findByNombreContainingIgnoreCase(String nombre) {
        return equipoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Equipo> findByNacionalidad(String nacionalidad) {
        return equipoRepository.findByNacionalidad(nacionalidad);
    }

    // Contar pilotos por equipo
    public Long countPilotosByEquipoId(Long equipoId) {
        return equipoRepository.countPilotosByEquipoId(equipoId);
    }
}
