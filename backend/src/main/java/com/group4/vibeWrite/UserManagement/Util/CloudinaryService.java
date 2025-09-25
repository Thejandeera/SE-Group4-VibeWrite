package com.group4.vibeWrite.UserManagement.Util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // Simplified method to handle MultipartFile uploads
    public String uploadMultipartFile(MultipartFile file, String folder) {
        try {
            // Validate file
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            // Generate unique public ID
            String publicId = folder + "/" + UUID.randomUUID().toString();

            // Basic upload without transformations first
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", folder,
                            "resource_type", "image"
                    )
            );

            String imageUrl = (String) uploadResult.get("secure_url");
            log.info("Successfully uploaded file to Cloudinary: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary", e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    // Method with transformations (use this if basic upload works)
    public String uploadMultipartFileWithTransformation(MultipartFile file, String folder) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            String publicId = folder + "/" + UUID.randomUUID().toString();

            // Upload with eager transformations
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", folder,
                            "resource_type", "image",
                            "eager", ObjectUtils.asMap(
                                    "width", 400,
                                    "height", 400,
                                    "crop", "limit",
                                    "quality", "auto:good",
                                    "format", "auto"
                            )
                    )
            );

            String imageUrl = (String) uploadResult.get("secure_url");
            log.info("Successfully uploaded file with transformation to Cloudinary: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary", e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    // Keep the existing base64 method (simplified)
    public String uploadBase64Image(String base64Image, String folder) {
        try {
            String base64Data = base64Image;
            if (base64Image.contains(",")) {
                base64Data = base64Image.split(",")[1];
            }

            String publicId = folder + "/" + UUID.randomUUID().toString();

            // Basic upload without transformations
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    "data:image/jpeg;base64," + base64Data,
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", folder,
                            "resource_type", "image"
                    )
            );

            String imageUrl = (String) uploadResult.get("secure_url");
            log.info("Successfully uploaded base64 image to Cloudinary: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary", e);
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    public void deleteImage(String imageUrl) {
        try {
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
            String[] parts = imageUrl.split("/");
            if (parts.length >= 7) {
                // Find the version part (starts with 'v')
                int versionIndex = -1;
                for (int i = 0; i < parts.length; i++) {
                    if (parts[i].startsWith("v") && parts[i].length() > 1 &&
                            parts[i].substring(1).matches("\\d+")) {
                        versionIndex = i;
                        break;
                    }
                }

                if (versionIndex != -1 && versionIndex < parts.length - 1) {
                    // Get everything after the version
                    String pathAfterVersion = String.join("/",
                            java.util.Arrays.copyOfRange(parts, versionIndex + 1, parts.length));
                    // Remove file extension
                    int lastDotIndex = pathAfterVersion.lastIndexOf(".");
                    if (lastDotIndex != -1) {
                        return pathAfterVersion.substring(0, lastDotIndex);
                    }
                    return pathAfterVersion;
                }
            }
        } catch (Exception e) {
            log.error("Failed to extract public ID from URL: {}", imageUrl, e);
        }
        return null;
    }
}