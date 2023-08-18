"use client";

import { Amplify } from "aws-amplify";
import awsmobile from "../aws-exports";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers = ({ children }: { children: React.ReactNode }) => {
  Amplify.configure(awsmobile);
  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default Providers;
