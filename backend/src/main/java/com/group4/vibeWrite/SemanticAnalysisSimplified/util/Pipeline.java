package com.group4.vibeWrite.SemanticAnalysisSimplified.util;

import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.Properties;

@Configuration
public class Pipeline {

    // Only include annotators required for Sentiment Analysis
    private static final String PROPERTIES_NAME = "tokenize,ssplit,pos,lemma,parse,sentiment";

    @Bean
    public StanfordCoreNLP stanfordCoreNLP() {
        Properties properties = new Properties();
        properties.setProperty("annotators", PROPERTIES_NAME);
        // Explicitly set the sentiment model property
        properties.setProperty("sentiment.model", "edu/stanford/nlp/models/sentiment/sentiment.ser.gz");
        return new StanfordCoreNLP(properties);
    }
}