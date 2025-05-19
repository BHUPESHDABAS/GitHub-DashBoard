import express from "express";
const router = express.Router();
import {getRepos, getUser, getOwnerRepo} from "../controllers/github.js";

router.get('/search/repos', getRepos);
router.get('/user/:username', getUser);
router.get('/repo/:owner/:repo', getOwnerRepo);

export default router;