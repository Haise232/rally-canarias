package com.rally.canarias.controller;

import com.rally.canarias.entity.Piloto;
import com.rally.canarias.service.PilotoService;
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

    // GET lista
    @GetMapping
    public List<Piloto> getAll() {
        return pilotoService.findAll();
    }

    // GET por id
    @GetMapping("/{id}")
    public ResponseEntity<Piloto> getById(@PathVariable Long id) {
        Piloto piloto = pilotoService.findById(id);
        if (piloto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(piloto);
    }

    // GET por equipo
    @GetMapping("/equipo/{equipoId}")
    public List<Piloto> getByEquipo(@PathVariable Long equipoId) {
        return pilotoService.findByEquipoId(equipoId);
    }

    // GET buscar por nombre con sort
    @GetMapping("/buscar")
    public List<Piloto> buscarPorNombre(
            @RequestParam String nombre,
            @RequestParam(defaultValue = "nombre") String sort,
            @RequestParam(defaultValue = "asc") String direction) {
        return pilotoService.findByNombreContainingIgnoreCase(nombre, sort, direction);
    }

    // GET pilotos activos
    @GetMapping("/activos")
    public List<Piloto> getActivos() {
        return pilotoService.findByActivoTrue();
    }

    // POST crear
    @PostMapping
    public Piloto create(@RequestBody Piloto piloto) {
        return pilotoService.save(piloto);
    }

    // PUT actualizar
    @PutMapping("/{id}")
    public ResponseEntity<Piloto> update(@PathVariable Long id, @RequestBody Piloto piloto) {
        Piloto existing = pilotoService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        piloto.setId(id);
        return ResponseEntity.ok(pilotoService.save(piloto));
    }

    // DELETE eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Piloto existing = pilotoService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        pilotoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
