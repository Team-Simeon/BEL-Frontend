import axios from "axios";
import api from "./api";

// Must match the backend contract of POST /api/feedback exactly.
export type FeedbackType = "Problem" | "Suggestion";

export type FeedbackPayload = {
  type: FeedbackType;
  message: string;
};

export type FeedbackResponse = {
  id: string;
  type: FeedbackType;
  message: string;
  createdAtUtc: string;
};

export const FEEDBACK_MIN_LENGTH = 10;
export const FEEDBACK_MAX_LENGTH = 1000;

export type FeedbackField = keyof FeedbackPayload;
export type FeedbackFieldErrors = Partial<Record<FeedbackField, string>>;

/**
 * Error thrown by submitFeedback. `fieldErrors` holds the backend's
 * validation messages per field (from a 400), so the form can show
 * them under the matching inputs.
 */
export class FeedbackRequestError extends Error {
  readonly fieldErrors: FeedbackFieldErrors;

  constructor(message: string, fieldErrors: FeedbackFieldErrors = {}) {
    super(message);
    this.name = "FeedbackRequestError";
    this.fieldErrors = fieldErrors;
  }
}

type ProblemDetails = {
  title?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
};

const FIELDS: FeedbackField[] = ["type", "message"];

// ASP.NET Core names the fields "Message", "message" or "$.message"
// depending on where validation failed, so normalise the keys.
function toField(key: string): FeedbackField | null {
  const name = key.replace(/^\$\./, "").toLowerCase();
  return FIELDS.find((field) => field === name) ?? null;
}

function readFieldErrors(
  problem: ProblemDetails | undefined,
): FeedbackFieldErrors {
  const result: FeedbackFieldErrors = {};
  if (!problem?.errors) return result;

  for (const [key, value] of Object.entries(problem.errors)) {
    const field = toField(key);
    const messages = Array.isArray(value) ? value : [value];
    if (field && messages.length > 0) {
      result[field] = [result[field], ...messages].filter(Boolean).join(" ");
    }
  }
  return result;
}

function toFeedbackError(error: unknown): FeedbackRequestError {
  if (!axios.isAxiosError(error)) {
    return new FeedbackRequestError("Възникна неочаквана грешка.");
  }

  if (!error.response) {
    return new FeedbackRequestError("Няма връзка със сървъра.");
  }

  const { status } = error.response;
  const problem = error.response.data as ProblemDetails | undefined;

  if (status === 400) {
    const fieldErrors = readFieldErrors(problem);
    const message =
      Object.keys(fieldErrors).length > 0
        ? "Моля, поправете грешките във формата."
        : problem?.detail || "Сървърът отхвърли съобщението.";
    return new FeedbackRequestError(message, fieldErrors);
  }

  if (status === 401) {
    return new FeedbackRequestError(
      "Трябва да влезете в профила си, за да изпратите съобщение.",
    );
  }

  if (status === 503) {
    return new FeedbackRequestError("Базата данни временно не е достъпна.");
  }

  return new FeedbackRequestError("Сървърът не можа да приеме съобщението.");
}

/** Sends feedback to POST /api/feedback. */
export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<FeedbackResponse> {
  try {
    const { data } = await api.post<FeedbackResponse>("/feedback", payload);
    return data;
  } catch (error) {
    throw toFeedbackError(error);
  }
}
