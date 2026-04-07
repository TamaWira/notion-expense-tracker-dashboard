"use client";

import { createContext, useContext, useState } from "react";

interface HideNumbersContextValue {
  hidden: boolean;
  toggle: () => void;
}

const HideNumbersContext = createContext<HideNumbersContextValue>({
  hidden: false,
  toggle: () => {},
});

export function HideNumbersProvider({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(true);
  return (
    <HideNumbersContext.Provider value={{ hidden, toggle: () => setHidden((h) => !h) }}>
      {children}
    </HideNumbersContext.Provider>
  );
}

export function useHideNumbers() {
  return useContext(HideNumbersContext);
}
