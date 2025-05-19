import githubApi from "../utils/githubApi.js";
import redisClient from "../utils/redisClient.js";

// Get repositories by search query
export const getRepos = async (req, res) => {
  const { q } = req.query;
  try {
    const cachedRepos = await redisClient.get(`repos:${q}`);

    if (cachedRepos) {
      console.log("Serving From Redis");
      return res.json(JSON.parse(cachedRepos));
    }
    const response = await githubApi.get(`/search/repositories?q=${q}`);
    await redisClient.setEx(`repos:${q}`, 3600, JSON.stringify(response.data));
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
};

// Get user info and repos
export const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    const userInfo = await githubApi.get(`/users/${username}`);
    const userRepos = await githubApi.get(`/users/${username}/repos`);

    res.json({
      user: userInfo.data,
      repos: userRepos.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch User" });
  }
};

//Get Owner -> repo
export const getOwnerRepo = async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const repoDetails = await githubApi.get(`/repos/${owner}/${repo}`);
    res.json(repoDetails.data);
  } catch (error) {
    console.error("GitHub API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch repository details" });
  }
};
