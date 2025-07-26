import { cn } from ":app/utils/cn";

export interface ToastMessage {
  message: string;
  type: "error" | "success" | "info";
}

export type ToasterProps = {
  message: ToastMessage;
  onDismiss: () => void;
};

export default function Toaster({
  message,
  onDismiss,
} : ToasterProps) {
  return (
    <div className="sc-toaster">
      <div className={cn('sc-toast', 'sc-toast-' + (message.type ?? 'info'))}>
        <div className="sc-toast-content">
          <span className="sc-toast-message">{message.message}</span>
          <button
            onClick={onDismiss}
            className="sc-toast-dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}