import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { nickname: string };
};

export function generateMetadata({ params }: Props, parent: ResolvingMetadata): Metadata {
  return {
    title: `${params.nickname}'s blog - about`,
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
