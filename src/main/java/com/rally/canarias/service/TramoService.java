package com.rally.canarias.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.rally.canarias.entity.Piloto;
import com.rally.canarias.entity.Tramo;
import com.rally.canarias.repository.PilotoRepository;
import com.rally.canarias.repository.TramoRepository;

@Service
public class TramoService {

    private final TramoRepository tramoRepository;
    private final PilotoRepository pilotoRepository;

    public TramoService(TramoRepository tramoRepository, PilotoRepository pilotoRepository) {
        this.tramoRepository = tramoRepository;
        this.pilotoRepository = pilotoRepository;
    }

    public List<Tramo> findAll() {
        return tramoRepository.findAll();
    }

    public Optional<Tramo> findById(Long id) {
        return tramoRepository.findById(id);
    }

    public Tramo save(Tramo tramo) {
        return tramoRepository.save(tramo);
    }

    public void delete(Tramo tramo) {
        tramoRepository.delete(tramo);
    }

    public void deleteById(Long id) {
        tramoRepository.deleteById(id);
    }

    public List<Tramo> findByName(String nombre, Sort sort) {
        return tramoRepository.findByNombreContainingIgnoreCase(sort, nombre);
    }

    public Tramo inscribirPilotoEnTramo(Long tramoId, Long pilotoId) {
        Tramo tramo = tramoRepository.findById(tramoId)
                .orElseThrow(() -> new RuntimeException("Tramo no encontrado con ID: " + tramoId));
        Piloto piloto = pilotoRepository.findById(pilotoId)
                .orElseThrow(() -> new RuntimeException("Piloto no encontrado con ID: " + pilotoId));
        tramo.getPilotos().add(piloto);
        return tramoRepository.save(tramo);
    }

    public void desinscribirPilotoDeTramo(Long tramoId, Long pilotoId) {
        Tramo tramo = tramoRepository.findById(tramoId)
                .orElseThrow(() -> new RuntimeException("Tramo no encontrado con ID: " + tramoId));
        Piloto piloto = pilotoRepository.findById(pilotoId)
                .orElseThrow(() -> new RuntimeException("Piloto no encontrado con ID: " + pilotoId));
        tramo.getPilotos().remove(piloto);
        tramoRepository.save(tramo);
    }
}
