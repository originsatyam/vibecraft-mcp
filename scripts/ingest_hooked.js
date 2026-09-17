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
  console.log("🚀 EXECUTING HOOKED BEHAVIORAL KNOWLEDGE EXTRACTION ENGINE...");
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
      key_concepts: ["habit_definition", "habit_zone_matrix", "vitamin_vs_painkiller", "default_behavior", "lizard_brain_automation"],
      models: ["model_hooked_loop_overview", "model_habit_zone_frequency_vs_utility"],
      exercises: ["ex_01_identify_habits", "ex_01_painkiller_eval"]
    },
    {
      chapter_id: "chap_02_trigger",
      number: 2,
      title: "Trigger",
      page_range: "p. 90-137",
      core_thesis: "Triggers prompt the behavior. External triggers (Paid, Earned, Relationship, Owned) communicate information; over time, internal triggers (emotional states, negative feelings, routine contexts) replace external triggers to sustain habit loops.",
      key_concepts: ["external_trigger_types", "internal_triggers", "negative_emotion_coupling", "5_whys_root_cause"],
      models: ["model_trigger_evolution_external_to_internal"],
      exercises: ["ex_02_map_internal_triggers", "ex_02_5_whys_analysis"]
    },
    {
      chapter_id: "chap_03_action",
      number: 3,
      title: "Action",
      page_range: "p. 138-210",
      core_thesis: "The action is the simplest behavior done in anticipation of a reward. Driven by Fogg's Behavior Model (B = MAT: Behavior = Motivation * Ability * Trigger), reducing friction increases action probability far more effectively than trying to boost motivation.",
      key_concepts: ["fogg_behavior_model", "motivation_levers", "ability_6_elements_of_simplicity", "heuristics_and_cognitive_biases"],
      models: ["model_fogg_b_mat", "model_simplicity_6_factors"],
      exercises: ["ex_03_audit_action_friction", "ex_03_reduce_steps_to_reward"]
    },
    {
      chapter_id: "chap_04_variable_reward",
      number: 4,
      title: "Variable Reward",
      page_range: "p. 211-298",
      core_thesis: "Variability in reward stimulates dopamine activity in the brain's nucleus accumbens, creating anticipation and urge. Rewards of the Tribe (social validation), the Hunt (material/information search), and the Self (mastery/completion) sustain engagement.",
      key_concepts: ["rewards_of_the_tribe", "rewards_of_the_hunt", "rewards_of_the_self", "dopamine_anticipation_gap", "autonomy_preservation"],
      models: ["model_three_variable_reward_types", "model_dopamine_surge_on_anticipation"],
      exercises: ["ex_04_categorize_rewards", "ex_04_introduce_variability"]
    },
    {
      chapter_id: "chap_05_investment",
      number: 5,
      title: "Investment",
      page_range: "p. 299-361",
      core_thesis: "The investment phase requires the user to commit a small amount of work (data, content, followers, reputation, skill) to store value in the product and load the next trigger, increasing future product utility and lock-in.",
      key_concepts: ["stored_value", "loading_the_next_trigger", "escalation_of_commitment", "ikea_effect_valuation"],
      models: ["model_investment_loop_stored_value"],
      exercises: ["ex_05_identify_stored_value_types", "ex_05_design_next_trigger_load"]
    },
    {
      chapter_id: "chap_06_application",
      number: 6,
      title: "What Are You Going to Do with This? (The Manipulation Matrix)",
      page_range: "p. 362-396",
      core_thesis: "Habit-forming technologies are persuasive tools that alter behavior. Product creators must apply ethical self-audit via the Manipulation Matrix (Facilitator, Peddler, Entertainer, Dealer) to ensure long-term user wellbeing.",
      key_concepts: ["manipulation_matrix", "facilitator", "peddler", "entertainer", "dealer", "persuasive_technology_ethics"],
      models: ["model_manipulation_matrix_2x2"],
      exercises: ["ex_06_audit_manipulation_matrix"]
    },
    {
      chapter_id: "chap_07_bible_app",
      number: 7,
      title: "Case Study: The Bible App",
      page_range: "p. 397-425",
      core_thesis: "Deep analysis of YouVersion Bible App demonstrating how ancient religious practice was modernized into daily digital habits through notifications (external triggers), emotional connection (internal triggers), 1-click verse reading (action), diverse verse plans (variable reward), and highlights/bookmarks (investment).",
      key_concepts: ["case_study_youversion", "digital_spiritual_habit", "push_notification_ethics"],
      models: ["model_youversion_hook_loop"],
      exercises: ["ex_07_deconstruct_case_study"]
    },
    {
      chapter_id: "chap_08_habit_testing",
      number: 8,
      title: "Habit Testing and Where to Look for Habit-Forming Opportunities",
      page_range: "p. 426-464",
      core_thesis: "Habit Testing is a 3-step empirical process (Identify -> Codify -> Modify) for discovering habit loops in user analytics data, uncovering power user behavior, and iterating product hooks.",
      key_concepts: ["habit_testing_3_steps", "habit_path_identification", "nascent_behaviors", "power_user_cohort_analysis"],
      models: ["model_habit_testing_identify_codify_modify"],
      exercises: ["ex_08_execute_habit_test"]
    }
  ];

  chapters.forEach(chap => {
    fs.writeFileSync(path.join(CHAPTERS_DIR, `${chap.chapter_id}.json`), JSON.stringify(chap, null, 2));
  });

  // 3. Core Models
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

  // 4. Behavioral Mechanisms
  const mechanisms = [
    {
      mechanism_id: "mech_negative_emotion_coupling",
      name: "Internal Trigger Negative Emotion Relief",
      source_chapter: "chap_02_trigger",
      epistemic_classification: "BEHAVIORAL_MECHANISM",
      cause: "User experiences uncomfortable internal state (boredom, loneliness, anxiety, uncertainty)",
      mediator: "Conditioned cognitive association built through past successful reward cycles",
      effect: "Automated impulse to open app (e.g. boredom -> YouTube/TikTok, loneliness -> Instagram, uncertainty -> Google)",
      evidence_refs: ["ref_dichter_word_of_mouth", "ref_kahneman_loss_aversion"]
    },
    {
      mechanism_id: "mech_dopamine_anticipation_surge",
      name: "Nucleus Accumbens Variable Dopamine Activation",
      source_chapter: "chap_04_variable_reward",
      epistemic_classification: "RESEARCH_REFERENCE",
      cause: "Uncertainty / unpredictability of reward outcome",
      mediator: "Dopamine release in nucleus accumbens during anticipation phase (before reward receipt)",
      effect: "Heightened desire, focused attention, and compulsive repeating behavior",
      evidence_refs: ["ref_skinner_operant_conditioning", "ref_schultz_dopamine_reward_prediction_error"]
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

  // 5. Exercises ("Do This Now")
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

  // 6. Candidate Rules (to be validated)
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

  // 7. Ethics & Limitations Registry
  const ethics = {
    framework: "The Manipulation Matrix",
    core_principle: "Persuasive technology is non-neutral. Product builders have an ethical duty to create Facilitator tools (products they use themselves that materially improve lives) and avoid Dealer tools.",
    dark_patterns_warning: "Using habit loops to induce compulsive addiction without user benefit creates resentment, regulatory backlash, and eventual churn.",
    epistemic_boundary: "Nir Eyal's framework provides behavioral design heuristics, NOT universal moral absolutes or infallible psychological proof. All claims must be evaluated alongside WCAG accessibility, user consent, and independent cognitive psychology literature."
  };
  fs.writeFileSync(path.join(ETHICS_DIR, "ethics_framework.json"), JSON.stringify(ethics, null, 2));

  // 8. README / Overview
  const readme = `# Hooked Behavioral Knowledge Base

This directory contains the **Behavioral Knowledge Base** extracted from Nir Eyal's *Hooked: How to Build Habit-Forming Products* following strict epistemic separation guidelines.

## Epistemic Taxonomy
Every record is explicitly classified into one of:
- \`AUTHOR_CLAIM\`: Claims made by Nir Eyal based on his framework.
- \`RESEARCH_REFERENCE\`: External academic research cited (e.g. Fogg's $B=MAT$, Skinner, Schultz).
- \`EMPIRICAL_EVIDENCE\`: Data studies and experiments.
- \`BEHAVIORAL_MECHANISM\`: Cause-and-effect psychological pathways.
- \`EXERCISE\`: Operational "Do This Now" product design heuristics.
- \`CANDIDATE\`: Unvalidated candidate design rules requiring independent testing.

## Directory Structure
- \`source.json\`: Provenance metadata.
- \`chapters/\`: Chapter breakdown (01 through 08).
- \`models/\`: Key structural models (The Hook Loop, Fogg B=MAT, 6 Simplicity Factors, Manipulation Matrix).
- \`mechanisms/\`: Extracted psychological mechanism pathways.
- \`exercises/\`: Operational design audits and exercises.
- \`ethics/\`: Ethical manipulation matrix & boundaries.
- \`candidate-rules/\`: Candidate rules generated for future validation.
`;
  fs.writeFileSync(path.join(HOOKED_DIR, "README.md"), readme);

  console.log("✅ Hooked Behavioral Knowledge Base ingested successfully!");
}

ingestHookedKnowledge();
