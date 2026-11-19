import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { Grade, Color, Style, Opinion, Wall } from "@/types";

export type BoolFilter = 1 | 0 | undefined;
export type Filter = {
  video: BoolFilter;
  complete: BoolFilter;
  flash: BoolFilter;
  favorite: BoolFilter;
  grades: Grade[];
  opinions: Opinion[];
  colors: Color[];
  walls: Wall[];
  styles: Style[];
};

const DEFAULT_FILTER: Filter = {
  video: 1,
  complete: undefined,
  flash: undefined,
  favorite: undefined,
  grades: [],
  opinions: [],
  colors: [],
  walls: [],
  styles: [],
};

type FiltersContextType = {
  filters: Filter;
  setFilters: Dispatch<SetStateAction<Filter>>;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

// Shared across pages so the filter survives navigating between gallery, metrics and climb pages
export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filter>(DEFAULT_FILTER);

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
