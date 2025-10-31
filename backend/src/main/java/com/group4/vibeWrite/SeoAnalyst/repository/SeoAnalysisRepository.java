package com.group4.vibeWrite.SeoAnalyst.repository;

import com.group4.vibeWrite.SeoAnalyst.model.SeoAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeoAnalysisRepository extends MongoRepository<SeoAnalysis, String> {
    // Find all analyses by userId
    List<SeoAnalysis> findByUserId(String userId);
}