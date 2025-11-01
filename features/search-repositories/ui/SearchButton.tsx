import React from "react";
import { Button } from "@/shared/ui/Button";

interface SearchButtonProps {
  type?: "button" | "submit";
}

export const SearchButton: React.FC<SearchButtonProps> = ({
  type = "submit",
}) => {
  return <Button type={type}>検索</Button>;
};
