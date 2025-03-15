import { Credentials, OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

export const getUserInfo = async (tokens: Credentials) => {
  console.log("fetching user information");
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/profile",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error getting user details!!");
  }

  const data = response.json();
  console.log("successfully fetched user info");
  return data;
};

export const sendMail = async (tokens: Credentials) => {
  console.log("sending mail...");
  const rawMessage = makeBody(
    "aryanbroy003@gmail.com",
    "aryanbroy003@gmail.com",
    "Test",
    "Testing message"
  );
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        raw: rawMessage,
      }),
    }
  );

  if (!response.ok) {
    const errData = await response.json();
    console.error("Failed to send email:", errData);
    throw new Error(`Failed to send email: ${errData.error.message}`);
  }
  const data = await response.json();
  console.log("Email sent successfully:", data);
  return data;
};

const makeBody = (
  to: string,
  from: string,
  subject: string,
  message: string
) => {
  const emailLines = [
    `To : ${to}`,
    `From : ${from}`,
    `Subject : ${subject}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    "",
    message,
  ];

  const email = emailLines.join("\r\n").trim();
  const base64Email = Buffer.from(email).toString("base64");
  return base64Email;
};
