import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleLike,
  getLikedVideos,
  getVideoLikeStats,
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

// http://localhost:3000/api/v1/like/...
// All PATCH routes expect ?toggleLike=true|false in the query string

router.route("/").patch(toggleLike); // Handles like/dislike for commentId, videoId, or tweetId via query
router.route("/videos").get(getLikedVideos);

// Public route to get total likes/dislikes for a video
router.route("/video/:videoId/stats").get(getVideoLikeStats);

// Deprecated or redundant routes below (handled by the above):
// router.route("/comment/:commentId").patch(toggleLike);
// router.route("/tweet/:tweetId").patch(toggleLike);
// router.route("/video/:videoId").patch(toggleLike);
// router.route("/video/:videoId/like").patch(toggleLike);
// router.route("/video/:videoId/dislike").patch(toggleLike);

// TODO: Implement getLikes/getDislikes if needed
// router.route("/likes").get(getLikes); 
// router.route("/dislikes").get(getDislikes);

export default router;