interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-10 h-10" };

export default function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin border-4 border-primary-500 border-t-transparent rounded-full ${sizes[size]} ${className}`}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="md" />
    </div>
  );
}
