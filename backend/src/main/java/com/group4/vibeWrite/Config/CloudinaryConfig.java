package com.group4.vibeWrite.Config;



import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dufjnce0g");
        config.put("api_key", "339148397489187");
        config.put("api_secret", "PZ3Sf__RTic4K_FmuT-XISsqzw8");
        config.put("secure", "true");
        return new Cloudinary(config);
    }
}
