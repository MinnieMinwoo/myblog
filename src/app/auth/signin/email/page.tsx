"use client";

import Link from "next/link";
import { useState } from "react";
import signinEmail from "./signinEmail";

const AuthWithEmail = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const user = await signinEmail(userData);
      console.log(user);
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
          <Link href="/auth/signin">
            <button type="button" className="btn btn-info col-8 offset-2 h-36px">
              {"Back"}
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AuthWithEmail;
