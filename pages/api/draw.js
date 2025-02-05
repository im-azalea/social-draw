import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const repoOwner = process.env.REPO_OWNER;
    const repoName = process.env.REPO_NAME;
    const filePath = "participants.json";

    const response = await octokit.repos.getContent({ owner: repoOwner, repo: repoName, path: filePath });
    const content = Buffer.from(response.data.content, "base64").toString("utf8");
    const participants = JSON.parse(content);

    if (participants.length === 0) return res.status(400).json({ error: "No participants" });

    const winner = participants[Math.floor(Math.random() * participants.length)];
    res.status(200).json({ winner });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to draw winner" });
  }
}
