export function BinaryCode({ value, className = "" }: { value: string; className?: string }) {
  const octets = value.split(".");
  return <code className={`octet-code ${className}`}>{octets.map((octet, index) => <span key={index}>{octet}{index < octets.length - 1 ? "." : ""}</span>)}</code>;
}
