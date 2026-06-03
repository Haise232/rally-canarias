package com.rally.canarias.security;

import java.io.IOException;
import java.util.Collections;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


@Component
public class ApiKeyFilter extends OncePerRequestFilter {
    
    @Value("${app.api.key}")
    private String apiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestApiKey = request.getHeader("X-API-KEY");
        if (apiKey.equals(requestApiKey)) {
            // Si la API key es válida, autenticamos al usuario con un rol genérico
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken("apiUser", null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            // Si la API key no es válida, respondemos con 401 Unauthorized
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
      return request.getMethod().equals("GET") ||
             request.getServletPath().startsWith("/css/") ||
             request.getServletPath().startsWith("/js/") ||
             request.getServletPath().startsWith("/assets/") ||
             request.getServletPath().equals("/") ||
             request.getServletPath().equals("/index.html");
  }
}
