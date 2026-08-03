/**
 * ATHENA Smart Dictionary - WordNormalizer
 * Normalizes input tokens and phrases by handling punctuation, capitalization,
 * plural forms, verb tenses, contractions, and possessives to resolve root lemmas.
 */

export interface NormalizationResult {
  raw: string;
  cleaned: string;
  lemma: string;
  posCandidate?: string;
  candidates: string[]; // Priority list of lookup terms
}

export class WordNormalizer {
  // Irregular noun plurals
  private static IRREGULAR_PLURALS: Record<string, string> = {
    children: 'child',
    men: 'man',
    women: 'woman',
    feet: 'foot',
    teeth: 'tooth',
    mice: 'mouse',
    geese: 'goose',
    oxen: 'ox',
    people: 'person',
    lives: 'life',
    knives: 'knife',
    wives: 'wife',
    leaves: 'leaf',
    loaves: 'loaf',
    halves: 'half',
    calves: 'calf',
    thieves: 'thief',
    crises: 'crisis',
    analyses: 'analysis',
    hypotheses: 'hypothesis',
    data: 'datum',
    media: 'medium',
    criteria: 'criterion',
    phenomena: 'phenomenon',
    indices: 'index',
    matrices: 'matrix',
    fungi: 'fungus',
    nuclei: 'nucleus',
    cacti: 'cactus',
  };

  // Irregular verb forms (past & past participle -> base)
  private static IRREGULAR_VERBS: Record<string, { base: string; pos?: string }> = {
    running: { base: 'run' },
    ran: { base: 'run' },
    swimming: { base: 'swim' },
    swam: { base: 'swim' },
    swum: { base: 'swim' },
    was: { base: 'be' },
    were: { base: 'be' },
    been: { base: 'be' },
    is: { base: 'be' },
    are: { base: 'be' },
    am: { base: 'be' },
    has: { base: 'have' },
    had: { base: 'have' },
    does: { base: 'do' },
    did: { base: 'do' },
    done: { base: 'do' },
    went: { base: 'go' },
    gone: { base: 'go' },
    goes: { base: 'go' },
    going: { base: 'go' },
    written: { base: 'write' },
    wrote: { base: 'write' },
    writing: { base: 'write' },
    eaten: { base: 'eat' },
    ate: { base: 'eat' },
    eating: { base: 'eat' },
    bought: { base: 'buy' },
    buying: { base: 'buy' },
    thought: { base: 'think' },
    thinking: { base: 'think' },
    caught: { base: 'catch' },
    catching: { base: 'catch' },
    taught: { base: 'teach' },
    teaching: { base: 'teach' },
    spoken: { base: 'speak' },
    spoke: { base: 'speak' },
    speaking: { base: 'speak' },
    broken: { base: 'break' },
    broke: { base: 'break' },
    breaking: { base: 'break' },
    chosen: { base: 'choose' },
    chose: { base: 'choose' },
    choosing: { base: 'choose' },
    driven: { base: 'drive' },
    drove: { base: 'drive' },
    driving: { base: 'drive' },
    given: { base: 'give' },
    gave: { base: 'give' },
    giving: { base: 'give' },
    taken: { base: 'take' },
    took: { base: 'take' },
    taking: { base: 'take' },
    seen: { base: 'see' },
    saw: { base: 'see' },
    seeing: { base: 'see' },
    known: { base: 'know' },
    knew: { base: 'know' },
    knowing: { base: 'know' },
    growing: { base: 'grow' },
    grew: { base: 'grow' },
    grown: { base: 'grow' },
    studying: { base: 'study' },
    studied: { base: 'study' },
    studies: { base: 'study' },
    carrying: { base: 'carry' },
    carried: { base: 'carry' },
    carries: { base: 'carry' },
    trying: { base: 'try' },
    tried: { base: 'try' },
    tries: { base: 'try' },
    making: { base: 'make' },
    made: { base: 'make' },
    makes: { base: 'make' },
    coming: { base: 'come' },
    came: { base: 'come' },
    comes: { base: 'come' },
    having: { base: 'have' },
    getting: { base: 'get' },
    got: { base: 'get' },
    gotten: { base: 'get' },
    putting: { base: 'put' },
    setting: { base: 'set' },
    cutting: { base: 'cut' },
    letting: { base: 'let' },
  };

  // Contraction contractions map
  private static CONTRACTIONS: Record<string, string> = {
    "don't": 'do',
    "doesn't": 'does',
    "didn't": 'did',
    "won't": 'will',
    "wouldn't": 'would',
    "can't": 'can',
    "cannot": 'can',
    "couldn't": 'could',
    "shouldn't": 'should',
    "isn't": 'be',
    "aren't": 'be',
    "wasn't": 'be',
    "weren't": 'be',
    "haven't": 'have',
    "hasn't": 'have',
    "hadn't": 'have',
    "i'm": 'i',
    "you're": 'you',
    "he's": 'he',
    "she's": 'she',
    "it's": 'it',
    "we're": 'we',
    "they're": 'they',
    "i've": 'i',
    "you've": 'you',
    "we've": 'we',
    "they've": 'they',
    "i'll": 'i',
    "you'll": 'you',
    "he'll": 'he',
    "she'll": 'she',
    "we'll": 'we',
    "they'll": 'they',
    "i'd": 'i',
    "you'd": 'you',
    "he'd": 'he',
    "she'd": 'she',
    "we'd": 'we',
    "they'd": 'they',
  };

  /**
   * Main normalization function.
   * Input: "running,", "Children's", "would've", "cities"
   * Output: Normalized root candidate lemma & candidates list.
   */
  public normalize(raw: string): NormalizationResult {
    if (!raw || typeof raw !== 'string') {
      return { raw: '', cleaned: '', lemma: '', candidates: [] };
    }

    const trimmed = raw.trim();

    // 1. Strip punctuation & special characters from edges, except inner apostrophes/hyphens
    let cleaned = trimmed
      .replace(/^[^\w']+/u, '') // remove leading punctuation
      .replace(/[^\w']+$ /u, '') // remove trailing punctuation
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, '') // strip surrounding symbols
      .toLowerCase();

    if (!cleaned) {
      cleaned = trimmed.toLowerCase();
    }

    // 2. Handle possessives & trailing 's (e.g., "children's" -> "children", "cat's" -> "cat")
    let dePossessive = cleaned;
    if (dePossessive.endsWith("'s") || dePossessive.endsWith("’s")) {
      dePossessive = dePossessive.slice(0, -2);
    } else if (dePossessive.endsWith("s'") || dePossessive.endsWith("s’")) {
      dePossessive = dePossessive.slice(0, -1);
    }

    // 3. Handle contractions
    if (WordNormalizer.CONTRACTIONS[dePossessive]) {
      const contractionBase = WordNormalizer.CONTRACTIONS[dePossessive];
      return {
        raw,
        cleaned,
        lemma: contractionBase,
        candidates: [contractionBase, dePossessive, cleaned, trimmed.toLowerCase()],
      };
    }

    // 4. Check irregular plurals
    if (WordNormalizer.IRREGULAR_PLURALS[dePossessive]) {
      const irrLemma = WordNormalizer.IRREGULAR_PLURALS[dePossessive];
      return {
        raw,
        cleaned,
        lemma: irrLemma,
        candidates: [irrLemma, dePossessive, cleaned, trimmed.toLowerCase()],
      };
    }

    // 5. Check irregular verbs
    if (WordNormalizer.IRREGULAR_VERBS[dePossessive]) {
      const irrVerb = WordNormalizer.IRREGULAR_VERBS[dePossessive].base;
      return {
        raw,
        cleaned,
        lemma: irrVerb,
        candidates: [irrVerb, dePossessive, cleaned, trimmed.toLowerCase()],
      };
    }

    // 6. Algorithmic Lemmatization Rules (Morphological Stemming)
    const candidatesSet = new Set<string>();
    candidatesSet.add(dePossessive);
    candidatesSet.add(cleaned);
    candidatesSet.add(trimmed.toLowerCase());

    let stem = dePossessive;

    // Rule A: -ies -> -y (e.g., "cities" -> "city", "studies" -> "study")
    if (dePossessive.length > 4 && dePossessive.endsWith('ies')) {
      const candidateY = dePossessive.slice(0, -3) + 'y';
      candidatesSet.add(candidateY);
      stem = candidateY;
    }
    // Rule B: -ves -> -f or -fe (e.g., "knives" -> "knife", "wolves" -> "wolf")
    else if (dePossessive.length > 4 && dePossessive.endsWith('ves')) {
      candidatesSet.add(dePossessive.slice(0, -3) + 'f');
      candidatesSet.add(dePossessive.slice(0, -3) + 'fe');
    }
    // Rule C: -es for sibilants (e.g., "boxes" -> "box", "buses" -> "bus", "churches" -> "church")
    else if (dePossessive.length > 3 && (dePossessive.endsWith('es') || dePossessive.endsWith('s'))) {
      if (dePossessive.endsWith('es')) {
        const withoutEs = dePossessive.slice(0, -2);
        candidatesSet.add(withoutEs);
      }
      if (dePossessive.endsWith('s')) {
        const withoutS = dePossessive.slice(0, -1);
        candidatesSet.add(withoutS);
      }
    }

    // Rule D: Verb endings (-ing, -ed)
    // -ing (e.g., "running" -> "run" [double consonant], "making" -> "make" [drop e], "playing" -> "play")
    if (dePossessive.length > 4 && dePossessive.endsWith('ing')) {
      const baseIng = dePossessive.slice(0, -3);
      candidatesSet.add(baseIng);
      candidatesSet.add(baseIng + 'e'); // e.g. "making" -> "make"

      // Handle double consonants: "running" -> "run", "swimming" -> "swim"
      if (baseIng.length > 2 && baseIng[baseIng.length - 1] === baseIng[baseIng.length - 2]) {
        candidatesSet.add(baseIng.slice(0, -1));
      }
    }

    // -ed (e.g., "worked" -> "work", "studied" -> "study", "created" -> "create", "stopped" -> "stop")
    if (dePossessive.length > 3 && dePossessive.endsWith('ed')) {
      const baseEd = dePossessive.slice(0, -2);
      candidatesSet.add(baseEd);
      candidatesSet.add(baseEd + 'd');
      candidatesSet.add(dePossessive.slice(0, -1)); // just drop d if ended in e

      if (baseEd.length > 2 && baseEd[baseEd.length - 1] === baseEd[baseEd.length - 2]) {
        candidatesSet.add(baseEd.slice(0, -1)); // "stopped" -> "stop"
      }
    }

    const candidates = Array.from(candidatesSet);
    const primaryLemma = candidates.length > 1 ? candidates[1] : candidates[0];

    return {
      raw,
      cleaned,
      lemma: primaryLemma,
      candidates,
    };
  }
}
