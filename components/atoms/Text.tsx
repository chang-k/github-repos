import React from "react";

interface TextProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Text: React.FC<TextProps> = ({
  children,
  className = "",
  size = "md",
}) => {
  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <p className={`${sizeStyles[size]} ${className}`}>{children}</p>
  );
};
