import * as dotenv from "dotenv";

dotenv.config();

import express, { Request, Response } from "express";
import { Credentials } from "google-auth-library";
import { google } from "googleapis";
import { sendMail } from "./gmail/mailFunc";
const { OAuth2 } = google.auth;

const app = express();
const port = 3000;

app.use(express.json());

const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

let oAuth2Tokens: Credentials;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.get("/auth", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
  });
  res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  try {
    if (!code) {
      res.status(400).send("No code received");
      return;
    }
    const { tokens } = await oAuth2Client.getToken(code.toString());
    console.log(tokens);
    oAuth2Client.setCredentials(tokens);
    oAuth2Tokens = tokens;
    res.send("Authentication successful! You can now send emails.");
    const data = await sendMail(tokens);
    console.log(data);
    // const data = await getUserInfo(tokens);
    // console.log(data);
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

// app.get("/send-email", async (req, res) => {
//   try {
//     if (!oAuth2Tokens) {
//       res.status(500).send("Authentication required, no tokens found");
//       return;
//     }

//     if (!oAuth2Tokens.access_token) {
//       res.status(400).send("Authentication required");
//       return;
//     }

//     // oAuth2Client.setCredentials(oAuth2Tokens);
//     const response = await fetch(
//       "https://gmail.googleapis.com/gmail/v1/users/me/profile",
//       {
//         headers: {
//           Authorization: `Bearer ${oAuth2Tokens.access_token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       const err = response.json();
//       console.log("Error fetching user's profile, ", error);
//       res.status(400).send("error fetching user details");
//     }

//     const data = await response.json();
//     // console.log("User: ", data);
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error getting tokens:", error);
//     res.status(500).send("Internal server error, failed to send email");
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
