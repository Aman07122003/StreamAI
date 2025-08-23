import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels, getSubscriberCount } from "../api/subscription.api";
import { toggleLike, getLikedVideos, getVideoLikeStats } from "../api/likes.api";
import {
  VideoHeader,
  VideoPlayer,
  VideoDetails,
  RelatedVideos,
  CommentSection
} from '../components/VideoPlayer';
import axios from 'axios';

const Videoplayer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoId = searchParams.get('v');
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showRelatedVideos, setShowRelatedVideos] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  useEffect(() => {
    if (videoId) {
      fetchVideoData();
      fetchComments();
      fetchRelatedVideos();
      fetchLikeStats();
    }
  }, [videoId]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/videos/${videoId}`);
      console.log(response.data.data);
      setVideo(response.data.data);
      setLikeCount(response.data.data.likes || 0);
      setDislikeCount(response.data.data.dislikes || 0);
      setIsSubscribed(response.data.data.isSubscribed || false);
    } catch (err) {
      setError('Failed to load video');
      console.error('Error fetching video:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comment/get/${videoId}`);
      const validComments = (response.data.comments || []).filter(c => c && c.content);
      setComments(validComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };
  

  const fetchRelatedVideos = async () => {
    try {
      const response = await axiosInstance.get('/videos?limit=10');
      setRelatedVideos(response.data.data || []);
    } catch (err) {
      console.error('Error fetching related videos:', err);
    }
  };

  const incrementView = async (videoId) => {
    try {
      await axiosInstance.patch(`/videos/view/${videoId}`);
    } catch (err) {
      console.error('Error incrementing view:', err);
    }
  };

  const hasIncrementedView = useRef(false);

  useEffect(() => {
    if (videoId && !hasIncrementedView.current) {
      incrementView(videoId);
      hasIncrementedView.current = true;
    }
  }, [videoId]);
  

  // Fetch like/dislike stats and user state
  const fetchLikeStats = async () => {
    try {
      const res = await getVideoLikeStats(videoId);
      const stats = res.data;
      setLikeCount(stats.likeCount || 0);
      setDislikeCount(stats.dislikeCount || 0);
      setIsLiked(!!stats.isLiked);
      setIsDisliked(!!stats.isDisliked);
    } catch (err) {
    }
  };

  // Like handler
  const handleLike = async () => {
    try {
      await toggleLike(videoId, 'like');
      await fetchLikeStats();
    } catch (err) {
      console.error('Error handling like:', err);
    }
  };

  // Dislike handler
  const handleDislike = async () => {
    try {
      await toggleLike(videoId, 'dislike');
      await fetchLikeStats();
    } catch (err) {
      console.error('Error handling dislike:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    try {
      const response = await axiosInstance.post(`/comment/add/${videoId}`, {
        content: newComment
      });
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err.response?.data || err.message);
      toast.error('Failed to add comment');
    }
  };
  
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleSubscribe = async () => {
    if (!video?.owner?._id) {
      console.error('No channel ID found');
      return;
    }

    try {
      setSubscribeLoading(true);
      const response = await toggleSubscription(video.owner._id);
      setIsSubscribed(response.data.isSubscribed);
      await fetchsubscriberCount();
    } catch (err) {
      console.error('Error subscribing:', err);
      // You could add a toast notification here for better UX
    } finally {
      setSubscribeLoading(false);
    }
  };

  const fetchsubscriberCount = async () => {
    try {
      const response = await getSubscriberCount(video.owner._id);
      setSubscriberCount(response.data.count);
    } catch (err) {
      console.error('Error fetching subscriber count:', err);
   }
  }
  useEffect(() => {
    if (video && video.owner?._id) {
      fetchsubscriberCount();
    }
  }, [video]);
  

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleToggleRelatedVideos = () => {
    setShowRelatedVideos(!showRelatedVideos);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Video not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <VideoHeader />

      <div className="pt-10 w-full">
        <div className="block lg:hidden">
          <div className="px-2 sm:px-4">
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg">
              <VideoPlayer key={video?._id || video?.videoFile} video={video} />
            </div>
            <div className="flex flex-col gap-6 py-6">
              <VideoDetails
                video={video}
                isLiked={isLiked}
                isDisliked={isDisliked}
                likeCount={likeCount}
                dislikeCount={dislikeCount}
                onLike={handleLike}
                onDislike={handleDislike}
                onShare={handleShare}
                isSubscribed={isSubscribed}
                onSubscribe={handleSubscribe}
                subscribeLoading={subscribeLoading}
                subscriberCount={subscriberCount}
                views={video.views}
                isMobile={true}
              />
              <CommentSection 
                videoId={videoId} 
                isMobile={true}
              />
              <RelatedVideos
                relatedVideos={relatedVideos}
                currentVideoId={videoId}
                isMobile={true}
                showRelatedVideos={showRelatedVideos}
                onToggleRelatedVideos={handleToggleRelatedVideos}
              />
            </div>
          </div>
        </div>

        <div className="hidden w-full lg:flex lg:px-6 lg:py-10 gap-10">
          <div className="w-full lg:w-[100%] flex flex-col gap-2">
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl">
              <VideoPlayer key={video?._id || video?.videoFile} video={video} />
            </div>
            <VideoDetails
              video={video}
              isLiked={isLiked}
              isDisliked={isDisliked}
              likeCount={likeCount}
              dislikeCount={dislikeCount}
              onLike={handleLike}
              onDislike={handleDislike}
              onShare={handleShare}
              isSubscribed={isSubscribed}
              onSubscribe={handleSubscribe}
              views={video.views}
              subscriberCount={subscriberCount}
            />
            <div className='w-full'><CommentSection videoId={videoId} /></div>
          </div>
          {/* Insert this here */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            <RelatedVideos 
              relatedVideos={relatedVideos} 
              currentVideoId={videoId} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videoplayer;