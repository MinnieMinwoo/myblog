"use client";

import { Auth } from "aws-amplify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import resendCode from "./resendCode";
import verifyEmail from "./verifyEmail";

const VerificationPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    Auth.currentUserInfo().then((userData) => {
      // userData is empty object when user is invalid
      if (!userData || Object.keys(userData).length === 0) router.push("/");
      else {
        const {
          attributes: { email, email_verified },
        } = userData;
        if (email_verified) router.push("/");
        else setEmail(email);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setCode(value);
  };

  const onResend = async () => {
    try {
      await resendCode(email);
      window.alert("The verification code has been sent.");
    } catch (error) {
      console.log(error);
      window.alert("Some error has occurred");
    }
  };

  const onSubmit = async () => {
    try {
      await verifyEmail(email, code);
      router.push("/");
    } catch (error) {
      console.log(error);
      window.alert("Code verification failed");
      window.alert(error);
    }
  };

  return (
    <>
      {email ? (
        <form onSubmit={onSubmit}>
          <div className="vstack gap-3">
            <div>
              <label className="form-label">Enter verification code</label>
              <input
                className="form-control"
                type="text"
                placeholder="verification code"
                value={code}
                required
                onChange={onChange}
              />
            </div>
            <button type="submit" className="btn btn-primary col-8 offset-2 h-36px">
              {"Verify"}
            </button>
            <button type="button" className="btn btn-secondary col-8 offset-2 h-36px" onClick={onResend}>
              {"Resend code"}
            </button>
            <Link href="/signin" role="button" className="btn btn-info col-8 offset-2 h-36px">
              {"Back"}
            </Link>
          </div>
        </form>
      ) : (
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </>
  );
};

export default VerificationPage;
