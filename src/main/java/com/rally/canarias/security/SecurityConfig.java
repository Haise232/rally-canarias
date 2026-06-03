package com.rally.canarias.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final ApiKeyFilter apiKeyFilter;

    // Inyectamos nuestro filtro personalizado
    public SecurityConfig(ApiKeyFilter apiKeyFilter) {
        this.apiKeyFilter = apiKeyFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Desactivamos CSRF (Obligatorio en APIs REST porque no usamos cookies)
            .csrf(csrf -> csrf.disable())
            
            // 2. Le decimos a Spring que no guarde sesiones (STATELESS). 
            // Cada petición debe traer su propia API Key.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 3. Exigimos que CUALQUIER petición requiera estar autenticada
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()
            )
            
            // 4. Colocamos nuestro filtro de API Key ANTES del filtro estándar de usuario/contraseña
            .addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}