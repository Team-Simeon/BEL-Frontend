import { useState } from "react";
import type { FormEvent } from "react";
import {
  FEEDBACK_MAX_LENGTH,
  FEEDBACK_MIN_LENGTH,
  submitFeedback,
} from "../services/feedbackApi";
import type { FeedbackType } from "../services/feedbackApi";
import "./FeedbackPage.css";

type Status = "idle" | "sending" | "success" | "error";

function validateMessage(message: string): string | null {
  const length = message.trim().length;

  if (length === 0) {
    return "Моля, напишете съобщение.";
  }
  if (length < FEEDBACK_MIN_LENGTH) {
    return `Съобщението трябва да е поне ${FEEDBACK_MIN_LENGTH} символа.`;
  }
  if (message.length > FEEDBACK_MAX_LENGTH) {
    return `Съобщението може да е най-много ${FEEDBACK_MAX_LENGTH} символа.`;
  }
  return null;
}

export default function FeedbackPage() {
  const [type, setType] = useState<FeedbackType>("problem");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const isSending = status === "sending";
  const isOverLimit = message.length > FEEDBACK_MAX_LENGTH;

  function handleMessageChange(value: string) {
    setMessage(value);
    if (status === "success") setStatus("idle");
    // After the first submit attempt, keep the error up to date while typing.
    if (submitted) setFieldError(validateMessage(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending) return;

    setSubmitted(true);
    const error = validateMessage(message);
    setFieldError(error);
    if (error) return;

    setStatus("sending");
    setServerError(null);

    try {
      await submitFeedback({ type, message: message.trim() });
      setStatus("success");
      setMessage("");
      setSubmitted(false);
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Възникна неочаквана грешка.",
      );
    }
  }

  return (
    <main className="feedback-page">
      <h1>Обратна връзка</h1>
      <p className="feedback-intro">
        Срещнахте проблем или имате идея как да подобрим платформата?
        Пишете ни.
      </p>

      <form className="feedback-form" onSubmit={handleSubmit} noValidate>
        <fieldset className="feedback-type" disabled={isSending}>
          <legend>Тип</legend>
          <label>
            <input
              type="radio"
              name="type"
              value="problem"
              checked={type === "problem"}
              onChange={() => setType("problem")}
            />
            Проблем
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="suggestion"
              checked={type === "suggestion"}
              onChange={() => setType("suggestion")}
            />
            Предложение
          </label>
        </fieldset>

        <div className="feedback-field">
          <label htmlFor="feedback-message">Съобщение</label>
          <textarea
            id="feedback-message"
            rows={7}
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            disabled={isSending}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby="feedback-counter feedback-error"
          />
          <div className="feedback-field-footer">
            <p id="feedback-error" className="feedback-error" role="alert">
              {fieldError}
            </p>
            <span
              id="feedback-counter"
              className={`feedback-counter${isOverLimit ? " is-over" : ""}`}
              aria-live="polite"
            >
              {message.length} / {FEEDBACK_MAX_LENGTH}
            </span>
          </div>
        </div>

        <button type="submit" className="feedback-submit" disabled={isSending}>
          {isSending && <span className="feedback-spinner" aria-hidden="true" />}
          {isSending ? "Изпращане..." : "Изпрати"}
        </button>

        {status === "success" && (
          <p className="feedback-status is-success" role="status">
            Благодарим! Съобщението е изпратено.
          </p>
        )}
        {status === "error" && (
          <p className="feedback-status is-error" role="alert">
            {serverError} Опитайте отново.
          </p>
        )}
      </form>
    </main>
  );
}
