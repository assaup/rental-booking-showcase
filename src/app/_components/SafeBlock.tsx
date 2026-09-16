"use client";

import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  children: ReactNode;
  /** что показать, пока грузится */
  loading: ReactNode;
  /** что показать, если сломалось */
  fallback: ReactNode;
}

export function SafeBlock({ children, loading, fallback }: Props) {
  return (
    <ErrorBoundary fallback={fallback}>
      <Suspense fallback={loading}>{children}</Suspense>
    </ErrorBoundary>
  );
}