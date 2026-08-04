"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface AsyncSelectOption {
  value: string;
  label: string;
}

interface AsyncSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loadOptions: (query: string) => Promise<AsyncSelectOption[]>;
  disabled?: boolean;
}

export function AsyncSelect({
  value,
  onChange,
  placeholder = "Selecione...",
  loadOptions,
  disabled,
}: AsyncSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<AsyncSelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  const selected = options.find((option) => option.value === value);

  async function handleSearch(search: string) {
    setQuery(search);
    setLoading(true);
    try {
      const result = await loadOptions(search);
      setOptions(result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between",
          disabled && "pointer-events-none opacity-50"
        )}
        disabled={disabled}
      >
        {selected?.label ?? placeholder}
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar..."
            value={query}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Buscando..." : "Nenhum resultado."}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
