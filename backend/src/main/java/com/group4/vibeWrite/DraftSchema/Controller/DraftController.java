package com.group4.vibeWrite.DraftSchema.Controller;

import com.group4.vibeWrite.DraftSchema.Entity.Draft;
import com.group4.vibeWrite.DraftSchema.Service.DraftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/{id}")
    public ResponseEntity<Draft> getDraftById(@PathVariable String id) {
        return draftService.getDraftById(id)
                .map(draft -> new ResponseEntity<>(draft, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<Draft>> getDraftsByUserId(@PathVariable String userId) {
        List<Draft> drafts = draftService.getDraftsByUserId(userId);
        return new ResponseEntity<>(drafts, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDraft(@PathVariable String id) {
        boolean deleted = draftService.deleteDraft(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
