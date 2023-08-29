import { NextResponse } from "next/server";
import { ErrorMessage } from "enum";
import { CognitoRefreshToken, CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { userPool } from "logics/aws";

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    const cognitoUser = new CognitoUser({ Username: "", Pool: userPool }); //it works without username
    const cognitoRefreshToken = new CognitoRefreshToken({ RefreshToken: refreshToken });
    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(cognitoRefreshToken, (error, session: CognitoUserSession) => {
        if (error) {
          console.log(error);
          resolve(NextResponse.json({ error: ErrorMessage.TOKEN_CONTAMINATED }, { status: 403 }));
        } else
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
      });
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: ErrorMessage.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
