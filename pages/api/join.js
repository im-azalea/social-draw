import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Wallet address required" });

  try {
    const repoOwner = process.env.REPO_OWNER;
    const repoName = process.env.REPO_NAME;
    const filePath = "participants.json";

    let currentData = [];
    try {
      const response = await octokit.repos.getContent({ owner: repoOwner, repo: repoName, path: filePath });
      const content = Buffer.from(response.data.content, "base64").toString("utf8");
      currentData = JSON.parse(content);
    } catch (err) {
      console.log("Creating new participants file.");
    }

    currentData.push({ address });

    await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: filePath,
      message: "New participant",
      content: Buffer.from(JSON.stringify(currentData, null, 2)).toString("base64"),
      committer: { name: "SocialDraw Bot", email: "bot@socialdraw.com" },
      author: { name: "SocialDraw Bot", email: "bot@socialdraw.com" }
    });

    res.status(200).json({ success: true, message: "You are in the lottery!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save participant" });
  }
}
