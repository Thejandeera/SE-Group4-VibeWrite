package com.group4.vibeWrite.Config;



import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class GrammarServiceConfig {

    @Bean
    @ConfigurationProperties(prefix = "vibewrite.grammar")
    public GrammarSettings grammarSettings() {
        return new GrammarSettings();
    }

    @Bean(name = "grammarTaskExecutor")
    public Executor grammarTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("grammar-");
        executor.initialize();
        return executor;
    }

    public static class GrammarSettings {
        private int maxTextLength = 10000;
        private int maxErrorsReturned = 50;
        private boolean enableAdvancedChecking = true;
        private boolean enableStyleChecking = true;
        private boolean saveHistory = true;
        private int historyRetentionDays = 90;

        // Getters and setters
        public int getMaxTextLength() { return maxTextLength; }
        public void setMaxTextLength(int maxTextLength) { this.maxTextLength = maxTextLength; }

        public int getMaxErrorsReturned() { return maxErrorsReturned; }
        public void setMaxErrorsReturned(int maxErrorsReturned) { this.maxErrorsReturned = maxErrorsReturned; }

        public boolean isEnableAdvancedChecking() { return enableAdvancedChecking; }
        public void setEnableAdvancedChecking(boolean enableAdvancedChecking) { this.enableAdvancedChecking = enableAdvancedChecking; }

        public boolean isEnableStyleChecking() { return enableStyleChecking; }
        public void setEnableStyleChecking(boolean enableStyleChecking) { this.enableStyleChecking = enableStyleChecking; }

        public boolean isSaveHistory() { return saveHistory; }
        public void setSaveHistory(boolean saveHistory) { this.saveHistory = saveHistory; }

        public int getHistoryRetentionDays() { return historyRetentionDays; }
        public void setHistoryRetentionDays(int historyRetentionDays) { this.historyRetentionDays = historyRetentionDays; }
    }
}