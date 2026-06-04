package com.rally.canarias.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class DificultadConverter implements AttributeConverter<Dificultad, String> {

    @Override
    public String convertToDatabaseColumn(Dificultad dificultad) {
        return dificultad != null ? dificultad.name() : null;
    }

    @Override
    public Dificultad convertToEntityAttribute(String value) {
        if (value == null) return null;
        for (Dificultad d : Dificultad.values()) {
            if (d.name().equalsIgnoreCase(value)) {
                return d;
            }
        }
        throw new IllegalArgumentException("Valor de dificultad desconocido: " + value);
    }
}
