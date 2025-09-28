//package com.group4.vibeWrite.SemanticAnalysis.service;
//
//// Removed: import com.group4.vibeWrite.SemanticAnalysis.util.Pipeline; <-- No longer needed
//
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
//public class LemmaService {
//
//    private final StanfordCoreNLP stanfordCoreNLP;
//
//    public LemmaService(StanfordCoreNLP stanfordCoreNLP) {
//        this.stanfordCoreNLP = stanfordCoreNLP;
//    }
//
//    public Map<String, String> lemmatizeText(String text) {
//
//        CoreDocument coreDocument = new CoreDocument(text);
//
//        // Use the injected pipeline instance
//        stanfordCoreNLP.annotate(coreDocument);
//
//        Map<String, String> lemmaResults = new LinkedHashMap<>();
//        List<CoreLabel> coreLabelList = coreDocument.tokens();
//
//        for (CoreLabel coreLabel : coreLabelList) {
//            String lemma = coreLabel.lemma();
//            lemmaResults.put(coreLabel.originalText(), lemma);
//        }
//
//        return lemmaResults;
//    }
//}