package com.rally.canarias.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rally.canarias.entity.Etapa;
import com.rally.canarias.service.EtapaService;

@RestController
@RequestMapping("/api/etapas")
public class EtapaController {

    private final EtapaService etapaService;

    public EtapaController(EtapaService etapaService) {
        this.etapaService = etapaService;
    }

    @GetMapping
    public ResponseEntity<List<Etapa>> listarTodas() {
        return ResponseEntity.ok(etapaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etapa> obtenerPorId(@PathVariable Long id) {
        Optional<Etapa> etapa = etapaService.obtenerPorId(id);
        return etapa.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Etapa> crearEtapa(@RequestBody Etapa etapa) {
        Etapa nuevaEtapa = etapaService.guardarEtapa(etapa);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaEtapa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Etapa> actualizarEtapa(@PathVariable Long id, @RequestBody Etapa etapaDetalles) {
        Optional<Etapa> etapaExistente = etapaService.obtenerPorId(id);
        
        if (etapaExistente.isPresent()) {
            Etapa etapaActualizada = etapaExistente.get();
            etapaActualizada.setNombre(etapaDetalles.getNombre());
            etapaActualizada.setDescripcion(etapaDetalles.getDescripcion());
            etapaActualizada.setFecha(etapaDetalles.getFecha());
            etapaActualizada.setIsla(etapaDetalles.getIsla());
            
            return ResponseEntity.ok(etapaService.guardarEtapa(etapaActualizada));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEtapa(@PathVariable Long id) {
        if (etapaService.obtenerPorId(id).isPresent()) {
            etapaService.eliminarEtapa(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}