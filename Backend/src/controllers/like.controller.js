import { APIResponse } from "../utils/APIResponse.js";
import { APIError } from "../utils/APIError.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// TODO: Review and Enhance all controllers

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        video: { $ne: null },
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$owner",
          },
        ],
      },
    },
    {
      $unwind: "$video",
    },
    {
      $match: {
        "video.isPublished": true,
      },
    },
    {
      $group: {
        _id: "likedBy",
        videos: { $push: "$video" },
      },
    },
  ]);

  const videos = likedVideos[0]?.videos || [];

  return res
    .status(200)
    .json(new APIResponse(200, videos, "videos sent successfully"));
});

// Helper to validate and fetch target
const getTargetAndType = async ({ commentId, videoId, tweetId }) => {
  if (commentId) {
    if (!isValidObjectId(commentId)) throw new APIError(400, "Invalid commentId");
    const comment = await Comment.findById(commentId);
    if (!comment) throw new APIError(400, "No comment found");
    return { type: "comment", id: commentId };
  }
  if (videoId) {
    if (!isValidObjectId(videoId)) throw new APIError(400, "Invalid videoId");
    const video = await Video.findById(videoId);
    if (!video) throw new APIError(400, "No video found");
    return { type: "video", id: videoId };
  }
  if (tweetId) {
    if (!isValidObjectId(tweetId)) throw new APIError(400, "Invalid tweetId");
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new APIError(400, "No tweet found");
    return { type: "tweet", id: tweetId };
  }
  throw new APIError(400, "No target id provided");
};

const toggleLike = asyncHandler(async (req, res) => {
  const { toggleLike, commentId, videoId, tweetId } = req.query;
  if (toggleLike !== "true" && toggleLike !== "false") {
    throw new APIError(400, "Invalid query string!!!");
  }
  const reqLike = toggleLike === "true";
  const { type, id } = await getTargetAndType({ commentId, videoId, tweetId });

  // Build query for Like
  const likeQuery = { [type]: id, likedBy: req.user?._id };
  let userLike = await Like.findOne(likeQuery);

  let isLiked = false;
  let isDisLiked = false;

  if (userLike) {
    if (userLike.liked) {
      if (reqLike) {
        await Like.findByIdAndDelete(userLike._id);
        isLiked = false;
        isDisLiked = false;
      } else {
        userLike.liked = false;
        let resLike = await userLike.save();
        if (!resLike) throw new APIError(500, "error while updating like");
        isLiked = false;
        isDisLiked = true;
      }
    } else {
      if (reqLike) {
        userLike.liked = true;
        let resLike = await userLike.save();
        if (!resLike) throw new APIError(500, "error while updating like");
        isLiked = true;
        isDisLiked = false;
      } else {
        await Like.findByIdAndDelete(userLike._id);
        isLiked = false;
        isDisLiked = false;
      }
    }
  } else {
    // entry is not present so create new
    let like = await Like.create({
      [type]: id,
      likedBy: req.user?._id,
      liked: reqLike,
    });
    if (!like) throw new APIError(500, "error while toggling like");
    isLiked = reqLike;
    isDisLiked = !reqLike;
  }

  // Use countDocuments for performance
  let totalLikes = await Like.countDocuments({ [type]: id, liked: true });
  let totalDisLikes = await Like.countDocuments({ [type]: id, liked: false });

  return res.status(200).json(
    new APIResponse(
      200,
      {
        isLiked,
        totalLikes,
        isDisLiked,
        totalDisLikes,
      },
      "Like toggled successfully"
    )
  );
});

// Get total likes and dislikes for a video
const getVideoLikeStats = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new APIError(400, "Invalid videoId");

  const totalLikes = await Like.countDocuments({ video: videoId, liked: true });
  const totalDisLikes = await Like.countDocuments({ video: videoId, liked: false });

  return res.status(200).json(
    new APIResponse(200, { totalLikes, totalDisLikes }, "Video like stats fetched successfully")
  );
});

// Deprecated Controllers (use toggleLike instead)
// ------------------------------------------------
// These are kept for reference and should not be used. Remove in future.
//
// const toggleVideoLike = ...
// const toggleCommentLike = ...
// const toggleTweetLike = ...

export {
  getLikedVideos,
  toggleLike,
  getVideoLikeStats,
};