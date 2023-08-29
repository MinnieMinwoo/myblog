import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { ErrorMessage } from "enum";
import { userPool } from "logics/aws";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          resolve(
            NextResponse.json(
              {
                type: "bearer",
                accessToken: session.getAccessToken().getJwtToken(),
                refreshToken: session.getRefreshToken().getToken(),
              },
              { status: 200 }
            )
          );
        },
        onFailure: (error) => {
          console.log(error);
          resolve(NextResponse.json({ error: "Invalid user data" }, { status: 403 }));
        },
      });
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
