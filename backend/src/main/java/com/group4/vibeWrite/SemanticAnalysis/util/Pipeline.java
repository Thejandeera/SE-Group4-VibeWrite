//package com.group4.vibeWrite.SemanticAnalysis.util;
//
//import edu.stanford.nlp.pipeline.StanfordCoreNLP;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import java.util.Properties;
//
//@Configuration
//public class Pipeline {
//
//    private static final String PROPERTIES_NAME = "tokenize,ssplit,pos,lemma,ner,parse,sentiment";
//
//    @Bean
//    public StanfordCoreNLP stanfordCoreNLP() {
//        Properties properties = new Properties();
//        properties.setProperty("annotators", PROPERTIES_NAME);
//        properties.setProperty("sentiment.model", "edu/stanford/nlp/models/sentiment/sentiment.ser.gz");
//        return new StanfordCoreNLP(properties);
//    }
//}