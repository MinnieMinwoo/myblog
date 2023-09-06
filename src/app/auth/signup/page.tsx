import SocialButton from "components/SocialButton";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      <div className="AuthWithSocialAccount vstack gap-3">
        <SocialButton name="Google" img={"/google.png"} href={"/auth/signup/google"} />
        <SocialButton name="Facebook" img={"/facebook.png"} href={"/auth/signup/facebook"} />
        <SocialButton name="Email" img={"/email.png"} href={"/auth/signup/email"} />
      </div>
      <Link className="btn btn-primary col-8 offset-2 h-36px" href={"/auth/signin"} role="button">
        {"Sign in"}
      </Link>
    </>
  );
}
