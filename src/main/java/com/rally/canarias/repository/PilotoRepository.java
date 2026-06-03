package com.rally.canarias.repository;

import com.rally.canarias.entity.Piloto;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PilotoRepository extends JpaRepository<Piloto, Long> {

    List<Piloto> findByEquipoId(Long equipoId);

    List<Piloto> findByNombreContainingIgnoreCase(String nombre, Sort sort);

    List<Piloto> findByActivoTrue();

    // @Query("SELECT p FROM Piloto p JOIN p.tramos t GROUP BY p HAVING COUNT(t) >= :minTramos")
    // List<Piloto> findPilotosConMinimoTramos(@Param("minTramos") int minTramos);
    // Nota: Se activará cuando se añada la relación @ManyToMany Piloto-Tramo (Commit 12)
}
