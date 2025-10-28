package com.group4.vibeWrite.TextEnhancer.Repository;



import com.group4.vibeWrite.TextEnhancer.Entity.TextEnhancement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TextEnhancementRepository extends MongoRepository<TextEnhancement, String> {

    List<TextEnhancement> findByUserIdOrderByTimestampDesc(String userId);

    List<TextEnhancement> findAllByOrderByTimestampDesc();
}
