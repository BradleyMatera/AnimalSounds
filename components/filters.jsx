"use client";

import { Input, Select, SelectItem } from "@nextui-org/react";
import { useId } from "react";

export default function Filters({ search, onSearchChange, continent, onContinentChange, continents }) {
  const searchId = useId();

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
      <Input
        id={searchId}
        value={search}
        onValueChange={onSearchChange}
        type="search"
        variant="faded"
        label="Search animals"
        placeholder="Find by name, habitat, or description"
        startContent={<span aria-hidden="true">🔍</span>}
      />

      <Select
        variant="bordered"
        selectedKeys={[continent]}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0];
          onContinentChange(value || "All");
        }}
        label="Filter by region"
      >
        {continents.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
