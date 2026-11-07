import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { readPersistentValue, writePersistentValue } from "../lib/storage";

export function usePersistentState<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(() =>
    readPersistentValue(key, fallback, validate),
  );

  useEffect(() => {
    writePersistentValue(key, value);
  }, [key, value]);

  return [value, setValue];
}
