package com.rally.canarias.repository;

import com.rally.canarias.entity.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    List<Equipo> findByNombreContainingIgnoreCase(String nombre);

    List<Equipo> findByNacionalidad(String nacionalidad);

    @Query("SELECT COUNT(p) FROM Piloto p WHERE p.equipo.id = :equipoId")
    Long countPilotosByEquipoId(@Param("equipoId") Long equipoId);
}
