import SocialButton from "components/SocialButton";
import Link from "next/link";

// https://<YOUR_DOMAIN>.auth.<REGION>.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=<REDIRECT_URI>&response_type=TOKEN&client_id=<CLIENT_ID>&scope=openid

export default function SignUpPage() {
  return (
    <>
      <div className="AuthWithSocialAccount vstack gap-3">
        <SocialButton
          name="Google"
          img={"/google.png"}
          href={
            `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize?` +
            `identity_provider=Google&` +
            `redirect_uri=${process.env.NEXT_PUBLIC_WEB_DOMAIN}/auth/signup/google/&` +
            "response_type=TOKEN&" +
            `client_id=${process.env.COGNITO_CLIENT_ID}&` +
            "scope=email+openid+profile"
          }
        />
        <SocialButton name="Facebook" img={"/facebook.png"} href={"/auth/signup/facebook"} />
        <SocialButton name="Email" img={"/email.png"} href={"/auth/signup/email"} />
      </div>
      <Link className="btn btn-primary col-8 offset-2 h-36px" href={"/auth/signin"} role="button">
        {"Sign in"}
      </Link>
    </>
  );
}
