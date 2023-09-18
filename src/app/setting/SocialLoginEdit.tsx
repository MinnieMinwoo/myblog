import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
import getCurrentUserToken from "logics/getCurrentUserToken";
import Image from "next/image";
import { v4 as uuid } from "uuid";

const SocialLoginEdit = () => {
  const { data: userData, status } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserData,
  });

  const onClick = async (event: React.MouseEvent<HTMLImageElement>) => {
    if (!(event.target instanceof HTMLImageElement)) return;
    const {
      target: { alt },
    } = event;

    try {
      switch (alt) {
        case "google":
          const googleID = userData?.identities.find((value) => value.providerType === "Google")?.userId;
          if (!googleID) {
            const randomString = uuid();
            window.localStorage.setItem("nonce", randomString);
            window.open(
              `https://accounts.google.com/o/oauth2/v2/auth?` +
                `identity_provider=Google&` +
                `redirect_uri=${process.env.NEXT_PUBLIC_WEB_DOMAIN}/auth/link/google&` +
                "response_type=id_token token&" +
                `client_id=${process.env.NEXT_PUBLIC_GOOGLE_AUTH_ID}&` +
                "scope=email openid profile&" +
                `nonce=${randomString}`,
              "Google account link",
              "width = 500, height = 500"
            );
          } else {
            if (!window.confirm("If you really want to unlink google account?")) return;
            try {
              const token = await getCurrentUserToken();
              await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/link/google`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  googleId: googleID,
                }),
              });
            } catch (error) {
              console.log(error);
              window.alert("Google account unlink failed.");
            }
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SocialButton = ({ name, img }: { name: string; img: string }) => {
    return (
      <Image
        className="img-fluid img-thumbnail ms-2 w-50px h-50px-i"
        src={img}
        alt={name}
        role="button"
        onClick={onClick}
        width={50}
        height={50}
      />
    );
  };

  return (
    <>
      <div className="SettingData px-3 py-4 bb-light">
        <h3 className="d-inline-block w-170px fs-5 text-111">Social Login</h3>
        <span className="d-inline-block float-end">
          <div className="hstack">
            <SocialButton
              name="google"
              img={
                userData?.identities.some((value) => value.providerType === "Google")
                  ? "/google.png"
                  : "/googleGray.png"
              }
            />
            <SocialButton
              name="facebook"
              img={
                userData?.identities.some((value) => value.providerType === "Facebook")
                  ? "/facebook.png"
                  : "/facebookGray.png"
              }
            />
          </div>
        </span>
        <p className="mt-2 mb-0 fs-14px text-777">You can set up social login method.</p>
      </div>
    </>
  );
};

export default SocialLoginEdit;
