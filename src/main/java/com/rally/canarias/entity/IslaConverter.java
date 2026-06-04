package com.rally.canarias.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class IslaConverter implements AttributeConverter<Isla, String> {

    @Override
    public String convertToDatabaseColumn(Isla isla) {
        return isla != null ? isla.name() : null;
    }

    @Override
    public Isla convertToEntityAttribute(String value) {
        if (value == null) return null;
        for (Isla isla : Isla.values()) {
            if (isla.name().equalsIgnoreCase(value.replace(" ", "_"))) {
                return isla;
            }
        }
        throw new IllegalArgumentException("Valor de isla desconocido: " + value);
    }
}
