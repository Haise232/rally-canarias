package com.rally.canarias.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.rally.canarias.entity.Tramo;
import com.rally.canarias.repository.TramoRepository;

@Service
public class TramoService {
    
    private final TramoRepository tramoRepository;

    public TramoService(TramoRepository tramoRepository) {
        this.tramoRepository = tramoRepository;
    }

    public List<Tramo> findAll() {
        return tramoRepository.findAll();
    }

    public Optional<Tramo> findById(Integer id) {
        return tramoRepository.findById(id);
    }

    public Tramo save(Tramo tramo) {
        return tramoRepository.save(tramo);
    }

    public void deleteById(Integer id) {
        tramoRepository.deleteById(id);
    }

    public List<Tramo> findByName(String nombre) {
        return tramoRepository.findByNombreContainingIgnoreCase( Sort.by("nombre"), nombre);
    }
}
