import React from "react";
import { eventmit, EventmitHandler } from "eventmit";
import { Target } from "../types";

const { useRef, useContext, useEffect, useMemo } = React;
const EmitterContext = React.createContext(eventmit());
const { Provider } = EmitterContext;

const createEmitterProvider = (subscription: ReturnType<typeof eventmit>) => ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Provider value={subscription}>{children}</Provider>;
};

type Event =
  | {
      type: "insert";
      text: string;
    }
  | {
      type: "remove";
      text: string;
    }
  | {
      type: "scroll";
      target: Target | null;
      scrollDiff: number;
      scrollPercent: number;
    }
  | {
      type: "replace";
      text: string;
      targetText: string;
    }
  | {
      type: "undo";
    }
  | {
      type: "redo";
    };

export const useProvider = <T extends Event>() => {
  const emitter = useRef(eventmit<T>());
  const MemorizedProvider = useMemo(
    () => createEmitterProvider(emitter.current),
    []
  );
  return [emitter.current.emit, MemorizedProvider] as const;
};

export const useEmitter = <T extends Event>() => {
  const ctx = useContext(EmitterContext);
  return ctx.emit as (value: T) => void;
};

export const useSubscriber = <T extends Event>(fn: EventmitHandler<T>) => {
  const ctx = useContext(EmitterContext);
  useEffect(() => {
    ctx.on(fn);
    return () => {
      ctx.off(fn);
    };
  }, [ctx, fn]);
};
