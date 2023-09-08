import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { nickname: string };
};

export function generateMetadata({ params }: Props, parent: ResolvingMetadata): Metadata {
  return {
    title: `${params.nickname}`,
  };
}

export default function AboutLayout({
  children,
  params: { nickname },
}: {
  children: React.ReactNode;
  params: { nickname: string };
}) {
  return <>{children}</>;
}
