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
@RequestMapping("/api/v1/tramos")
public class TramoController {

    private final TramoService tramoService;

    public TramoController(TramoService tramoService) {
        this.tramoService = tramoService;
    }

    // GET: Obtener lista completa
    @GetMapping
    public ResponseEntity<List<Tramo>> listarTodos() {
        return ResponseEntity.ok(tramoService.obtenerTodos());
    }

    // GET: Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<Tramo> obtenerPorId(@PathVariable Integer id) {
        Optional<Tramo> tramo = tramoService.obtenerPorId(id);
        return tramo.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET: Búsqueda con Query Params y Sort dinámico (Módulo B)
    // Ejemplo de uso en Postman: /api/v1/tramos/buscar?nombre=curvas&sort=distanciaKm,desc
    @GetMapping("/buscar")
    public ResponseEntity<List<Tramo>> buscarPorNombre(
            @RequestParam String nombre, 
            Sort sort) { // Spring inyecta el sort automáticamente desde la URL
        return ResponseEntity.ok(tramoService.buscarPorNombre(nombre, sort));
    }

    // POST: Crear tramo
    @PostMapping
    public ResponseEntity<Tramo> crearTramo(@RequestBody Tramo tramo) {
        Tramo nuevoTramo = tramoService.guardarTramo(tramo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTramo);
    }

    // PUT: Actualizar tramo
    @PutMapping("/{id}")
    public ResponseEntity<Tramo> actualizarTramo(@PathVariable Integer id, @RequestBody Tramo tramoDetalles) {
        Optional<Tramo> tramoExistente = tramoService.obtenerPorId(id);
        
        if (tramoExistente.isPresent()) {
            Tramo tramoActualizado = tramoExistente.get();
            tramoActualizado.setNombre(tramoDetalles.getNombre());
            tramoActualizado.setDistanciaKm(tramoDetalles.getDistanciaKm());
            tramoActualizado.setDificultad(tramoDetalles.getDificultad());
            tramoActualizado.setSuperficie(tramoDetalles.getSuperficie());
            // Nota: Aquí también podrías actualizar la etapa vinculada si fuera necesario
            
            return ResponseEntity.ok(tramoService.guardarTramo(tramoActualizado));
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTramo(@PathVariable Integer id) {
        if (tramoService.obtenerPorId(id).isPresent()) {
            tramoService.eliminarTramo(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }


    @PostMapping("/{tramoId}/pilotos/{pilotoId}")
    public ResponseEntity<Tramo> inscribirPiloto(@PathVariable Integer tramoId, @PathVariable Integer pilotoId) {
        // Llamaremos al servicio cuando esté lista la entidad Piloto
        Tramo tramoActualizado = tramoService.inscribirPiloto(tramoId, pilotoId);
        return ResponseEntity.ok(tramoActualizado);
    }

    @DeleteMapping("/{tramoId}/pilotos/{pilotoId}")
    public ResponseEntity<Void> desinscribirPiloto(@PathVariable Integer tramoId, @PathVariable Integer pilotoId) {
        tramoService.desinscribirPiloto(tramoId, pilotoId);
        return ResponseEntity.noContent().build();
    }
}