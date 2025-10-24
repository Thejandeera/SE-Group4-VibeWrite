//package com.group4.vibeWrite.Config;
//
//
//
//import edu.stanford.nlp.pipeline.StanfordCoreNLP;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Lazy;
//import org.springframework.context.annotation.Primary;
//
//import java.util.Properties;
//
//@Configuration
//public class NLPConfig {
//
//    @Bean(name = "optimizedStanfordCoreNLP")
//    @Primary // This bean takes precedence
//    @Lazy // Delay initialization until first use
//    @ConditionalOnProperty(name = "nlp.enabled", havingValue = "true", matchIfMissing = true)
//    public StanfordCoreNLP optimizedStanfordCoreNLP() {
//        try {
//            Properties props = new Properties();
//
//            // Use minimal annotators to reduce memory usage
//            if (isProductionEnvironment()) {
//                // Production: minimal setup - only tokenization and sentence splitting
//                props.setProperty("annotators", "tokenize,ssplit");
//                props.setProperty("tokenize.language", "en");
//            } else {
//                // Development: full setup
//                props.setProperty("annotators", "tokenize,ssplit,pos,lemma");
//                // Remove heavy models that might not be available
//            }
//
//            // Memory optimization settings
//            props.setProperty("threads", "1"); // Single thread to save memory
//
//            return new StanfordCoreNLP(props);
//
//        } catch (OutOfMemoryError | RuntimeException e) {
//            // Fallback configuration with absolutely minimal features
//            Properties fallbackProps = new Properties();
//            fallbackProps.setProperty("annotators", "tokenize");
//            fallbackProps.setProperty("tokenize.language", "en");
//            return new StanfordCoreNLP(fallbackProps);
//        }
//    }
//
//    private boolean isProductionEnvironment() {
//        String env = System.getenv("ENVIRONMENT");
//        String profile = System.getProperty("spring.profiles.active");
//        return "production".equals(env) || "prod".equals(profile);
//    }
//}