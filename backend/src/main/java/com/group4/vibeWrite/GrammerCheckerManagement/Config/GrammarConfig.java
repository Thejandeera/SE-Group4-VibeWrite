package com.group4.vibeWrite.GrammerCheckerManagement.Config;

import org.languagetool.JLanguageTool;
import org.languagetool.language.AmericanEnglish;
import org.languagetool.rules.CategoryId;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching // <-- Turns on the caching feature for the whole application
public class GrammarConfig {

    @Bean
    public JLanguageTool languageTool() {
        JLanguageTool languageTool = new JLanguageTool(new AmericanEnglish());

        // Enable the specific rule categories we care about
        languageTool.enableRuleCategory(new CategoryId("GRAMMAR"));
        languageTool.enableRuleCategory(new CategoryId("PUNCTUATION"));
        languageTool.enableRuleCategory(new CategoryId("TYPOGRAPHY"));
        languageTool.enableRuleCategory(new CategoryId("STYLE"));

        return languageTool;
    }
}