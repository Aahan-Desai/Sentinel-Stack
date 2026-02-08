interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded bg-black text-white ${className ?? ""}`}
      {...props}
    />
  );
}
