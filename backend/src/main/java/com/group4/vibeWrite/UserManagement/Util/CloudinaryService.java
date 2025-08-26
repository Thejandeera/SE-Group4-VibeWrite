package com.group4.vibeWrite.UserManagement.Util;



import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadBase64Image(String base64Image, String folder) {
        try {
            // Remove data:image/jpeg;base64, or similar prefix if present
            String base64Data = base64Image;
            if (base64Image.contains(",")) {
                base64Data = base64Image.split(",")[1];
            }

            // Generate unique public ID
            String publicId = folder + "/" + UUID.randomUUID().toString();

            // Upload to Cloudinary
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    "data:image/jpeg;base64," + base64Data,
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", folder,
                            "resource_type", "image",
                            "transformation", ObjectUtils.asMap(
                                    "width", 400,
                                    "height", 400,
                                    "crop", "limit",
                                    "quality", "auto:good",
                                    "format", "auto"
                            )
                    )
            );

            String imageUrl = (String) uploadResult.get("secure_url");
            log.info("Successfully uploaded image to Cloudinary: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary", e);
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    public void deleteImage(String imageUrl) {
        try {
            // Extract public ID from URL
            String publicId = extractPublicIdFromUrl(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Successfully deleted image from Cloudinary: {}", publicId);
            }
        } catch (IOException e) {
            log.error("Failed to delete image from Cloudinary: {}", imageUrl, e);
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            // Extract public ID from Cloudinary URL
            // Example URL: https://res.cloudinary.com/dufjnce0g/image/upload/v1234567890/profile_pictures/uuid.jpg
            String[] parts = imageUrl.split("/");
            if (parts.length >= 7) {
                String versionAndPath = String.join("/", java.util.Arrays.copyOfRange(parts, 7, parts.length));
                // Remove file extension
                return versionAndPath.substring(0, versionAndPath.lastIndexOf("."));
            }
        } catch (Exception e) {
            log.error("Failed to extract public ID from URL: {}", imageUrl, e);
        }
        return null;
    }
}