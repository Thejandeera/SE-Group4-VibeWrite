package com.aiwritingapp.draft_schema_backend.Controller;

import com.aiwritingapp.draft_schema_backend.Entity.Draft;
import com.aiwritingapp.draft_schema_backend.Service.DraftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drafts")
@RequiredArgsConstructor
public class DraftController {

    private final DraftService draftService;

    @PostMapping
    public ResponseEntity<Draft> createDraft(@Valid @RequestBody Draft draft) {
        Draft saved = draftService.createDraft(draft);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
