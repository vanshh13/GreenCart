export function Input({ type, placeholder, value, onChange, className, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded-md p-2 w-full ${className || ""}`} // ✅ Prevent undefined className
      {...props} // ✅ Spread additional props (like `name`)
    />
  );
}
