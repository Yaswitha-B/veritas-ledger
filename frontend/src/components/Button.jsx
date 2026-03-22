export default function Button({
  children,
  onClick,
  loading = false,
  loadingText = "Processing…",
  disabled = false,
  variant = "primary",
}) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="btn-spinner" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
