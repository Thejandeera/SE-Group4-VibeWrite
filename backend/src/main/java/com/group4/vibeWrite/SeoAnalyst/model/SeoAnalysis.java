
package com.group4.vibeWrite.SeoAnalyst.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Setter
@Getter
@Document(collection = "SeoAnalysis")
public class SeoAnalysis {

    @Id
    private String documentId;
    private String content; // Add this field
    private double score;
    private List<Keyword> keywords; // Change the type here
    private String metaDescription;
    private List<String> recommendations;

}