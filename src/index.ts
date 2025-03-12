import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.post("/login", (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "No email specified!!" });
    return;
  }

  res.status(200).json({ success: true, email });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
