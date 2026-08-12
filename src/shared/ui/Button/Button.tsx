import "./Button.css";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        "desrec-button",
        `desrec-button--${variant}`,
        fullWidth && "desrec-button--full",
        loading && "desrec-button--loading",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? (
        <span className="desrec-button-spinner" />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;

