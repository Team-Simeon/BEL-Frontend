type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = "Възникна грешка. Моля, опитайте отново.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="ui-state" role="alert">
      <h2>Възникна грешка</h2>
      <p>{message}</p>

      {onRetry && (
        <button type="button" onClick={onRetry}>
          Опитай отново
        </button>
      )}
    </div>
  );
}
