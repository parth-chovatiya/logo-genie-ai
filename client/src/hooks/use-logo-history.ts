import { useCallback, useEffect, useState } from "react";
import type {
  GeneratedLogo,
  LogoGenerationRequest,
} from "@shared/schema";

export interface HistoryEntry {
  id: string;
  request: LogoGenerationRequest;
  logos: GeneratedLogo[];
  createdAt: number;
}

const STORAGE_KEY = "logogenie:history";
const MAX_ENTRIES = 10;

const readHistory = (): HistoryEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
};

const writeHistory = (entries: HistoryEntry[]): void => {
  if (typeof window === "undefined") return;
  // base64 images are large; drop oldest entries until it fits the quota.
  let pending = entries.slice(0, MAX_ENTRIES);
  while (pending.length > 0) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
      return;
    } catch {
      pending = pending.slice(0, pending.length - 1);
    }
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const useLogoHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const addEntry = useCallback(
    (request: LogoGenerationRequest, logos: GeneratedLogo[]) => {
      setHistory((prev) => {
        const entry: HistoryEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          request,
          logos,
          createdAt: Date.now(),
        };
        const next = [entry, ...prev].slice(0, MAX_ENTRIES);
        writeHistory(next);
        return next;
      });
    },
    [],
  );

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      writeHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    writeHistory([]);
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
};
