"use client";

import React, { useState } from "react";
import { Icon } from "@/shared/ui/Icon";

interface FilterAccordionProps {
  children: React.ReactNode;
}

export const FilterAccordion: React.FC<FilterAccordionProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium">詳細検索</span>
        <Icon type={isOpen ? "chevron-up" : "chevron-down"} />
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-200">{children}</div>
      )}
    </div>
  );
};
