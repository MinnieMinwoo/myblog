"use client";

import Link from "next/link";
import { useState } from "react";
import signupEmail from "./signupEmail";
import { useRouter } from "next/navigation";

export default function AuthWithEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    const excuteFunction =
      name === "email"
        ? setEmail
        : name === "password"
        ? setPassword
        : name === "name"
        ? setName
        : name === "nickname"
        ? setNickname
        : () => {};
    excuteFunction(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userData = {
      email: email,
      password: password,
      name: name,
      nickname: nickname,
      picture: "",
    };
    try {
      await signupEmail(userData);
      router.push(`/auth/verification?email=${email}`);
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
            <label className="form-label">Name</label>
            <input
              className="form-control"
              name="name"
              type="text"
              value={name}
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
