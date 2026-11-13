type EmptyStateProps = {
  title?: string;
  message?: string;
};

export default function EmptyState({
  title = "Няма намерени резултати",
  message = "Все още няма налична информация.",
}: EmptyStateProps) {
  return (
    <div className="ui-state" role="status">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
