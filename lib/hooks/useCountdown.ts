import { useEffect, useState } from "react";
import { WEDDING_DATE, getCountdown } from "@/lib/utils/date";

/** Cuenta regresiva hasta la boda que se actualiza cada `intervalMs`. Solo para componentes cliente. */
export function useCountdown(intervalMs = 1000) {
  const [countdown, setCountdown] = useState(() => getCountdown(WEDDING_DATE));

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown(WEDDING_DATE)), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return countdown;
}
