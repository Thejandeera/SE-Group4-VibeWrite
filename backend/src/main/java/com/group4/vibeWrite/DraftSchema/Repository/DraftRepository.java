package com.group4.vibeWrite.DraftSchema.Repository;

import com.group4.vibeWrite.DraftSchema.Entity.Draft;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DraftRepository extends MongoRepository<Draft, String> {
}
