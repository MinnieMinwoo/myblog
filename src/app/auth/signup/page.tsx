import SocialButton from "components/SocialButton";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "myBlog login",
  description: "lo",
};

export default function SignUpPage() {
  return (
    <>
      <div className="AuthWithSocialAccount vstack gap-3">
        <SocialButton name="Google" img={"/google.png"} href={"/auth/signup/google"} />
        <SocialButton name="Facebook" img={"/facebook.png"} href={"/auth/signup/facebook"} />
        <SocialButton name="Email" img={"/email.png"} href={"/auth/signup/email"} />
      </div>
      <Link href={"/auth/signin"}>
        <button className="btn btn-primary col-8 offset-2 h-36px">{"Sign in"}</button>
      </Link>
    </>
  );
}
