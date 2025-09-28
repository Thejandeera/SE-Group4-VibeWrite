//package com.group4.vibeWrite.SemanticAnalysis.service;
//
//// REMOVED: import com.group4.vibeWrite.SemanticAnalysis.util.Pipeline;
//import edu.stanford.nlp.pipeline.CoreDocument;
//import edu.stanford.nlp.pipeline.CoreSentence;
//import edu.stanford.nlp.pipeline.StanfordCoreNLP;
//import org.springframework.stereotype.Service;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class SentimentAnalysisService {
//
//    private final StanfordCoreNLP stanfordCoreNLP;
//
//    public SentimentAnalysisService(StanfordCoreNLP stanfordCoreNLP) {
//        this.stanfordCoreNLP = stanfordCoreNLP;
//    }
//
//    public Map<String, String> analyzeSentiment(String text) {
//
//        Map<String, String> results = new HashMap<>();
//        CoreDocument coreDocument = new CoreDocument(text);
//
//        stanfordCoreNLP.annotate(coreDocument);
//
//        List<CoreSentence> sentences = coreDocument.sentences();
//        for (CoreSentence sentence : sentences) {
//            String sentiment = sentence.sentiment();
//            results.put(sentence.toString(), sentiment);
//        }
//
//        return results;
//    }
//}