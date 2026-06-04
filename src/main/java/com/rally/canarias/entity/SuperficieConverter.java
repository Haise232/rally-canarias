package com.rally.canarias.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class SuperficieConverter implements AttributeConverter<Superficie, String> {

    @Override
    public String convertToDatabaseColumn(Superficie superficie) {
        return superficie != null ? superficie.name() : null;
    }

    @Override
    public Superficie convertToEntityAttribute(String value) {
        if (value == null) return null;
        for (Superficie s : Superficie.values()) {
            if (s.name().equalsIgnoreCase(value)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Valor de superficie desconocido: " + value);
    }
}
