import Image from "next/image";
import Link from "next/link";

const SocialButton = ({ name, img, href }: { name: string; img: string; href: string }) => {
  return (
    <Link href={href}>
      <button className="btn btn-light w-100 text-start" value={name}>
        <Image className="img-fluid offset-1 me-4" src={img} alt={name} width={40} height={40} />
        <span className="fw-semibold fs-6 text-333">{`Continue with ${name}`}</span>
      </button>
    </Link>
  );
};

export default SocialButton;
