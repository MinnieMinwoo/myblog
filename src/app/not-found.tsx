import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "myblog - 404",
  description: "Page not found",
};

export default function NotFoundLayout() {
  return (
    <div className="NotFound position-absolute w-100 top-50 translate-middle-y">
      <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xxl-4 offset-xxl-4 d-flex justify-content-center align-items-center flex-column">
        <Image className="img-fluid" src={"/404.jpg"} alt="Not found" width={1000} height={1000} />
        <h1 className="text-center">Page Not Found</h1>
        <Link className="btn btn-warning mt-2" href="/">
          Go Home
        </Link>
      </div>
    </div>
  );
}
