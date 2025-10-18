//package com.group4.vibeWrite.SemanticAnalysis.service;
//
//// REMOVED: import com.group4.vibeWrite.SemanticAnalysis.util.Pipeline;
//import edu.stanford.nlp.ling.CoreLabel;
//import edu.stanford.nlp.pipeline.CoreDocument;
//import edu.stanford.nlp.pipeline.StanfordCoreNLP;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class TokenizeService {
//
//    private final StanfordCoreNLP stanfordCoreNLP;
//
//    public TokenizeService(StanfordCoreNLP stanfordCoreNLP) {
//        this.stanfordCoreNLP = stanfordCoreNLP;
//    }
//
//    public List<String> tokenizeText(String text) {
//
//        CoreDocument coreDocument = new CoreDocument(text);
//        stanfordCoreNLP.annotate(coreDocument);
//
//        List<String> tokenList = new ArrayList<>();
//        List<CoreLabel> coreLabelList = coreDocument.tokens();
//
//        for (CoreLabel coreLabel : coreLabelList) {
//            tokenList.add(coreLabel.originalText());
//        }
//
//        return tokenList;
//    }
//}