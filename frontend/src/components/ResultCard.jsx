export default function ResultCard({ title, value }) {
  if (!value) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <strong>{title}</strong>
      <pre>{value}</pre>
    </div>
  );
}