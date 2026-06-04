package com.rally.canarias.controller;

import com.rally.canarias.entity.Piloto;
import com.rally.canarias.service.PilotoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pilotos")
public class PilotoController {

    private final PilotoService pilotoService;

    public PilotoController(PilotoService pilotoService) {
        this.pilotoService = pilotoService;
    }

    @GetMapping
    public List<Piloto> getAll() {
        return pilotoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Piloto> getById(@PathVariable Long id) {
        return pilotoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/equipo/{equipoId}")
    public List<Piloto> getByEquipo(@PathVariable Long equipoId) {
        return pilotoService.findByEquipoId(equipoId);
    }

    @GetMapping("/buscar")
    public List<Piloto> buscarPorNombre(
            @RequestParam(required = false) String nombre,
            @RequestParam(defaultValue = "nombre") String sort,
            @RequestParam(defaultValue = "asc") String direction) {
        return pilotoService.findByNombreContainingIgnoreCase(nombre, sort, direction);
    }

    @GetMapping("/activos")
    public List<Piloto> getActivos() {
        return pilotoService.findByActivoTrue();
    }

    @PostMapping
    public ResponseEntity<Piloto> create(@RequestBody Piloto piloto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pilotoService.save(piloto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Piloto> update(@PathVariable Long id, @RequestBody Piloto piloto) {
        return pilotoService.findById(id)
                .map(existing -> {
                    piloto.setId(id);
                    return ResponseEntity.ok(pilotoService.save(piloto));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return pilotoService.findById(id)
                .map(existing -> {
                    pilotoService.deleteById(id);
                    return ResponseEntity.<Void>noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
