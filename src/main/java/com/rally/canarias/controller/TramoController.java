package com.rally.canarias.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rally.canarias.entity.Tramo;
import com.rally.canarias.service.TramoService;

@RestController
@RequestMapping("/api/tramos")
public class TramoController {

    private final TramoService tramoService;

    public TramoController(TramoService tramoService) {
        this.tramoService = tramoService;
    }


    @GetMapping
    public ResponseEntity<List<Tramo>> listarTodos() {
        return ResponseEntity.ok(tramoService.findAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Tramo> obtenerPorId(@PathVariable Long id) {
        Optional<Tramo> tramo = tramoService.findById(id);
        return tramo.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/buscar")
    public ResponseEntity<List<Tramo>> buscarPorNombre(
            @RequestParam(required = false) String nombre,
            Sort sort) {
        if (nombre == null || nombre.isBlank()) {
            return ResponseEntity.ok(tramoService.findAll());
        }
        return ResponseEntity.ok(tramoService.findByName(sort, nombre));
    }

    @PostMapping
    public ResponseEntity<Tramo> crearTramo(@RequestBody Tramo tramo) {
        Tramo nuevoTramo = tramoService.save(tramo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTramo);
    }

    // PUT: Actualizar tramo
    @PutMapping("/{id}")
    public ResponseEntity<Tramo> actualizarTramo(@PathVariable Long id, @RequestBody Tramo tramoDetalles) {
        Optional<Tramo> tramoExistente = tramoService.findById(id);
        
        if (tramoExistente.isPresent()) {
            Tramo tramoActualizado = tramoExistente.get();
            
            tramoActualizado.setNombre(tramoDetalles.getNombre());
            tramoActualizado.setDistanciaKm(tramoDetalles.getDistanciaKm());
            tramoActualizado.setDificultad(tramoDetalles.getDificultad());
            tramoActualizado.setSuperficie(tramoDetalles.getSuperficie());
            tramoActualizado.setEtapa(tramoDetalles.getEtapa()); 
            tramoActualizado.setPilotos(tramoDetalles.getPilotos());
            
            return ResponseEntity.ok(tramoService.save(tramoActualizado));
        } else {
            return ResponseEntity.notFound().build();
        }
    } 
    


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTramo(@PathVariable Long id) {
        if (tramoService.findById(id).isPresent()) {
            tramoService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }


    @PostMapping("/{tramoId}/pilotos/{pilotoId}")
    public ResponseEntity<Tramo> inscribirPiloto(@PathVariable Long tramoId, @PathVariable Long pilotoId) {
        // Llamaremos al servicio cuando esté lista la entidad Piloto
        Tramo tramoActualizado = tramoService.inscribirPilotoEnTramo(tramoId, pilotoId);
        return ResponseEntity.ok(tramoActualizado);
    }

    @DeleteMapping("/{tramoId}/pilotos/{pilotoId}")
    public ResponseEntity<Void> desinscribirPiloto(@PathVariable Long tramoId, @PathVariable Long pilotoId) {
        tramoService.desinscribirPilotoDeTramo(tramoId, pilotoId);
        return ResponseEntity.noContent().build();
    }
}