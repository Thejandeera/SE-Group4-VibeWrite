package com.group4.vibeWrite.UserManagement.Repository;




import com.group4.vibeWrite.UserManagement.Entity.User;
import com.group4.vibeWrite.UserManagement.Entity.User.UserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmailAndStatus(String email, UserStatus status);

    Optional<User> findByIdAndStatus(String id, UserStatus status);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<User> findByStatus(UserStatus status);

    List<User> findByRole(User.UserRole role);
}
