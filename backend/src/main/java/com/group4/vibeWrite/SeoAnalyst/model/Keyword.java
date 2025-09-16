package com.group4.vibeWrite.SeoAnalyst.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Keyword {
    private String term;
    private double score;

    public Keyword(String term, double score) {
        this.term = term;
        this.score = score;
    }
}