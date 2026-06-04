package com.rally.canarias.service;

import com.rally.canarias.entity.Piloto;
import com.rally.canarias.repository.PilotoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PilotoService {

    private final PilotoRepository pilotoRepository;

    public PilotoService(PilotoRepository pilotoRepository) {
        this.pilotoRepository = pilotoRepository;
    }

    // CRUD básico
    public List<Piloto> findAll() {
        return pilotoRepository.findAll();
    }

    public Optional<Piloto> findById(Long id) {
        return pilotoRepository.findById(id);
    }

    public Piloto save(Piloto piloto) {
        return pilotoRepository.save(piloto);
    }

    public void deleteById(Long id) {
        pilotoRepository.deleteById(id);
    }

    // Búsqueda
    public List<Piloto> findByEquipoId(Long equipoId) {
        return pilotoRepository.findByEquipoId(equipoId);
    }

    public List<Piloto> findByNombreContainingIgnoreCase(String nombre, String sortField, String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortField);
        if (nombre == null || nombre.isBlank()) {
            return pilotoRepository.findAll(sort);
        }
        return pilotoRepository.findByNombreContainingIgnoreCase(nombre, sort);
    }

    public List<Piloto> findByActivoTrue() {
        return pilotoRepository.findByActivoTrue();
    }
}
