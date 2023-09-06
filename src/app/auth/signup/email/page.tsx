"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthWithEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    const excuteFunction =
      name === "email" ? setEmail : name === "password" ? setPassword : name === "nickname" ? setNickname : () => {};
    excuteFunction(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userData = {
      email: email,
      password: password,
      nickname: nickname,
    };
    try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/signup/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!result.ok) {
        const { error } = await result.json();
        throw new Error(error);
      } else router.push(`/auth/verification?email=${email}`);
    } catch (error) {
      console.log(error);
      window.alert("Sign up Error");
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
          <div>
            <label className="form-label">Nickname</label>
            <input
              className="form-control"
              name="nickname"
              type="text"
              placeholder="4-20 digits of English, numbers and special characters"
              value={nickname}
              autoComplete="off"
              required
              onChange={onChange}
            />
          </div>
          <button type="submit" className="btn btn-primary col-8 offset-2 h-36px">
            {"Create Account"}
          </button>
          <Link className="btn btn-info col-8 offset-2 h-36px" href="/auth/signup" role="button">
            {"Back"}
          </Link>
        </div>
      </form>
    </div>
  );
}
