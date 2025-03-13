import * as dotenv from "dotenv";

dotenv.config();

import express, { Request, Response } from "express";
import { google } from "googleapis";
const { OAuth2 } = google.auth;

const app = express();
const port = 3000;

app.use(express.json());

// const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

let oAuth2Tokens = {};

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.get("/auth", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
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
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

// app.post("/send-email", async (req, res) => {
//   try {
//   } catch (error) { }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
