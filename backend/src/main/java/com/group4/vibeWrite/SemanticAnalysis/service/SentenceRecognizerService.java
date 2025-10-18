//package com.group4.vibeWrite.SemanticAnalysis.service;
//
//// REMOVED: import com.group4.vibeWrite.SemanticAnalysis.util.Pipeline;
//import edu.stanford.nlp.pipeline.CoreDocument;
//import edu.stanford.nlp.pipeline.CoreSentence;
//import edu.stanford.nlp.pipeline.StanfordCoreNLP;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class SentenceRecognizerService {
//
//    private final StanfordCoreNLP stanfordCoreNLP;
//
//    public SentenceRecognizerService(StanfordCoreNLP stanfordCoreNLP) {
//        this.stanfordCoreNLP = stanfordCoreNLP;
//    }
//
//    public List<String> recognizeSentences(String text) {
//
//        CoreDocument coreDocument = new CoreDocument(text);
//        stanfordCoreNLP.annotate(coreDocument);
//
//        List<String> sentenceList = new ArrayList<>();
//        List<CoreSentence> sentences = coreDocument.sentences();
//
//        for (CoreSentence sentence : sentences) {
//            sentenceList.add(sentence.toString());
//        }
//
//        return sentenceList;
//    }
//}