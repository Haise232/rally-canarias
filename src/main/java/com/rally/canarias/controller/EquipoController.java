package com.rally.canarias.controller;

import com.rally.canarias.entity.Equipo;
import com.rally.canarias.service.EquipoService;
import org.springframework.http.HttpStatus;
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

    @GetMapping
    public List<Equipo> getAll() {
        return equipoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipo> getById(@PathVariable Long id) {
        return equipoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public List<Equipo> buscarPorNombre(@RequestParam(required = false) String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return equipoService.findAll();
        }
        return equipoService.findByNombreContainingIgnoreCase(nombre);
    }

    @GetMapping("/nacionalidad")
    public List<Equipo> getByNacionalidad(@RequestParam(required = false) String nacionalidad) {
        if (nacionalidad == null || nacionalidad.isBlank()) {
            return equipoService.findAll();
        }
        return equipoService.findByNacionalidad(nacionalidad);
    }

    @GetMapping("/{id}/pilotos/count")
    public ResponseEntity<Long> countPilotos(@PathVariable Long id) {
        return ResponseEntity.ok(equipoService.countPilotosByEquipoId(id));
    }

    @PostMapping
    public ResponseEntity<Equipo> create(@RequestBody Equipo equipo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(equipoService.save(equipo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipo> update(@PathVariable Long id, @RequestBody Equipo equipo) {
        return equipoService.findById(id)
                .map(existing -> {
                    equipo.setId(id);
                    return ResponseEntity.ok(equipoService.save(equipo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return equipoService.findById(id)
                .map(existing -> {
                    equipoService.deleteById(id);
                    return ResponseEntity.<Void>noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
