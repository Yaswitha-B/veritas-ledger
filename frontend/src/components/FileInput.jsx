export default function FileInput({ onChange }) {
  return (
    <input type="file" onChange={(e) => onChange(e.target.files[0])} />
  );
}