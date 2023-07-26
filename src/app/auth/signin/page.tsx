import SocialButton from "components/SocialButton";
import type { Metadata } from "next";
import Link from "next/link";

export default function SignInPage() {
  return (
    <>
      <div className="AuthWithSocialAccount vstack gap-3">
        <SocialButton name="Google" img={"/google.png"} href={"/auth/signin/google"} />
        <SocialButton name="Facebook" img={"/facebook.png"} href={"/auth/signin/facebook"} />
        <SocialButton name="Email" img={"/email.png"} href={"/auth/signin/email"} />
      </div>
      <Link href={"/auth/signup"}>
        <button className="btn btn-primary col-8 offset-2 h-36px">{"Create Account"}</button>
      </Link>
    </>
  );
}
