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

export type EmitEvent =
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
      scrollPos: number;
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

export const useProvider = <T extends EmitEvent>() => {
  const emitter = useRef(eventmit<T>());
  const MemorizedProvider = useMemo(
    () => createEmitterProvider(emitter.current),
    []
  );
  return [emitter.current.emit, MemorizedProvider] as const;
};

export const useEmitter = <T extends EmitEvent>() => {
  const ctx = useContext(EmitterContext);
  return ctx.emit as (value: T) => void;
};

export const useSubscriber = <T extends EmitEvent>(fn: EventmitHandler<T>) => {
  const ctx = useContext(EmitterContext);
  useEffect(() => {
    ctx.on(fn);
    return () => {
      ctx.off(fn);
    };
  }, [ctx, fn]);
};
