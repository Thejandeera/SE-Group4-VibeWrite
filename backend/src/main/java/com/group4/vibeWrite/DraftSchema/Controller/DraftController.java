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
    @GetMapping("/by-username/{username}")
    public ResponseEntity<List<Draft>> getDraftsByUsername(@PathVariable String username) {
        List<Draft> drafts = draftService.getDraftsByUsername(username);
        return new ResponseEntity<>(drafts, HttpStatus.OK);
    }
}
