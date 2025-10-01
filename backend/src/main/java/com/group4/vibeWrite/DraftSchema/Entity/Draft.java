package com.group4.vibeWrite.DraftSchema.Entity;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Document(collection = "drafts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Draft {

    @Id
    private String id;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    @NotBlank(message = "User ID cannot be blank")
    private String userId;

    @CreatedDate
    private LocalDateTime timestamp;

    @LastModifiedDate
    private LocalDateTime updatedTimestamp;

}
