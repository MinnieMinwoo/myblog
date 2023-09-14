import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import getCurrentUserData from "logics/getCurrentUserData";
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
          const randomString = uuid();
          window.open(
            `https://accounts.google.com/o/oauth2/v2/auth?` +
              `identity_provider=Google&` +
              `redirect_uri=${process.env.NEXT_PUBLIC_WEB_DOMAIN}/auth/link/google&` +
              "response_type=id_token token&" +
              `client_id=${process.env.NEXT_PUBLIC_GOOGLE_AUTH_ID}&` +
              "scope=email openid profile&" +
              `nonce=${randomString}&` +
              `state=${randomString}`,
            "Google account link",
            "width = 500, height = 500"
          );
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
            <SocialButton name="google" img={1 ? "/google.png" : "/googleGray.png"} />
            <SocialButton name="facebook" img={1 ? "/facebook.png" : "/facebookGray.png"} />
          </div>
        </span>
        <p className="mt-2 mb-0 fs-14px text-777">You can set up social login method.</p>
      </div>
    </>
  );
};

export default SocialLoginEdit;
