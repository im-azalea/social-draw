// pages/api/joinLottery.js
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { address } = req.body;
  if (!address) {
    res.status(400).json({ message: "Missing address" });
    return;
  }

  const owner = process.env.REPO_OWNER;
  const repo = process.env.REPO_NAME;
  const path = "participants.json";

  try {
    let sha;
    let contentArray = [];
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      sha = data.sha;
      const decodedContent = Buffer.from(data.content, 'base64').toString('utf8');
      contentArray = JSON.parse(decodedContent);
    } catch (error) {
      contentArray = [];
    }

    if (!contentArray.includes(address)) {
      contentArray.push(address);
    }

    const updatedContent = Buffer.from(JSON.stringify(contentArray, null, 2)).toString('base64');
    const commitMessage = `Add participant ${address}`;

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: commitMessage,
      content: updatedContent,
      sha,
    });

    res.status(200).json({ message: "Participant added successfully", participants: contentArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating participants" });
  }
}
