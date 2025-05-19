import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

console.log("token:", process.env.GITHUB_TOKEN + "xabycdz")
const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
    }
});

export default githubApi;