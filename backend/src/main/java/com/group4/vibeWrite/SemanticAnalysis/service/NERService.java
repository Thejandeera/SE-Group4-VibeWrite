//package com.group4.vibeWrite.SemanticAnalysis.service;
//
//// Removed: import com.group4.vibeWrite.SemanticAnalysis.util.Pipeline; <-- Not needed anymore
//
//import edu.stanford.nlp.ling.CoreAnnotations;
//import edu.stanford.nlp.ling.CoreLabel;
//import edu.stanford.nlp.pipeline.CoreDocument;
//import edu.stanford.nlp.pipeline.StanfordCoreNLP;
//import org.springframework.stereotype.Service;
//
//import java.util.LinkedHashMap;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class NERService {
//
//    private final StanfordCoreNLP stanfordCoreNLP;
//
//    public NERService(StanfordCoreNLP stanfordCoreNLP) {
//        this.stanfordCoreNLP = stanfordCoreNLP;
//    }
//
//    public Map<String, String> extractNamedEntities(String text) {
//
//        CoreDocument coreDocument = new CoreDocument(text);
//
//        // Use the injected pipeline
//        this.stanfordCoreNLP.annotate(coreDocument);
//
//        Map<String, String> nerResults = new LinkedHashMap<>();
//        List<CoreLabel> coreLabelList = coreDocument.tokens();
//
//        for (CoreLabel coreLabel : coreLabelList) {
//            String ner = coreLabel.getString(CoreAnnotations.NamedEntityTagAnnotation.class);
//            if (!"O".equals(ner)) {
//                nerResults.put(coreLabel.originalText(), ner);
//            }
//        }
//
//        return nerResults;
//    }
//}