package com.rally.canarias.controller;

import com.rally.canarias.entity.Equipo;
import com.rally.canarias.service.EquipoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoService equipoService;

    public EquipoController(EquipoService equipoService) {
        this.equipoService = equipoService;
    }

    // GET lista
    @GetMapping
    public List<Equipo> getAll() {
        return equipoService.findAll();
    }

    // GET por id
    @GetMapping("/{id}")
    public ResponseEntity<Equipo> getById(@PathVariable Long id) {
        Equipo equipo = equipoService.findById(id);
        if (equipo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(equipo);
    }

    // GET buscar por nombre
    @GetMapping("/buscar")
    public List<Equipo> buscarPorNombre(@RequestParam String nombre) {
        return equipoService.findByNombreContainingIgnoreCase(nombre);
    }

    // GET por nacionalidad
    @GetMapping("/nacionalidad")
    public List<Equipo> getByNacionalidad(@RequestParam String nacionalidad) {
        return equipoService.findByNacionalidad(nacionalidad);
    }

    // GET contar pilotos
    @GetMapping("/{id}/pilotos/count")
    public ResponseEntity<Long> countPilotos(@PathVariable Long id) {
        Long count = equipoService.countPilotosByEquipoId(id);
        return ResponseEntity.ok(count);
    }

    // POST crear
    @PostMapping
    public Equipo create(@RequestBody Equipo equipo) {
        return equipoService.save(equipo);
    }

    // PUT actualizar
    @PutMapping("/{id}")
    public ResponseEntity<Equipo> update(@PathVariable Long id, @RequestBody Equipo equipo) {
        Equipo existing = equipoService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        equipo.setId(id);
        return ResponseEntity.ok(equipoService.save(equipo));
    }

    // DELETE eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Equipo existing = equipoService.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        equipoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
