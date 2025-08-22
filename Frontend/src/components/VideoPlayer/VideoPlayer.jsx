import React from 'react';

const VideoPlayer = ({ video }) => {
  return (
    <div className="bg-black rounded-xl overflow-hidden aspect-video">
      <video
        key={video.videoFile} // This forces remount on video change
        src={video.videoFile}
        poster={video.thumbnail}
        controls
        className="w-full h-full mt-10"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
