const labels: Record<string, string> = {
  get_current_datetime: 'Checking the current date and time',
  get_current_weather: 'Checking the weather',
};

/** Shows users when the assistant is waiting for a tool result. */
export function ToolActivity({ toolName }: { toolName: string | null }) {
  if (!toolName) return null;
  return (
    <p className="mx-auto w-full max-w-3xl px-6 text-sm text-muted" role="status">
      {labels[toolName] || 'Using a tool'}…
    </p>
  );
}
