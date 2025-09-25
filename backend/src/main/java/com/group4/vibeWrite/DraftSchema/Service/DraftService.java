package com.group4.vibeWrite.DraftSchema.Service;

import com.group4.vibeWrite.DraftSchema.Entity.Draft;
import com.group4.vibeWrite.DraftSchema.Exception.InvalidDraftException;
import com.group4.vibeWrite.DraftSchema.Repository.DraftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DraftService {

    private final DraftRepository draftRepository;

    public Draft createDraft(Draft draft) {
        if (draft.getContent() == null || draft.getContent().isBlank()) {
            throw new InvalidDraftException("Draft content cannot be empty");
        }
        if (draft.getUserId() == null || draft.getUserId().isBlank()) {
            throw new InvalidDraftException("User ID cannot be empty");
        }
        draft.setTimestamp(LocalDateTime.now());
        return draftRepository.save(draft);
    }

    // Corrected method to get a single draft by its ID
    public Optional<Draft> getDraftById(String id) {
        return draftRepository.findById(id);
    }

    public List<Draft> getDraftsByUserId(String userId) {
        return draftRepository.findByUserId(userId);
    }
}
