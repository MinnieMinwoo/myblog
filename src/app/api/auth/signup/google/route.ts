import { InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { authClient } from "logics/aws";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //logging
  console.log(request);
  console.log(request.headers);

  const token = request.headers.get("authorization")?.split(" ")[1];
  console.log(token);
  const signUpCommand = new InitiateAuthCommand({
    AuthFlow: "USER_SRP_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: "test@testmail.com",
      SRP_A: token!,
    },
  });

  const result = await authClient.send(signUpCommand);

  return NextResponse.json({ text: "asdf" }, { status: 200 });
}
