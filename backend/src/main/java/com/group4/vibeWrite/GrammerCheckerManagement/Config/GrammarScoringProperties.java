package com.group4.vibeWrite.GrammerCheckerManagement.Config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "grammar.scoring")
public class GrammarScoringProperties {

    private int baseScore;
    private Deduction deduction = new Deduction();
    private Penalty penalty = new Penalty();
    private Bonus bonus = new Bonus();

    @Data
    public static class Deduction {
        private int high;
        private int medium;
        private int low;
        private int defaultValue;
    }

    @Data
    public static class Penalty {
        private double errorDensityLowThreshold;
        private double errorDensityMediumThreshold;
        private double errorDensityHighThreshold;
        private int errorDensityLowAmount;
        private int errorDensityMediumAmount;
        private int errorDensityHighAmount;
        private int readabilityThreshold;
        private int readabilityAmount;
    }

    @Data
    public static class Bonus {
        private int readabilityHighThreshold;
        private int readabilityMediumThreshold;
        private int readabilityHighAmount;
        private int readabilityMediumAmount;
    }
}