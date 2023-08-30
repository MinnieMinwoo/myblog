"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthWithEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    const excuteFunction = name === "email" ? setEmail : setPassword;
    excuteFunction(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userData = {
      email: email,
      password: password,
    };
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/signin/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log(result.status);
      if (result.status === 406) {
        router.push(`/auth/verification?email=${email}`);
        return;
      } else if (!result.ok) throw new Error(result.statusText);
      const { nickname, idToken, accessToken, refreshToken } = await result.json();
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("idToken", idToken);
      router.push(`/home/${nickname}`);
    } catch (error) {
      console.log(error);
      window.alert("Login Error");
    }
  };

  return (
    <div className="AuthWithEmail vstack gap-3">
      <form onSubmit={onSubmit}>
        <div className="vstack gap-3">
          <div>
            <label className="form-label">Email address</label>
            <input
              className="form-control"
              name="email"
              type="text"
              placeholder="email"
              value={email}
              required
              onChange={onChange}
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              className="form-control"
              name="password"
              type="password"
              placeholder="password"
              value={password}
              autoComplete="off"
              required
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-primary col-8 offset-2 h-36px">
            {"Sign in"}
          </button>
          <Link className="btn btn-info col-8 offset-2 h-36px" href="/auth/signin" role="button">
            {"Back"}
          </Link>
        </div>
      </form>
    </div>
  );
}
