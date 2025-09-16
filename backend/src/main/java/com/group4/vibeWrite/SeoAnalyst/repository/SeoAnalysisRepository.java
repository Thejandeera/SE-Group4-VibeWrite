package com.group4.vibeWrite.SeoAnalyst.repository;


import com.group4.vibeWrite.SeoAnalyst.model.SeoAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeoAnalysisRepository extends MongoRepository<SeoAnalysis, String> {
}