package com.aiwritingapp.draft_schema_backend.Exception;

public class InvalidDraftException extends RuntimeException {
    public InvalidDraftException(String message) {
        super(message);
    }
}
