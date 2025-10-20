package com.group4.vibeWrite;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:.env")
class VibeWriteApplicationTests {

	@Test
	void contextLoads() {
	}
}

