package com.group4.vibeWrite.DraftSchema.Repository;

import com.group4.vibeWrite.DraftSchema.Entity.Draft;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DraftRepository extends MongoRepository<Draft, String> {
    List<Draft> findByUsername(String username);
}
