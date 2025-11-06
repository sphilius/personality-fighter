/**
 * PersonalityScorer - Maps HEXACO personality scores to ability classes
 * Based on 6 assessment scenarios with HEXACO model
 */

export default class PersonalityScorer {
  static calculateFinalClass(scores) {
    // Normalize scores from -12 to +12 range to 0-100 scale
    const normalized = this.normalizeScores(scores);

    // Determine primary ability class
    const abilityClass = this.mapToAbilityClass(normalized);

    // Calculate confidence in assignment
    const confidence = this.calculateConfidence(normalized);

    return {
      hexaco: normalized,
      abilityClass: abilityClass,
      confidence: confidence,
      rawScores: scores,
    };
  }

  static normalizeScores(scores) {
    const normalized = {};

    for (const [key, value] of Object.entries(scores)) {
      // Scores range from -12 to +12 (6 scenarios * ±2 max per dimension)
      // Normalize to 0-100 where 50 is neutral
      normalized[key] = 50 + (value * 4.17); // 50/12 = 4.17
      normalized[key] = Math.max(0, Math.min(100, normalized[key]));
    }

    return normalized;
  }

  static mapToAbilityClass(hexaco) {
    // Decision tree based on HEXACO scores
    // Priority: Check strongest personality markers first

    // Paladin: High Honesty-Humility + High Emotionality (protective, compassionate)
    if (hexaco.H > 60 && hexaco.E > 60) {
      return 'Paladin';
    }

    // Shadow Dancer: Low Honesty-Humility + High Openness (cunning, creative)
    if (hexaco.H < 40 && hexaco.O > 60) {
      return 'Shadow Dancer';
    }

    // Tactician: High Conscientiousness + Low Emotionality (logical, strategic)
    if (hexaco.C > 60 && hexaco.E < 40) {
      return 'Tactician';
    }

    // Berserker: Low Agreeableness + High eXtraversion (aggressive, dominant)
    if (hexaco.A < 40 && hexaco.X > 60) {
      return 'Berserker';
    }

    // Elementalist: High Openness + High Conscientiousness (mastery, control)
    if (hexaco.O > 60 && hexaco.C > 60) {
      return 'Elementalist';
    }

    // Warden: High Agreeableness + High Emotionality (nurturing, protective)
    if (hexaco.A > 60 && hexaco.E > 60) {
      return 'Warden';
    }

    // Trickster: Low Honesty-Humility + High eXtraversion (mischievous, bold)
    if (hexaco.H < 40 && hexaco.X > 60) {
      return 'Trickster';
    }

    // Shapeshifter: High Openness + Low Conscientiousness (fluid, adaptive)
    if (hexaco.O > 60 && hexaco.C < 40) {
      return 'Shapeshifter';
    }

    // Default: Find closest match if no clear winner
    return this.findClosestMatch(hexaco);
  }

  static findClosestMatch(hexaco) {
    // Archetype profiles for each class
    const archetypes = {
      Paladin: { H: 70, E: 70, X: 50, A: 60, C: 50, O: 50 },
      'Shadow Dancer': { H: 30, E: 50, X: 60, A: 50, C: 50, O: 70 },
      Tactician: { H: 60, E: 30, X: 40, A: 50, C: 70, O: 60 },
      Berserker: { H: 40, E: 30, X: 70, A: 30, C: 40, O: 50 },
      Elementalist: { H: 50, E: 40, X: 50, A: 50, C: 70, O: 70 },
      Warden: { H: 60, E: 60, X: 50, A: 70, C: 60, O: 50 },
      Trickster: { H: 30, E: 40, X: 70, A: 40, C: 50, O: 60 },
      Shapeshifter: { H: 50, E: 50, X: 60, A: 50, C: 30, O: 70 },
    };

    let closestClass = 'Warden'; // Default balanced class
    let minDistance = Infinity;

    for (const [className, archetype] of Object.entries(archetypes)) {
      const distance = this.calculateDistance(hexaco, archetype);
      if (distance < minDistance) {
        minDistance = distance;
        closestClass = className;
      }
    }

    return closestClass;
  }

  static calculateDistance(scores1, scores2) {
    // Euclidean distance in 6D HEXACO space
    let sum = 0;
    for (const key of ['H', 'E', 'X', 'A', 'C', 'O']) {
      const diff = scores1[key] - scores2[key];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  static calculateConfidence(hexaco) {
    // Higher variance in scores = stronger personality markers = higher confidence
    const values = Object.values(hexaco);
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;

    // Normalize to 0-100 scale
    const confidence = Math.min(100, variance * 0.5);

    return Math.round(confidence);
  }

  static getClassDescription(className) {
    const descriptions = {
      Paladin: {
        title: 'The Paladin',
        subtitle: 'Shield of the Innocent',
        description: 'You stand between the weak and the darkness. Your shield protects. Your light guides. The arena honors your compassion.',
        traits: ['Protective', 'Compassionate', 'Noble'],
        playstyle: 'Defensive tank with counterattacks and protective abilities.',
      },
      'Shadow Dancer': {
        title: 'The Shadow Dancer',
        subtitle: 'Walker of Hidden Paths',
        description: 'You move between moments, unseen until you strike. Your path is yours alone. The arena respects your freedom.',
        traits: ['Cunning', 'Agile', 'Independent'],
        playstyle: 'High-mobility assassin with stealth and critical strikes.',
      },
      Tactician: {
        title: 'The Tactician',
        subtitle: 'Master of Strategy',
        description: 'You see the patterns others miss. Your mind is your weapon. The arena acknowledges your wisdom.',
        traits: ['Analytical', 'Strategic', 'Precise'],
        playstyle: 'Strategic fighter with zone control and calculated attacks.',
      },
      Berserker: {
        title: 'The Berserker',
        subtitle: 'Fury Unleashed',
        description: 'You break what stands before you. Your will cannot be denied. The arena feels your power.',
        traits: ['Aggressive', 'Fearless', 'Relentless'],
        playstyle: 'Glass cannon with devastating damage and life-steal.',
      },
      Elementalist: {
        title: 'The Elementalist',
        subtitle: 'Wielder of Primal Forces',
        description: 'You command the primal forces. Your mastery shapes reality. The arena marvels at your control.',
        traits: ['Masterful', 'Versatile', 'Powerful'],
        playstyle: 'Ranged specialist with elemental attacks and area control.',
      },
      Warden: {
        title: 'The Warden',
        subtitle: 'Keeper of Balance',
        description: 'You tend the balance, you mend what breaks. Your presence brings peace. The arena trusts your care.',
        traits: ['Nurturing', 'Balanced', 'Supportive'],
        playstyle: 'Balanced fighter with healing and debuff abilities.',
      },
      Trickster: {
        title: 'The Trickster',
        subtitle: 'Breaker of Rules',
        description: 'You bend rules and expectations. Your cleverness confounds. The arena enjoys your games.',
        traits: ['Mischievous', 'Unpredictable', 'Clever'],
        playstyle: 'Deceptive fighter with illusions and misdirection.',
      },
      Shapeshifter: {
        title: 'The Shapeshifter',
        subtitle: 'Master of Change',
        description: 'You are not one thing but many. Your nature defies constraint. The arena celebrates your fluidity.',
        traits: ['Adaptive', 'Fluid', 'Versatile'],
        playstyle: 'Transforming fighter with multiple forms and abilities.',
      },
    };

    return descriptions[className] || descriptions.Warden;
  }

  static getClassColors(className) {
    const colors = {
      Paladin: { primary: 0xFFD700, secondary: 0xFFFFFF },
      'Shadow Dancer': { primary: 0xAA44FF, secondary: 0x220033 },
      Tactician: { primary: 0x4466FF, secondary: 0x88AAFF },
      Berserker: { primary: 0xFF2222, secondary: 0x880000 },
      Elementalist: { primary: 0x44AAFF, secondary: 0xFF8844 },
      Warden: { primary: 0x44AA44, secondary: 0x88FF88 },
      Trickster: { primary: 0xFF4488, secondary: 0x8844FF },
      Shapeshifter: { primary: 0x88AAFF, secondary: 0xAA88FF },
    };

    return colors[className] || colors.Warden;
  }
}
