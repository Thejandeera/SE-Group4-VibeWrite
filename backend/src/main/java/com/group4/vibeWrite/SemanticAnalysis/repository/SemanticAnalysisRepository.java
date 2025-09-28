package com.group4.vibeWrite.SemanticAnalysis.repository;

import com.group4.vibeWrite.SemanticAnalysis.entity.SemanticAnalysisHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SemanticAnalysisRepository extends MongoRepository<SemanticAnalysisHistory, String> {

    List<SemanticAnalysisHistory> findByUserIdOrderByAnalyzedAtDesc(String userId);
    Page<SemanticAnalysisHistory> findByUserIdOrderByAnalyzedAtDesc(String userId, Pageable pageable);
    List<SemanticAnalysisHistory> findByUserIdAndAnalyzedAtBetweenOrderByAnalyzedAtDesc(
            String userId, LocalDateTime startDate, LocalDateTime endDate);
    List<SemanticAnalysisHistory> findByUserIdAndComplexityScoreGreaterThanEqualOrderByAnalyzedAtDesc(
            String userId, int minScore);
    long countByUserId(String userId);

    @Query("{ 'userId': ?0 }")
    List<SemanticAnalysisHistory> findByUserIdForAverageCalculation(String userId);

    @Query("{ 'userId': ?0, 'analyzedAt': { $gte: ?1 } }")
    List<SemanticAnalysisHistory> findRecentAnalysesByUserId(String userId, LocalDateTime thirtyDaysAgo);

    void deleteByAnalyzedAtBefore(LocalDateTime cutoffDate);
    List<SemanticAnalysisHistory> findTop10ByUserIdOrderByComplexityScoreDescAnalyzedAtDesc(String userId);
}

