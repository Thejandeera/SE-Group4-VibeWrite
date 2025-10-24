package com.group4.vibeWrite.GrammerCheckerManagement.Repository;


import com.group4.vibeWrite.GrammerCheckerManagement.Entity.GrammarCheckHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GrammarCheckRepository extends MongoRepository<GrammarCheckHistory, String> {

    // Find all grammar checks by user ID
    List<GrammarCheckHistory> findByUserIdOrderByCheckedAtDesc(String userId);

    // Find grammar checks by user ID with pagination
    Page<GrammarCheckHistory> findByUserIdOrderByCheckedAtDesc(String userId, Pageable pageable);

    // Find grammar checks within a date range for a user
    List<GrammarCheckHistory> findByUserIdAndCheckedAtBetweenOrderByCheckedAtDesc(
            String userId, LocalDateTime startDate, LocalDateTime endDate);

    // Find grammar checks with score above a threshold
    List<GrammarCheckHistory> findByUserIdAndGrammarScoreGreaterThanEqualOrderByCheckedAtDesc(
            String userId, int minScore);

    // Find grammar checks with score below a threshold
    List<GrammarCheckHistory> findByUserIdAndGrammarScoreLessThanOrderByCheckedAtDesc(
            String userId, int maxScore);

    // Count total checks by user
    long countByUserId(String userId);

    // Get average grammar score for a user
    @Query("{ 'userId': ?0 }")
    List<GrammarCheckHistory> findByUserIdForAverageCalculation(String userId);

    // Find recent grammar checks (last 30 days)
    @Query("{ 'userId': ?0, 'checkedAt': { $gte: ?1 } }")
    List<GrammarCheckHistory> findRecentChecksByUserId(String userId, LocalDateTime thirtyDaysAgo);

    // Find grammar checks by error count
    List<GrammarCheckHistory> findByUserIdAndTotalErrorsGreaterThanOrderByCheckedAtDesc(
            String userId, int minErrors);

    // Delete old grammar check history (older than specified date)
    void deleteByCheckedAtBefore(LocalDateTime cutoffDate);

    // Find top grammar checks by score for a user
    List<GrammarCheckHistory> findTop10ByUserIdOrderByGrammarScoreDescCheckedAtDesc(String userId);
}
