import React from "react";

interface HeadingProps {
  level: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className = "",
}) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  const styles = {
    1: "text-2xl font-bold",
    2: "text-xl font-semibold",
    3: "text-lg font-medium",
  };

  return <Tag className={`${styles[level]} ${className}`}>{children}</Tag>;
};
