package com.rally.canarias.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rally.canarias.entity.Dificultad;
import com.rally.canarias.entity.Tramo;

@Repository
public interface TramoRepository extends JpaRepository<Tramo, Long> {

    List<Tramo> findByEtapaId(Long etapaId);

    List<Tramo> findByNombreContainingIgnoreCase(org.springframework.data.domain.Sort sort, String nombre);

    List<Tramo> findByDificultad(Dificultad dificultad);

    @Query("SELECT t FROM Tramo t JOIN t.pilotos p WHERE p.nacionalidad = :nacionalidad")
    List<Tramo> findTramosPorNacionalidad(@Param("nacionalidad") String nacionalidad);
}
