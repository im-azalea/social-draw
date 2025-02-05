// pages/api/drawWinner.js
import { Octokit } from "@octokit/rest";

// Inisialisasi Octokit dengan token GitHub dari environment variable
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const owner = process.env.REPO_OWNER;
  const repo = process.env.REPO_NAME;
  const path = "participants.json";

  try {
    // Ambil file participants.json
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    const sha = data.sha;
    const decodedContent = Buffer.from(data.content, 'base64').toString('utf8');
    const participants = JSON.parse(decodedContent);

    if (participants.length === 0) {
      return res.status(400).json({ message: "No participants found" });
    }

    // Pilih pemenang secara acak
    const randomIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[randomIndex];

    return res.status(200).json({ message: "Winner drawn", winner });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving participants" });
  }
}
