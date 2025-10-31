package com.group4.vibeWrite.Config;

import com.group4.vibeWrite.UserManagement.Util.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;

import java.util.List;
import java.io.IOException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtAuthenticationFilter jwtAuthenticationFilter,
                                                   UserDetailsService userDetailsService) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/api/users/**",
                                "/api/gpa",
                                "/api/hello/**",
                                "/drafts/**",
                                "/api/readability/**",
                                "/api/analyze/**",
                                "/api/v1/notifications/**",
                                "/api/v1/grammar/**",
                                "/api/v1/semantic-analysis/**",
                                "/api/test",           // Test endpoint
                                "/api/health" ,
                                "/api/text-enhancements",
                                "/api/text-enhancements/**"// Health check
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider(userDetailsService))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new FlutterCorsFilter(), UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedEntryPoint()));
        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint unauthorizedEntryPoint() {
        return (request, response, authException) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{ \"error\": \"Unauthorized\", \"message\": \"Full authentication required\" }");
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        // Web frontend origins
        List<String> allowedOrigins = List.of(
                frontendUrl,
                "http://localhost:5173",
                "http://localhost:3000"
        );
        config.setAllowedOrigins(allowedOrigins);

        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        System.out.println("🔐 Allowed CORS origins: " + allowedOrigins);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Flutter-specific CORS filter
    public static class FlutterCorsFilter extends OncePerRequestFilter {

        private static final String FLUTTER_APP_HEADER = "X-Requested-From";
        private static final String EXPECTED_HEADER_VALUE = "VibeWrite-Flutter-App";

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        jakarta.servlet.FilterChain filterChain)
                throws jakarta.servlet.ServletException, IOException {

            String appHeader = request.getHeader(FLUTTER_APP_HEADER);
            String userAgent = request.getHeader("User-Agent");
            String origin = request.getHeader("Origin");
            String method = request.getMethod();

            System.out.println("🔍 Request Analysis:");
            System.out.println("Method: " + method);
            System.out.println("Path: " + request.getRequestURI());
            System.out.println("X-Requested-From: " + appHeader);
            System.out.println("User-Agent: " + userAgent);
            System.out.println("Origin: " + origin);

            // Check if request is from Flutter app
            boolean isFlutterApp = EXPECTED_HEADER_VALUE.equals(appHeader);

            // Check if it's a Flutter HTTP client based on User-Agent
            boolean isFlutterUserAgent = userAgent != null && (
                    userAgent.contains("Dart/") ||
                            userAgent.contains("Flutter") ||
                            userAgent.toLowerCase().contains("dart")
            );

            // Allow Flutter requests
            if (isFlutterApp || isFlutterUserAgent) {
                response.setHeader("Access-Control-Allow-Origin", "*");
                response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                response.setHeader("Access-Control-Allow-Headers",
                        "Authorization, Content-Type, Accept, X-Requested-With, X-Requested-From, X-App-Version");
                response.setHeader("Access-Control-Max-Age", "3600");

                if (isFlutterApp) {
                    System.out.println("✅ VibeWrite Flutter app request allowed (custom header)");
                } else {
                    System.out.println("✅ Flutter request allowed (user-agent detection)");
                }

                // Handle preflight OPTIONS request
                if ("OPTIONS".equals(method)) {
                    response.setStatus(HttpServletResponse.SC_OK);
                    return;
                }
            }
            // For web requests, let the default CORS configuration handle it
            else if (origin != null) {
                System.out.println("🌐 Web request - using default CORS configuration");
            }

            filterChain.doFilter(request, response);
        }
    }
}