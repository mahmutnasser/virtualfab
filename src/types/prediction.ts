/**
 * CENTRALIZED INTERACTIVE LEARNING QUESTIONS & PEDAGOGICAL TRUTH
 *
 * Single source of correctness truth: `correctOptionId`.
 * Feedback is keyed strictly by option ID to avoid duplicate boolean states.
 */

export interface QuestionOptionItem {
  id: string;
  label: string;
}

export interface QuestionConfig {
  id: string;
  prompt: string;
  subtext: string;
  options: QuestionOptionItem[];
  correctOptionId: string;
  feedbackByOptionId: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────
// DEPOSITION PREDICTION QUESTION
// ─────────────────────────────────────────────────────────────

export const DEPOSITION_PREDICTION_QUESTION: QuestionConfig = {
  id: 'q_deposition_prediction',
  prompt: 'What will deposition change on the wafer?',
  subtext: 'Select what happens physically to the wafer before running the equipment.',
  correctOptionId: 'opt_add_layer',
  options: [
    {
      id: 'opt_add_layer',
      label: 'Adds a material layer across the surface',
    },
    {
      id: 'opt_remove_mat',
      label: 'Removes material from the surface',
    },
    {
      id: 'opt_pattern_light',
      label: 'Defines a pattern using light',
    },
    {
      id: 'opt_remove_resist',
      label: 'Removes photoresist',
    },
  ],
  feedbackByOptionId: {
    opt_add_layer:
      'Correct! In this simplified process model, deposition adds a thin film of material across the wafer surface.',
    opt_remove_mat:
      'Not quite. Material removal occurs during etching, not deposition.',
    opt_pattern_light:
      'Not quite. Transferring patterns using light is the role of photolithography.',
    opt_remove_resist:
      'Not quite. Removing photoresist occurs during the photoresist strip step.',
  },
};

export const DEPOSITION_PREDICTION_OPTIONS: QuestionOptionItem[] =
  DEPOSITION_PREDICTION_QUESTION.options;

export const DEPOSITION_PREDICTION_COMPARISONS: Record<
  string,
  { predicted: string; comparison: string }
> = {
  opt_add_layer: {
    predicted: 'Adds a material layer across the surface',
    comparison:
      'Your prediction matched the physical result: in this simplified process model, deposition added a dielectric thin film across the wafer surface without altering the substrate.',
  },
  opt_remove_mat: {
    predicted: 'Removes material from the surface',
    comparison:
      'You predicted material removal. In this simplified process model, deposition adds material; material removal is performed in Step 5 (Etch).',
  },
  opt_pattern_light: {
    predicted: 'Defines a pattern using light',
    comparison:
      'You predicted optical patterning. In this simplified process model, deposition adds a blank continuous film. Circuit patterns are exposed in Step 3 (Lithography).',
  },
  opt_remove_resist: {
    predicted: 'Removes photoresist',
    comparison:
      'You predicted resist removal. In reality, photoresist is not applied until Step 2 (Coat Resist) and stripped in Step 6 (Strip).',
  },
};

// ─────────────────────────────────────────────────────────────
// DEPOSITION CONCEPTUAL INTERPRETATION QUESTION (VF-008 Corrected)
// ─────────────────────────────────────────────────────────────

export const DEPOSITION_INTERPRETATION_QUESTION: QuestionConfig = {
  id: 'interp_deposition_blanket',
  prompt:
    'In this simplified patterning cycle, why is the example film deposited across the wafer before selective patterning?',
  subtext: 'Consider the sequence of semiconductor manufacturing steps.',
  correctOptionId: 'interp_blanket_additive',
  options: [
    {
      id: 'interp_blanket_additive',
      label:
        'This example uses blanket deposition; lithography defines the pattern and a later etch selectively removes material.',
    },
    {
      id: 'interp_covers_all',
      label:
        'Transistors cover the entire substrate surface with no gaps between active regions.',
    },
    {
      id: 'interp_cannot_control',
      label:
        'Chamber vapor flow cannot be directed toward specific wafer regions.',
    },
  ],
  feedbackByOptionId: {
    interp_blanket_additive:
      'Correct! This example uses blanket deposition; lithography defines the pattern and a later etch selectively removes material.',
    interp_covers_all:
      'Not quite. Microchips contain vast spaces between individual transistors and interconnected lines.',
    interp_cannot_control:
      'Not quite. Deposition chambers control vapor flow with extreme precision, but are intentionally engineered for broad surface coverage.',
  },
};

/**
 * Single source of truth validation helper.
 */
export function isQuestionAnswerCorrect(
  question: QuestionConfig,
  optionId: string | null | undefined,
): boolean {
  if (!optionId) return false;
  return question.correctOptionId === optionId;
}

export function getOptionFeedback(
  question: QuestionConfig,
  optionId: string | null | undefined,
): { feedback: string; isCorrect: boolean } | undefined {
  if (!optionId) return undefined;
  const feedback = question.feedbackByOptionId[optionId];
  if (!feedback) return undefined;
  return {
    feedback,
    isCorrect: question.correctOptionId === optionId,
  };
}
