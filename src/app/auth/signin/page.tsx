import SocialButton from "components/SocialButton";
import Link from "next/link";

export default function SignInPage() {
  return (
    <>
      <div className="AuthWithSocialAccount vstack gap-3">
        <SocialButton
          name="Google"
          img={"/google.png"}
          href={
            "https://accounts.google.com/o/oauth2/auth?" +
            `client_id=${process.env.NEXT_PUBLIC_GOOGLE_AUTH_ID}&` +
            `redirect_uri=${process.env.NEXT_PUBLIC_WEB_DOMAIN}/auth/signin/google&` +
            "response_type=token&" +
            "scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid"
          }
        />
        <SocialButton name="Facebook" img={"/facebook.png"} href={"/auth/signin/facebook"} />
        <SocialButton name="Email" img={"/email.png"} href={"/auth/signin/email"} />
      </div>
      <Link className="btn btn-primary col-8 offset-2 h-36px" href={"/auth/signup"} role="button">
        {"Create Account"}
      </Link>
    </>
  );
}
