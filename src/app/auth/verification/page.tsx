"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerificationPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
      history.pushState({ data: { email: emailParam } }, "Email Verification", "/auth/verification");
    } else if (history.state.email !== undefined) {
      const {
        state: { email: historyEmail },
      } = history;
      setEmail(historyEmail);
      history.pushState({ data: { email: historyEmail } }, "Email Verification", "/auth/verification");
    } else router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setCode(value);
  };

  const onResend = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/confirm?email=${email}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.alert("The verification code has been sent.");
    } catch (error) {
      console.log(error);
      window.alert("Some error has occurred");
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          verificationCode: code,
        }),
      });
      if (!result.ok) throw new Error(result.statusText);
      window.alert("Verification success. Please sign in again.");
      router.push("/");
    } catch (error) {
      console.log(error);
      window.alert("Code verification failed");
    }
  };

  return (
    <>
      {email ? (
        <form onSubmit={onSubmit}>
          <div className="vstack gap-3">
            <div>
              <label className="form-label" htmlFor="verify-code">
                Enter verification code
              </label>
              <input
                id="verify-code"
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
            <Link href="/auth/signin" role="button" className="btn btn-info col-8 offset-2 h-36px">
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
}
