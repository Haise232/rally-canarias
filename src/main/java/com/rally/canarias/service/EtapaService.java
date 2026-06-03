package com.rally.canarias.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.rally.canarias.entity.Etapa;
import com.rally.canarias.entity.Isla;
import com.rally.canarias.repository.EtapaRepository;

@Service
public class EtapaService {

    private final EtapaRepository etapaRepository;

    // Inyección de dependencias por constructor
    public EtapaService(EtapaRepository etapaRepository) {
        this.etapaRepository = etapaRepository;
    }

    // ================= CRUD BÁSICO =================
    
    public List<Etapa> obtenerTodas() {
        return etapaRepository.findAll();
    }

    public Optional<Etapa> obtenerPorId(Long id) {
        return etapaRepository.findById(id);
    }

    public Etapa guardarEtapa(Etapa etapa) {
        return etapaRepository.save(etapa);
    }

    public void eliminarEtapa(Long id) {
        etapaRepository.deleteById(id);
    }

    // ================= BÚSQUEDAS =================

    public List<Etapa> buscarPorNombre(String nombre) {
        return etapaRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Etapa> buscarPorIsla(Isla isla) {
        return etapaRepository.findByIsla(isla);
    }
}