"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BootstrapProvider from "./BootstrapProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <>
      <BootstrapProvider />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

export default Providers;
