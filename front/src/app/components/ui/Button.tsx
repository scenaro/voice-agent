import { cn } from ":app/utils/cn";
import type { ButtonProps } from ":types/index";

export default function Button({
  children,
  className = "",
  disabled = false,
  state = "primary",
  size = "small",
  onClick,
  ...props
} : ButtonProps) {
  return (
    <button
      className={cn(
        'sc-btn',
        'sc-btn-' + state,
        {
          'sc-btn-large': size === 'large',
          'sc-btn-medium': size === 'medium',
          'pointer-events-none': disabled,
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};