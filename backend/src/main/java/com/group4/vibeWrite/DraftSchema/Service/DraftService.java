package com.group4.vibeWrite.DraftSchema.Service;

import com.group4.vibeWrite.DraftSchema.Entity.Draft;
import com.group4.vibeWrite.DraftSchema.Exception.InvalidDraftException;
import com.group4.vibeWrite.DraftSchema.Repository.DraftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DraftService {

    private final DraftRepository draftRepository;

    public Draft createDraft(Draft draft) {
        if (draft.getContent() == null || draft.getContent().isBlank()) {
            throw new InvalidDraftException("Draft content cannot be empty");
        }
        if (draft.getUsername() == null || draft.getUsername().isBlank()) {
            throw new InvalidDraftException("Username cannot be empty");
        }
        draft.setTimestamp(LocalDateTime.now());
        return draftRepository.save(draft);
    }
}
