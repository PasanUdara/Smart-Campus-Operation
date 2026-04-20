package com.example.smartcampus.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // වර්තමාන වැඩ කරන directory එකේ තියෙන uploads ෆෝල්ඩර් එකේ path එක ගන්නවා
        String uploadPath = Paths.get("uploads").toAbsolutePath().toString();
        
        // Windows වල path එක නිවැරදිව සෑදීම
        if (!uploadPath.endsWith(File.separator)) {
            uploadPath += File.separator;
        }

        // http://localhost:8080/uploads/** හරහා එන request, 
        // පරිගණකයේ තියෙන "file:D:/.../uploads/" folder එකට යොමු කරනවා
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath)
                .setCachePeriod(0);

        System.out.println(">>> IMAGE SERVER ACTIVE AT: " + uploadPath);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}