import { Suspense, ReactNode } from "react";
import { TicketListSkeleton } from "./TicketListSkeleton";

interface TicketSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function TicketInfoSuspense({ children, fallback }: TicketSuspenseProps) {
  return (
    <Suspense fallback={fallback || <TicketListSkeleton />}>
      {children}
    </Suspense>
  );
}
