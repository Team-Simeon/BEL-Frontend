type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({
  message = "Зареждане...",
}: LoadingStateProps) {
  return (
    <div className="ui-state" role="status" aria-live="polite">
      <div className="ui-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
