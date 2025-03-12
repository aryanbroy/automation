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

app.get("/auth/callback", (req, res) => {
  const { code } = req.query;

  try {
    console.log(code);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/login", (req: Request, res: Response) => {
//   const { email } = req.body;
//   if (!email) {
//     res.status(400).json({ message: "No email specified!!" });
//     return;
//   }

//   res.status(200).json({ success: true, email });
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
