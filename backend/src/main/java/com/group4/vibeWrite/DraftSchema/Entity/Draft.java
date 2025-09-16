package com.group4.vibeWrite.DraftSchema.Entity;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "drafts")
public class Draft {

    @Id
    private String id;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    @NotBlank(message = "Username cannot be blank")
    private String username;

    @CreatedDate
    private LocalDateTime timestamp;

    public Draft() {}

    public Draft(String content, String username) {
        this.content = content;
        this.username = username;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
