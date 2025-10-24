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
//public class POSService {
//
//    private final StanfordCoreNLP stanfordCoreNLP;
//
//    public POSService(StanfordCoreNLP stanfordCoreNLP) {
//        this.stanfordCoreNLP = stanfordCoreNLP;
//    }
//
//    public Map<String, String> getPOSTags(String text) {
//
//        CoreDocument coreDocument = new CoreDocument(text);
//
//        // Use the injected pipeline instance
//        stanfordCoreNLP.annotate(coreDocument);
//
//        Map<String, String> posTags = new LinkedHashMap<>();
//        List<CoreLabel> coreLabels = coreDocument.tokens();
//
//        for (CoreLabel coreLabel : coreLabels) {
//            String pos = coreLabel.get(CoreAnnotations.PartOfSpeechAnnotation.class);
//            posTags.put(coreLabel.originalText(), pos);
//        }
//
//        return posTags;
//    }
//}