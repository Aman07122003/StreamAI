import React from "react";
import { FiThumbsUp, FiThumbsDown, FiShare2 } from 'react-icons/fi';

const VideoActions = ({ 
  isLiked, 
  isDisliked, 
  likeCount, 
  dislikeCount, 
  onLike, 
  onDislike, 
  onShare,
  views,
  isMobile = false 
}) => {
  const buttonSize = isMobile ? 'text-sm' : 'text-base';
  const iconSize = isMobile ? 'w-3 h-3' : 'w-4 h-4';
  const padding = isMobile ? 'px-2 py-1' : 'px-3 py-2';

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onLike}
        className={`flex items-center space-x-1 ${padding} rounded-lg transition-colors ${buttonSize} ${
          isLiked ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <FiThumbsUp className={iconSize} />
        <span>{likeCount}</span>
      </button>
      <button
        onClick={onDislike}
        className={`flex items-center space-x-1 ${padding} rounded-lg transition-colors ${buttonSize} ${
          isDisliked ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <FiThumbsDown className={iconSize} />
        <span>{dislikeCount}</span>
      </button>
      <button
        onClick={onShare}
        className={`flex items-center space-x-1 ${padding} bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors ${buttonSize}`}
      >
        <FiShare2 className={iconSize} />
        {!isMobile && <span>Share</span>}
      </button>
    </div>
  );
};

export default VideoActions; 