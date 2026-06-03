package com.rally.canarias.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rally.canarias.entity.Etapa;
import com.rally.canarias.entity.Isla;

@Repository
public interface EtapaRepository extends JpaRepository<Etapa, Long> {
    
    // Spring genera el SQL automáticamente basándose en el nombre del método
    List<Etapa> findByIsla(Isla isla);

    // Tu Trello pide específicamente buscar por nombre ignorando mayúsculas
    List<Etapa> findByNombreContainingIgnoreCase(String nombre);

    // Opcional: Si necesitas buscar por fecha exacta
    List<Etapa> findByFecha(String fecha);

    @Query("SELECT t.etapa FROM Tramo t GROUP BY t.etapa HAVING COUNT(t) >= :minimoTramos")
    List<Etapa> findEtapasConMinimoTramos(@Param("minimoTramos") int minimoTramos);
}