package com.group4.vibeWrite.draft_service.model;

public class ReadabilityResult {
    private double fleschKincaidScore;
    private String gradeLevel;
    private int totalWords;
    private int totalSentences;
    private int totalSyllables;
    private double averageWordsPerSentence;
    private double averageSyllablesPerWord;

    public ReadabilityResult() {}

    public ReadabilityResult(double fleschKincaidScore, String gradeLevel,
                             int totalWords, int totalSentences, int totalSyllables,
                             double averageWordsPerSentence, double averageSyllablesPerWord) {
        this.fleschKincaidScore = fleschKincaidScore;
        this.gradeLevel = gradeLevel;
        this.totalWords = totalWords;
        this.totalSentences = totalSentences;
        this.totalSyllables = totalSyllables;
        this.averageWordsPerSentence = averageWordsPerSentence;
        this.averageSyllablesPerWord = averageSyllablesPerWord;
    }

    // Getters and Setters
    public double getFleschKincaidScore() { return fleschKincaidScore; }
    public void setFleschKincaidScore(double fleschKincaidScore) { this.fleschKincaidScore = fleschKincaidScore; }

    public String getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(String gradeLevel) { this.gradeLevel = gradeLevel; }

    public int getTotalWords() { return totalWords; }
    public void setTotalWords(int totalWords) { this.totalWords = totalWords; }

    public int getTotalSentences() { return totalSentences; }
    public void setTotalSentences(int totalSentences) { this.totalSentences = totalSentences; }

    public int getTotalSyllables() { return totalSyllables; }
    public void setTotalSyllables(int totalSyllables) { this.totalSyllables = totalSyllables; }

    public double getAverageWordsPerSentence() { return averageWordsPerSentence; }
    public void setAverageWordsPerSentence(double averageWordsPerSentence) {
        this.averageWordsPerSentence = averageWordsPerSentence;
    }

    public double getAverageSyllablesPerWord() { return averageSyllablesPerWord; }
    public void setAverageSyllablesPerWord(double averageSyllablesPerWord) {
        this.averageSyllablesPerWord = averageSyllablesPerWord;
    }
}
