import React from 'react';
import VideoActions from './VideoActions';

const VideoDetails = ({ 
  video, 
  isLiked, 
  isDisliked, 
  likeCount, 
  dislikeCount, 
  onLike, 
  onDislike, 
  onShare,
  isSubscribed,
  onSubscribe,
  subscribeLoading = false,
  subscriberCount,
  views,
  isMobile = false 
}) => {
  const titleSize = isMobile ? 'text-base' : 'text-xl';
  const textSize = isMobile ? 'text-sm' : 'text-base';
  const padding = isMobile ? 'p-4' : 'p-6';
  const margin = isMobile ? 'mb-4' : 'mb-6';

  return (
    <div className={`bg-gray-800 rounded-xl ${padding} ${margin}`}>
      <h1 className={`${titleSize} font-bold mb-2`}>{video.title}</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className={`text-gray-400 ${textSize}`}>{video.views} views</span>
            <span className="text-gray-400">•</span>
            <span className={`text-gray-400 ${textSize}`}>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <VideoActions
          isLiked={isLiked}
          isDisliked={isDisliked}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
          onLike={onLike}
          onDislike={onDislike}
          onShare={onShare}
          isMobile={isMobile}
          views={views}
        />
      </div>
      <div className={`flex items-center justify-between space-x-4 p-4 bg-gray-700 rounded-lg ${isMobile ? 'mb-3' : 'mb-4'}`}>
        <div className='flex items-center gap-2'>
          <img
            src={video.owner?.avatar || "https://via.placeholder.com/60"}
            alt={video.owner?.username}
            className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full`}
          />
          <div>
            <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>{video.owner?.username}</h3>
            <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>{subscriberCount} subscribers</p>
          </div>
        </div>
        <div>
          <button 
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              subscribeLoading 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : isSubscribed 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            onClick={onSubscribe}
            disabled={subscribeLoading}
          >
            {subscribeLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isSubscribed ? 'Unsubscribing...' : 'Subscribing...'}
              </div>
            ) : (
              isSubscribed ? 'Unsubscribe' : 'Subscribe'
            )}
          </button>
        </div>
      </div>
      <div className={`p-4 bg-gray-700 rounded-lg ${isMobile ? '' : 'mt-4'}`}>
        <p className={`text-gray-300 whitespace-pre-wrap ${isMobile ? 'text-sm' : 'text-base'}`}>{video.description}</p>
      </div>
    </div>
  );
};

export default VideoDetails; 