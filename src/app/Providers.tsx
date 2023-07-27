"use client";

import { Amplify } from "aws-amplify";
import awsmobile from "../aws-exports";

const Providers = ({ children }: { children: React.ReactNode }) => {
  Amplify.configure(awsmobile);

  return <>{children}</>;
};

export default Providers;
