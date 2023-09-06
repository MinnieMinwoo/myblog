"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import revalidateToken from "logics/revalidateToken";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default Providers;
