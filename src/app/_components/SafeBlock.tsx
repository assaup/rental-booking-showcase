"use client";

import { ComponentType, Suspense, type ReactNode } from "react";
import { ErrorBoundary, type  FallbackProps } from "react-error-boundary";

interface Props {
  children: ReactNode;
  /** что показать, пока грузится */
  loading: ReactNode;
  /** что показать, если сломалось */
  FallbackComponent: ComponentType<FallbackProps>;
}

export function SafeBlock({ children, loading, FallbackComponent }: Props) {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <Suspense fallback={loading}>{children}</Suspense>
    </ErrorBoundary>
  );
}