package com.aiwritingapp.draft_schema_backend.Repository;

import com.aiwritingapp.draft_schema_backend.Entity.Draft;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DraftRepository extends MongoRepository<Draft, String> {
}
