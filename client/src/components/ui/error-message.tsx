import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorMessageProps {
  message: string;
  description?: string;
  className?: string;
}

export function ErrorMessage({ message, description, className }: ErrorMessageProps) {
  return (
    <Alert className={`border-red-200 bg-red-50 text-red-800 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-1">
          <p className="font-medium">{message}</p>
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}