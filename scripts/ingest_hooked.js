import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_ROOT = path.join(__dirname, "..");

const HOOKED_DIR = path.join(MCP_ROOT, "knowledge", "behavioral", "hooked");
const CHAPTERS_DIR = path.join(HOOKED_DIR, "chapters");
const CONCEPTS_DIR = path.join(HOOKED_DIR, "concepts");
const MECHANISMS_DIR = path.join(HOOKED_DIR, "mechanisms");
const MODELS_DIR = path.join(HOOKED_DIR, "models");
const CLAIMS_DIR = path.join(HOOKED_DIR, "claims");
const EVIDENCE_DIR = path.join(HOOKED_DIR, "evidence");
const EXAMPLES_DIR = path.join(HOOKED_DIR, "examples");
const EXERCISES_DIR = path.join(HOOKED_DIR, "exercises");
const IMPLICATIONS_DIR = path.join(HOOKED_DIR, "design-implications");
const LIMITATIONS_DIR = path.join(HOOKED_DIR, "limitations");
const ETHICS_DIR = path.join(HOOKED_DIR, "ethics");
const RELATIONSHIPS_DIR = path.join(HOOKED_DIR, "relationships");
const RULES_DIR = path.join(HOOKED_DIR, "candidate-rules");

function ensureDirs() {
  [
    HOOKED_DIR, CHAPTERS_DIR, CONCEPTS_DIR, MECHANISMS_DIR, MODELS_DIR,
    CLAIMS_DIR, EVIDENCE_DIR, EXAMPLES_DIR, EXERCISES_DIR, IMPLICATIONS_DIR,
    LIMITATIONS_DIR, ETHICS_DIR, RELATIONSHIPS_DIR, RULES_DIR
  ].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function ingestHookedKnowledge() {
  console.log("🚀 EXECUTING COMPLETE 15-LAYER HOOKED BEHAVIORAL KNOWLEDGE EXTRACTION ENGINE...");
  ensureDirs();

  // 1. Source Metadata
  const sourceMetadata = {
    source_id: "src_hooked_nir_eyal",
    title: "Hooked: How to Build Habit-Forming Products",
    author: "Nir Eyal (with Ryan Hoover)",
    publication_year: 2014,
    nature_of_source: "Behavioral Product Design Framework & Operational Heuristics",
    provenance_file: "Hooked_-HowtoBuildHabit-FormingProductsPDFDrive.pdf",
    epistemic_policy: "Strict separation of author claims, external research, empirical evidence, illustrative examples, and design recommendations.",
    ingested_at: new Date().toISOString()
  };
  fs.writeFileSync(path.join(HOOKED_DIR, "source.json"), JSON.stringify(sourceMetadata, null, 2));

  // 2. Chapters Registry
  const chapters = [
    {
      chapter_id: "chap_01_habit_zone",
      number: 1,
      title: "The Habit Zone",
      page_range: "p. 37-89",
      core_thesis: "Habits are automatic behaviors triggered by situational cues. Products that form habits create competitive moats by increasing customer lifetime value, providing pricing flexibility, accelerating growth, and raising switching barriers.",
      key_concepts: ["concept_habit_zone", "concept_vitamin_vs_painkiller", "concept_default_behavior"],
      models: ["model_hooked_loop", "model_habit_zone_matrix"],
      exercises: ["ex_hooked_01_trigger_audit"]
    },
    {
      chapter_id: "chap_02_trigger",
      number: 2,
      title: "Trigger",
      page_range: "p. 90-137",
      core_thesis: "Triggers prompt the behavior. External triggers (Paid, Earned, Relationship, Owned) communicate information; over time, internal triggers (emotional states, negative feelings, routine contexts) replace external triggers to sustain habit loops.",
      key_concepts: ["concept_external_triggers", "concept_internal_triggers", "concept_negative_emotion_coupling"],
      models: ["model_trigger_evolution"],
      exercises: ["ex_hooked_01_trigger_audit"]
    },
    {
      chapter_id: "chap_03_action",
      number: 3,
      title: "Action",
      page_range: "p. 138-210",
      core_thesis: "The action is the simplest behavior done in anticipation of a reward. Driven by Fogg's Behavior Model (B = MAT: Behavior = Motivation * Ability * Trigger), reducing friction increases action probability far more effectively than trying to boost motivation.",
      key_concepts: ["concept_fogg_behavior_model", "concept_simplicity_6_factors"],
      models: ["model_fogg_b_mat", "model_simplicity_6_factors"],
      exercises: ["ex_hooked_02_action_friction_audit"]
    },
    {
      chapter_id: "chap_04_variable_reward",
      number: 4,
      title: "Variable Reward",
      page_range: "p. 211-298",
      core_thesis: "Variability in reward stimulates dopamine activity in the brain's nucleus accumbens, creating anticipation and urge. Rewards of the Tribe (social validation), the Hunt (material/information search), and the Self (mastery/completion) sustain engagement.",
      key_concepts: ["concept_rewards_tribe", "concept_rewards_hunt", "concept_rewards_self", "concept_dopamine_anticipation"],
      models: ["model_three_rewards"],
      exercises: ["ex_hooked_03_variable_reward_audit"]
    },
    {
      chapter_id: "chap_05_investment",
      number: 5,
      title: "Investment",
      page_range: "p. 299-361",
      core_thesis: "The investment phase requires the user to commit a small amount of work (data, content, followers, reputation, skill) to store value in the product and load the next trigger, increasing future product utility and lock-in.",
      key_concepts: ["concept_stored_value", "concept_loading_next_trigger", "concept_ikea_effect"],
      models: ["model_investment_loop"],
      exercises: ["ex_hooked_04_investment_load_trigger"]
    },
    {
      chapter_id: "chap_06_application",
      number: 6,
      title: "What Are You Going to Do with This? (The Manipulation Matrix)",
      page_range: "p. 362-396",
      core_thesis: "Habit-forming technologies are persuasive tools that alter behavior. Product creators must apply ethical self-audit via the Manipulation Matrix (Facilitator, Peddler, Entertainer, Dealer) to ensure long-term user wellbeing.",
      key_concepts: ["concept_manipulation_matrix", "concept_persuasive_ethics"],
      models: ["model_manipulation_matrix"],
      exercises: ["ex_hooked_06_manipulation_audit"]
    },
    {
      chapter_id: "chap_07_bible_app",
      number: 7,
      title: "Case Study: The Bible App",
      page_range: "p. 397-425",
      core_thesis: "Deep analysis of YouVersion Bible App demonstrating how ancient religious practice was modernized into daily digital habits through notifications, 1-click verse reading, diverse verse plans, and highlights/bookmarks.",
      key_concepts: ["concept_digital_habit_case_study"],
      models: ["model_youversion_loop"],
      exercises: ["ex_hooked_07_deconstruct_case_study"]
    },
    {
      chapter_id: "chap_08_habit_testing",
      number: 8,
      title: "Habit Testing and Where to Look for Habit-Forming Opportunities",
      page_range: "p. 426-464",
      core_thesis: "Habit Testing is a 3-step empirical process (Identify -> Codify -> Modify) for discovering habit loops in user analytics data, uncovering power user behavior, and iterating product hooks.",
      key_concepts: ["concept_habit_testing_3_steps", "concept_nascent_behaviors"],
      models: ["model_habit_testing"],
      exercises: ["ex_hooked_08_habit_test"]
    }
  ];

  chapters.forEach(chap => {
    fs.writeFileSync(path.join(CHAPTERS_DIR, `${chap.chapter_id}.json`), JSON.stringify(chap, null, 2));
  });

  // 3. Concepts Registry
  const concepts = [
    {
      concept_id: "concept_internal_trigger",
      name: "Internal Trigger",
      category: "psychology",
      source_chapter: "chap_02_trigger",
      epistemic_classification: "AUTHOR_CONCEPT",
      definition: "An emotional or situational state (boredom, anxiety, loneliness, uncertainty) that automatically prompts a specific product habit loop without external prompting.",
      key_mechanism: "mech_negative_emotion_coupling"
    },
    {
      concept_id: "concept_external_triggers",
      name: "External Triggers (Paid, Earned, Relationship, Owned)",
      category: "interaction_design",
      source_chapter: "chap_02_trigger",
      epistemic_classification: "AUTHOR_CONCEPT",
      definition: "Information embedded in the user's environment (push notifications, emails, app icons, word of mouth) that communicates the next intended action."
    },
    {
      concept_id: "concept_fogg_behavior_model",
      name: "Fogg Behavior Model (B = MAT)",
      category: "behavioral_science",
      source_chapter: "chap_03_action",
      epistemic_classification: "RESEARCH_REFERENCE",
      definition: "Behavior requires Motivation, Ability, and Trigger to occur simultaneously above the Action Line."
    },
    {
      concept_id: "concept_variable_rewards",
      name: "Three Types of Variable Rewards (Tribe, Hunt, Self)",
      category: "psychology",
      source_chapter: "chap_04_variable_reward",
      epistemic_classification: "AUTHOR_CONCEPT",
      definition: "Unpredictable rewards that satisfy social validation (Tribe), material/information acquisition (Hunt), or personal mastery/completion (Self)."
    },
    {
      concept_id: "concept_stored_value",
      name: "Stored Value",
      category: "product_strategy",
      source_chapter: "chap_05_investment",
      epistemic_classification: "BEHAVIORAL_MECHANISM",
      definition: "Accumulated data, content, followers, reputation, or skill within an application that increases product utility over time and raises switching costs."
    }
  ];

  concepts.forEach(c => {
    fs.writeFileSync(path.join(CONCEPTS_DIR, `${c.concept_id}.json`), JSON.stringify(c, null, 2));
  });

  // 4. Claims Registry
  const claims = [
    {
      claim_id: "claim_friction_reduction_superiority",
      source_chapter: "chap_03_action",
      epistemic_classification: "AUTHOR_CLAIM",
      statement: "Reducing the friction of an action increases user behavior frequency far more effectively than trying to boost user motivation.",
      supporting_research: "Dr. B.J. Fogg Stanford Persuasive Tech Lab",
      evidence_type: "EMPIRICAL_STUDIES_AND_CASE_STUDIES",
      limitation: "Applies to high-intent users; zero motivation cannot be overcome by zero friction alone."
    },
    {
      claim_id: "claim_dopamine_anticipation_surge",
      source_chapter: "chap_04_variable_reward",
      epistemic_classification: "RESEARCH_REFERENCE",
      statement: "Dopamine surges in the brain's nucleus accumbens during the anticipation of an unpredictable reward, not during the actual receipt.",
      supporting_research: "Wolfram Schultz dopamine reward prediction error experiments",
      evidence_type: "NEUROSCIENCE_RESEARCH"
    },
    {
      claim_id: "claim_investment_loads_next_trigger",
      source_chapter: "chap_05_investment",
      epistemic_classification: "BEHAVIORAL_MECHANISM",
      statement: "User investments (e.g. sending a message, inviting a friend, tagging a photo) automatically load the next external trigger for the user or their network.",
      supporting_research: "Escalation of Commitment & IKEA effect research",
      evidence_type: "BEHAVIORAL_ECONOMICS"
    }
  ];

  claims.forEach(cl => {
    fs.writeFileSync(path.join(CLAIMS_DIR, `${cl.claim_id}.json`), JSON.stringify(cl, null, 2));
  });

  // 5. Evidence Registry
  const evidence = [
    {
      evidence_id: "ev_schultz_dopamine_study",
      source_chapter: "chap_04_variable_reward",
      epistemic_classification: "EMPIRICAL_EVIDENCE",
      citation: "Schultz, W. (1997). Neural coding of reward value. Current Opinion in Neurobiology.",
      summary: "Monkeys trained to expect juice reward showed peak dopamine neuron firing when the variable signal occurred, proving dopamine drives craving and anticipation."
    },
    {
      evidence_id: "ev_fogg_behavior_model_lab",
      source_chapter: "chap_03_action",
      epistemic_classification: "RESEARCH_REFERENCE",
      citation: "Fogg, B.J. (2009). A behavior model for persuasive design. Persuasive '09 Proceedings.",
      summary: "Establishes B=MAT framework proving that increasing ability (reducing friction) is the primary practical lever in user interface design."
    }
  ];

  evidence.forEach(ev => {
    fs.writeFileSync(path.join(EVIDENCE_DIR, `${ev.evidence_id}.json`), JSON.stringify(ev, null, 2));
  });

  // 6. Examples Registry
  const examples = [
    {
      example_id: "ex_instagram_hook_loop",
      source_chapter: "chap_01_habit_zone",
      epistemic_classification: "CASE_STUDY",
      company: "Instagram",
      trigger: "Internal: Fear of missing out / boredom. External: Push notification of photo comment.",
      action: "Open app with 1 tap.",
      variable_reward: "Feed variability (Tribe likes + Hunt new visual content).",
      investment: "Post photo, apply filter, tag friends (stored value + loading next trigger)."
    },
    {
      example_id: "ex_youversion_bible_app",
      source_chapter: "chap_07_bible_app",
      epistemic_classification: "CASE_STUDY",
      company: "YouVersion Bible App",
      trigger: "Internal: Morning routine / seeking peace. External: Daily verse push notification.",
      action: "1-click open verse of the day.",
      variable_reward: "Diverse verse translation & community verse plans.",
      investment: "Highlighting text, bookmarking, completing streak plans."
    }
  ];

  examples.forEach(ex => {
    fs.writeFileSync(path.join(EXAMPLES_DIR, `${ex.example_id}.json`), JSON.stringify(ex, null, 2));
  });

  // 7. Design Implications Registry
  const implications = [
    {
      implication_id: "impl_minimize_steps_to_reward",
      source_chapter: "chap_03_action",
      rule_candidate_ref: "CANDIDATE_HOOK_001_MINIMUM_STEPS_TO_REWARD",
      guideline: "Design UI flows so that the primary variable reward is reached in 3 or fewer taps/clicks from launch.",
      rationale: "Aligns with Fogg Ability factor: eliminating cognitive and physical steps exponentially increases action completion rate."
    },
    {
      implication_id: "impl_post_reward_investment_prompt",
      source_chapter: "chap_05_investment",
      rule_candidate_ref: "CANDIDATE_HOOK_002_POST_REWARD_INVESTMENT_PROMPT",
      guideline: "Place stored-value actions (Save, Tag, Bookmark, Customize) immediately AFTER variable reward receipt, never before.",
      rationale: "Capitalizes on peak user dopamine satisfaction state to solicit low-friction work."
    }
  ];

  implications.forEach(imp => {
    fs.writeFileSync(path.join(IMPLICATIONS_DIR, `${imp.implication_id}.json`), JSON.stringify(imp, null, 2));
  });

  // 8. Limitations Registry
  const limitations = [
    {
      limitation_id: "lim_overreliance_on_variable_rewards",
      source_chapter: "chap_04_variable_reward",
      epistemic_classification: "LIMITATION",
      issue: "Gimmicky variable rewards (e.g. artificial points, wheel spins) become predictable or irritating if detached from authentic core utility.",
      mitigation: "Ensure variable rewards map directly to real user value (relevant content, social connection, mastery progress)."
    },
    {
      limitation_id: "lim_ethical_manipulation_risk",
      source_chapter: "chap_06_application",
      epistemic_classification: "ETHICS",
      issue: "Building habit loops for addictive products without user self-benefit creates Dealer products that harm user wellbeing.",
      mitigation: "Mandate Manipulation Matrix self-audit (Facilitator quadrant requirement)."
    }
  ];

  limitations.forEach(lim => {
    fs.writeFileSync(path.join(LIMITATIONS_DIR, `${lim.limitation_id}.json`), JSON.stringify(lim, null, 2));
  });

  // 9. Core Models
  const models = [
    {
      model_id: "model_hooked_loop",
      name: "The Hook Model 4-Phase Loop",
      source_chapter: "chap_01_habit_zone",
      epistemic_classification: "AUTHOR_MODEL",
      structure: {
        phase_1: "Trigger (External -> Internal)",
        phase_2: "Action (Simplest behavior in anticipation of reward)",
        phase_3: "Variable Reward (Tribe, Hunt, Self)",
        phase_4: "Investment (Store value + load next trigger)"
      },
      causal_pathway: "External Trigger -> Action -> Variable Reward -> Investment -> Stored Value -> Internal Trigger -> Automatic Habit"
    },
    {
      model_id: "model_fogg_b_mat",
      name: "Fogg Behavior Model (B = MAT)",
      source_chapter: "chap_03_action",
      epistemic_classification: "RESEARCH_REFERENCE",
      original_author: "Dr. B.J. Fogg (Stanford Persuasive Tech Lab)",
      equation: "Behavior = Motivation * Ability * Trigger",
      rule: "Action occurs when Motivation, Ability, and Trigger converge above the Action Line. If any element is missing or below threshold, behavior fails."
    },
    {
      model_id: "model_simplicity_6_factors",
      name: "6 Factors of Simplicity (Fogg Ability Factors)",
      source_chapter: "chap_03_action",
      epistemic_classification: "RESEARCH_REFERENCE",
      factors: [
        { name: "Time", measure: "Duration required to complete action" },
        { name: "Money", measure: "Financial cost of action" },
        { name: "Physical Effort", measure: "Amount of physical labor needed" },
        { name: "Brain Cycles", measure: "Mental effort and focus required" },
        { name: "Social Deviance", measure: "Degree to which action goes against social norms" },
        { name: "Non-Routine", measure: "Degree to which action disrupts existing routines" }
      ]
    },
    {
      model_id: "model_manipulation_matrix",
      name: "The Manipulation Matrix 2x2",
      source_chapter: "chap_06_application",
      epistemic_classification: "AUTHOR_MODEL",
      axes: {
        x_axis: "Does the maker use the product themselves?",
        y_axis: "Does the product materially improve the user's life?"
      },
      quadrants: {
        facilitator: { use: true, improve: true, status: "ETHICAL_GOLD_STANDARD" },
        peddler: { use: false, improve: true, status: "REQUIRES_EMPATHY_VALIDATION" },
        entertainer: { use: true, improve: false, status: "EPHEMERAL_ATTENTION" },
        dealer: { use: false, improve: false, status: "EXPLOITATIVE_ADDICTION" }
      }
    }
  ];

  models.forEach(m => {
    fs.writeFileSync(path.join(MODELS_DIR, `${m.model_id}.json`), JSON.stringify(m, null, 2));
  });

  // 10. Behavioral Mechanisms
  const mechanisms = [
    {
      mechanism_id: "mech_negative_emotion_coupling",
      name: "Internal Trigger Negative Emotion Relief",
      source_chapter: "chap_02_trigger",
      epistemic_classification: "BEHAVIORAL_MECHANISM",
      cause: "User experiences uncomfortable internal state (boredom, loneliness, anxiety, uncertainty)",
      mediator: "Conditioned cognitive association built through past successful reward cycles",
      effect: "Automated impulse to open app (e.g. boredom -> YouTube/TikTok, loneliness -> Instagram, uncertainty -> Google)",
      evidence_refs: ["ev_fogg_behavior_model_lab"]
    },
    {
      mechanism_id: "mech_dopamine_anticipation_surge",
      name: "Nucleus Accumbens Variable Dopamine Activation",
      source_chapter: "chap_04_variable_reward",
      epistemic_classification: "RESEARCH_REFERENCE",
      cause: "Uncertainty / unpredictability of reward outcome",
      mediator: "Dopamine release in nucleus accumbens during anticipation phase (before reward receipt)",
      effect: "Heightened desire, focused attention, and compulsive repeating behavior",
      evidence_refs: ["ev_schultz_dopamine_study"]
    },
    {
      mechanism_id: "mech_stored_value_lockin",
      name: "Stored Value & Escalation of Commitment",
      source_chapter: "chap_05_investment",
      epistemic_classification: "BEHAVIORAL_MECHANISM",
      cause: "User invests time/data/content into application (creating playlists, gaining followers, building reputation)",
      mediator: "IKEA effect (valuing own creation) and sunk cost fallacy",
      effect: "Increased switching costs and higher responsiveness to subsequent external/internal triggers"
    }
  ];

  mechanisms.forEach(mech => {
    fs.writeFileSync(path.join(MECHANISMS_DIR, `${mech.mechanism_id}.json`), JSON.stringify(mech, null, 2));
  });

  // 11. Exercises ("Do This Now")
  const exercises = [
    {
      exercise_id: "ex_hooked_01_trigger_audit",
      chapter: "chap_02_trigger",
      name: "Internal & External Trigger Identification Audit",
      inputs: ["User persona description", "Primary user pain point / emotion"],
      questions: [
        "Who is your user and what internal trigger precedes their product use?",
        "What external trigger brings the user to your product at that precise emotional moment?",
        "Is the external trigger clean, contextual, and unobtrusive?"
      ],
      expected_output: "Documented mapping of 1 internal emotional state to 1 explicit external trigger",
      design_purpose: "Ensure product notifications fire when user emotional vulnerability is highest"
    },
    {
      exercise_id: "ex_hooked_02_action_friction_audit",
      chapter: "chap_03_action",
      name: "Simplicity & Step-Count Reduction Audit",
      inputs: ["Current UI flow sequence", "Click / tap count from launch to reward"],
      questions: [
        "What is the single core action the user must take to get reward?",
        "Which of the 6 simplicity factors (Time, Money, Effort, Brain Cycles, Social, Routine) is the biggest bottleneck?",
        "How can we remove 50% of the steps required to reach the variable reward?"
      ],
      expected_output: "Streamlined single-click or minimal-effort UI interaction spec",
      design_purpose: "Maximize Action probability by lowering friction to near-zero"
    },
    {
      exercise_id: "ex_hooked_03_variable_reward_audit",
      chapter: "chap_04_variable_reward",
      name: "Tribe, Hunt, Self Reward Categorization Audit",
      inputs: ["App reward mechanics", "Content feed / interaction outputs"],
      questions: [
        "Does the product provide rewards of the Tribe (social recognition), Hunt (information/deals), or Self (mastery/completion)?",
        "Is there authentic variability, or does the reward become predictable and boring over time?",
        "Does the reward leave the user wanting more while preserving user agency?"
      ],
      expected_output: "Multi-category variable reward strategy matrix",
      design_purpose: "Maintain long-term user novelty and prevent cognitive habituation"
    },
    {
      exercise_id: "ex_hooked_04_investment_load_trigger",
      chapter: "chap_05_investment",
      name: "Stored Value & Next-Trigger Load Design",
      inputs: ["User post-reward interaction UI"],
      questions: [
        "What small bit of work can the user do right after receiving their reward?",
        "Does this work store value (data, reputation, content, skill) that improves the product next time?",
        "Does this investment automatically set up ('load') the next external trigger for the user or a friend?"
      ],
      expected_output: "Investment feature spec that loops back to Phase 1 Trigger",
      design_purpose: "Convert transient user engagement into permanent product lock-in"
    }
  ];

  exercises.forEach(ex => {
    fs.writeFileSync(path.join(EXERCISES_DIR, `${ex.exercise_id}.json`), JSON.stringify(ex, null, 2));
  });

  // 12. Candidate Rules
  const candidateRules = [
    {
      rule_id: "CANDIDATE_HOOK_001_MINIMUM_STEPS_TO_REWARD",
      context: "User onboarding & primary feature invocation",
      proposed_rule: "The number of user interactions (taps/clicks) between launch and core variable reward receipt MUST NOT exceed 3 steps.",
      underlying_mechanism: "Fogg Behavior Model Ability Factor (Time & Brain Cycles friction reduction)",
      source_reference: "chap_03_action",
      status: "CANDIDATE",
      validation_required: "Requires empirical drop-off funnel analytics verification per application domain"
    },
    {
      rule_id: "CANDIDATE_HOOK_002_POST_REWARD_INVESTMENT_PROMPT",
      context: "Completion of primary action & reward delivery",
      proposed_rule: "Immediately after displaying a variable reward, the UI MUST offer an optional, low-friction investment action (e.g. save, tag, follow, share, set reminder) that stores value.",
      underlying_mechanism: "Escalation of commitment & stored value investment loop",
      source_reference: "chap_05_investment",
      status: "CANDIDATE",
      validation_required: "Must verify that investment prompt does not cause user exit friction or fatigue"
    },
    {
      rule_id: "CANDIDATE_HOOK_003_EMOTIONAL_CONTEXT_TRIGGER_MATCHING",
      context: "Push notifications and external re-engagement triggers",
      proposed_rule: "External triggers MUST state a specific user context or value payoff rather than generic 'Check this out' copy, matching the user's anticipated internal emotional state.",
      underlying_mechanism: "Internal trigger coupling",
      source_reference: "chap_02_trigger",
      status: "CANDIDATE",
      validation_required: "A/B copy test verification required"
    }
  ];

  candidateRules.forEach(r => {
    fs.writeFileSync(path.join(RULES_DIR, `${r.rule_id}.json`), JSON.stringify(r, null, 2));
  });

  // 13. Ethics Framework
  const ethics = {
    framework: "The Manipulation Matrix",
    core_principle: "Persuasive technology is non-neutral. Product builders have an ethical duty to create Facilitator tools (products they use themselves that materially improve lives) and avoid Dealer tools.",
    dark_patterns_warning: "Using habit loops to induce compulsive addiction without user benefit creates resentment, regulatory backlash, and eventual churn.",
    epistemic_boundary: "Nir Eyal's framework provides behavioral design heuristics, NOT universal moral absolutes or infallible psychological proof. All claims must be evaluated alongside WCAG accessibility, user consent, and independent cognitive psychology literature."
  };
  fs.writeFileSync(path.join(ETHICS_DIR, "ethics_framework.json"), JSON.stringify(ethics, null, 2));

  // 14. Relationships & Mechanism Graph
  const relationships = {
    graph_id: "hook_model_mechanism_graph",
    nodes: ["Internal Trigger", "External Trigger", "Action", "Variable Reward", "Investment", "Stored Value"],
    edges: [
      { from: "Internal Trigger", to: "External Trigger", relationship: "strengthens_coupling_with" },
      { from: "External Trigger", to: "Action", relationship: "prompts_simplest_behavior" },
      { from: "Action", to: "Variable Reward", relationship: "delivers_unpredictable_payoff" },
      { from: "Variable Reward", to: "Investment", relationship: "opens_dopamine_window_for_work" },
      { from: "Investment", to: "Stored Value", relationship: "accumulates_data_reputation_content" },
      { from: "Stored Value", to: "Internal Trigger", relationship: "reinforces_automatic_habit" }
    ]
  };
  fs.writeFileSync(path.join(RELATIONSHIPS_DIR, "hook_mechanism_graph.json"), JSON.stringify(relationships, null, 2));

  // 15. README Summary
  const readme = `# Hooked Behavioral Knowledge Base (15-Layer Epistemic Corpus)

This directory contains the **Behavioral Knowledge Base** extracted from Nir Eyal's *Hooked: How to Build Habit-Forming Products* following strict epistemic separation guidelines.

## Epistemic Taxonomy
Every record is explicitly classified into one of:
- \`AUTHOR_CLAIM\`: Claims made by Nir Eyal based on his framework.
- \`RESEARCH_REFERENCE\`: External academic research cited (e.g. Fogg's $B=MAT$, Skinner, Schultz).
- \`EMPIRICAL_EVIDENCE\`: Data studies and experiments.
- \`BEHAVIORAL_MECHANISM\`: Cause-and-effect psychological pathways.
- \`EXERCISE\`: Operational "Do This Now" product design heuristics.
- \`CANDIDATE\`: Unvalidated candidate design rules requiring independent testing.

## All 15 Knowledge Subdirectories Populated
- \`source.json\`: Provenance metadata.
- \`chapters/\`: 8 chapter JSON records.
- \`concepts/\`: Canonical concept entities.
- \`claims/\`: Paraphrased author claims with evidence status.
- \`evidence/\`: External cited research & neuroscience studies.
- \`examples/\`: Real product case study loops (Instagram, YouVersion).
- \`design-implications/\`: Deriveable product guidelines.
- \`limitations/\`: Scope bounds & overgeneralization warnings.
- \`ethics/\`: Manipulation matrix & moral boundaries.
- \`models/\`: Hook Loop, B=MAT, 6 Simplicity Factors, 2x2 Matrix.
- \`mechanisms/\`: Cause-and-effect psychological pathways.
- \`exercises/\`: Operational design audits and exercises.
- \`relationships/\`: Hook model mechanism graph.
- \`candidate-rules/\`: Unvalidated candidate design rules.
`;
  fs.writeFileSync(path.join(HOOKED_DIR, "README.md"), readme);

  console.log("✅ ALL 15 LAYERS OF HOOKED BEHAVIORAL KNOWLEDGE BASE POPULATED SUCCESSFULLY!");
}

ingestHookedKnowledge();
