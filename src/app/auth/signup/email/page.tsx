"use client";

import { useState } from "react";

const AuthWithEmail = ({ signIn }: { signIn: boolean }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    console.log(name);
    const excuteFunction =
      name === "email" ? setEmail : name === "password" ? setPassword : name === "nickname" ? setNickname : () => {};
    excuteFunction(value);
  };

  const onSubmit = () => {};

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
          {signIn ? null : (
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
          )}
          <button type="submit" className="btn btn-primary col-8 offset-2 h-36px">
            {"Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthWithEmail;
