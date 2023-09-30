import AboutView from "./AboutView";

export default async function AboutPage({ params: { nickname } }: { params: { nickname: string } }) {
  const { about } = await (await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/users/about/${nickname}`)).json();

  return <AboutView about={about} nickname={nickname} />;
}
