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

const MOCK_DELAY_MS = 1000;
const MOCK_FAILURE_RATE = 0.3;

/**
 * Mock for the future backend endpoint (POST /feedback).
 * Waits one second, then succeeds or fails at random.
 * When the backend is ready, replace the body with:
 *   const { data } = await api.post<FeedbackResponse>("/feedback", payload);
 *   return data;
 */
export function submitFeedback(
  payload: FeedbackPayload,
  shouldFail: boolean = Math.random() < MOCK_FAILURE_RATE,
): Promise<FeedbackResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Сървърът не можа да приеме съобщението."));
        return;
      }

      resolve({
        id: crypto.randomUUID(),
        type: payload.type,
        message: payload.message,
        createdAtUtc: new Date().toISOString(),
      });
      console.info("[mock] feedback sent", payload);
    }, MOCK_DELAY_MS);
  });
}
