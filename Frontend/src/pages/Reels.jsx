import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaHeart, FaRegHeart, FaCommentDots, FaShare, FaMusic } from 'react-icons/fa';
import { HiOutlineChevronUp, HiOutlineChevronDown } from 'react-icons/hi';

const mockVideos = [
  {
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    username: 'user1',
    caption: 'Check out this awesome video! #fun #shorts',
    likeCount: 123,
    commentCount: 12,
    music: 'Cool Song - Artist',
    hashtags: ['#fun', '#shorts'],
    isFollowing: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    username: 'user2',
    caption: 'Another cool moment! #wow #music',
    likeCount: 456,
    commentCount: 34,
    music: 'Another Song - DJ',
    hashtags: ['#wow', '#music'],
    isFollowing: true,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    username: 'user3',
    caption: 'Don’t miss this! #amazing',
    likeCount: 789,
    commentCount: 56,
    music: 'Amazing Track - Singer',
    hashtags: ['#amazing'],
    isFollowing: false,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
];

const EASING = [0.22, 1, 0.36, 1];

const NeonButton = ({ children, className, ...props }) => (
  <button
    className={`rounded-full shadow-lg bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white p-3 hover:scale-110 transition-transform duration-200 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Reels = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [followed, setFollowed] = useState(mockVideos.map((v) => v.isFollowing));
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState(mockVideos.map((v) => v.likeCount));
  const [liked, setLiked] = useState(mockVideos.map(() => false));
  const [showHeart, setShowHeart] = useState(false);
  const [showProfile, setShowProfile] = useState(null);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const touchStartY = useRef(null);
  const touchCurrentY = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartTime = useRef(null);

  // Only play the current video
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === current) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
    setProgress(0);
  }, [current]);

  // Update progress bar with actual video progress
  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    } else {
      setProgress(0);
    }
  };

  // Wheel navigation (desktop)
  const handleWheel = (e) => {
    if (transitioning || isDragging) return;
    if (e.deltaY > 30 && current < mockVideos.length - 1) {
      setTransitioning(true);
      setCurrent((prev) => prev + 1);
      setTimeout(() => setTransitioning(false), 400);
    } else if (e.deltaY < -30 && current > 0) {
      setTransitioning(true);
      setCurrent((prev) => prev - 1);
      setTimeout(() => setTransitioning(false), 400);
    }
  };

  // Touch swipe navigation (mobile) with inertia
  const handleTouchStart = (e) => {
    if (transitioning) return;
    setIsDragging(true);
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    dragStartTime.current = Date.now();
  };
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    touchCurrentY.current = e.touches[0].clientY;
    setDragOffset(touchCurrentY.current - touchStartY.current);
  };
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = touchStartY.current - touchCurrentY.current;
    const duration = Date.now() - dragStartTime.current;
    const velocity = Math.abs(diff / duration);
    if ((diff > 50 || (diff > 20 && velocity > 0.5)) && current < mockVideos.length - 1) {
      setTransitioning(true);
      setCurrent((prev) => prev + 1);
      setTimeout(() => setTransitioning(false), 400);
    } else if ((diff < -50 || (diff < -20 && velocity > 0.5)) && current > 0) {
      setTransitioning(true);
      setCurrent((prev) => prev - 1);
      setTimeout(() => setTransitioning(false), 400);
    }
    setDragOffset(0);
  };

  // Toggle follow
  const handleFollow = (idx) => {
    setFollowed((prev) => prev.map((f, i) => (i === idx ? !f : f)));
  };

  // Clickable hashtag handler (for demo)
  const handleHashtagClick = useCallback((tag) => {
    alert(`Clicked hashtag: ${tag}`);
  }, []);

  // Double-tap to like
  let lastTap = useRef(0);
  const handleVideoTap = (idx) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap detected
      if (!liked[idx]) {
        setShowHeart(true);
        setLiked((prev) => prev.map((l, i) => (i === idx ? true : l)));
        setLikes((prev) => prev.map((l, i) => (i === idx ? l + 1 : l)));
        setTimeout(() => setShowHeart(false), 800);
      }
    }
    lastTap.current = now;
  };

  // Profile popover
  const handleProfileEnter = (idx) => setShowProfile(idx);
  const handleProfileLeave = () => setShowProfile(null);

  // Parallax/scale effect
  const getScale = (idx) => (idx === current ? 1 : 0.92);

  // Next/prev preview thumbnails
  const getPreview = (idx) => (
    <img
      src={mockVideos[idx].avatar}
      alt=""
      className="w-10 h-10 rounded-lg border-2 border-pink-500 shadow-lg object-cover opacity-80"
      style={{ filter: 'blur(1px)' }}
    />
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-4 py-3 z-30">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow-glow">Reels</span>
        </div>
        <NeonButton className="p-2 bg-black/40 backdrop-blur-md">
          <FaCamera className="w-6 h-6" />
        </NeonButton>
      </div>

      {/* Animated progress bar at top */}
      <motion.div
        className="fixed top-0 left-0 w-full h-1 z-40"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.2, ease: EASING }}
      >
        <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full shadow-lg" />
      </motion.div>

      {/* Preview thumbnails */}
      {current > 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {getPreview(current - 1)}
            <HiOutlineChevronUp className="mx-auto text-white/70" />
          </motion.div>
        </div>
      )}
      {current < mockVideos.length - 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <HiOutlineChevronDown className="mx-auto text-white/70" />
            {getPreview(current + 1)}
          </motion.div>
        </div>
      )}

      {/* Main video area */}
      <div className="flex items-center justify-center w-full h-screen" >
      <div className="relative flex justify-center items-center w-[40%] max-w-[420px] aspect-[9/16]">
        {mockVideos.map((video, idx) => {
          // Calculate translateY for smooth transitions and drag
          let translateY = (idx - current) * 100;
          if (isDragging && idx === current) {
            translateY += dragOffset / window.innerHeight * 100;
          }
          return (
            <motion.div
              key={idx}
              className={`absolute w-full aspect-[9/16] flex items-center justify-center bg-black shadow-xl`}
              style={{
                transform: `translate(-50%, -50%) translateY(${translateY}%) scale(${getScale(idx)})`,
                zIndex: idx === current ? 10 : 0,
                opacity: idx === current ? 1 : 0.7,
                boxShadow: idx === current ? '0 0 32px 8px #a21caf55' : '0 0 8px 2px #0008',
                transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.3s, box-shadow 0.5s`,
              }}
              onClick={() => handleVideoTap(idx)}
            >
              <video
                ref={el => videoRefs.current[idx] = el}
                src={video.videoUrl}
                className="w-full h-full object-cover rounded-2xl"
                autoPlay={idx === current}
                loop
                muted
                playsInline
                onTimeUpdate={idx === current ? handleTimeUpdate : undefined}
              />
              {/* Double-tap heart animation */}
              <AnimatePresence>
                {showHeart && idx === current && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    initial={{ scale: 0, opacity: 0.7 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASING }}
                  >
                    <FaHeart className="text-pink-500 drop-shadow-glow" size={120} />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Overlay UI */}
              <div className="absolute bottom-0 left-0 w-full flex flex-row justify-between items-end p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/10 to-transparent rounded-b-2xl">
                {/* Left: Username, caption, music, follow */}
                <div className="mb-8 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer group"
                      onMouseEnter={() => handleProfileEnter(idx)}
                      onMouseLeave={handleProfileLeave}
                    >
                      <img src={video.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-pink-500" />
                      <span className="text-white font-bold text-lg hover:underline">@{video.username}</span>
                    </div>
                    <button
                      className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${followed[idx] ? 'bg-gray-700 text-white border-gray-500' : 'bg-red-600 text-white border-red-600 hover:bg-red-700'}`}
                      onClick={() => handleFollow(idx)}
                    >
                      {followed[idx] ? 'Following' : 'Follow'}
                    </button>
                  </div>
                  {/* Profile popover */}
                  <AnimatePresence>
                    {showProfile === idx && (
                      <motion.div
                        className="absolute left-0 bottom-24 bg-black/80 backdrop-blur-lg rounded-xl p-4 shadow-2xl border border-pink-500 z-40"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-3">
                          <img src={video.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-pink-500" />
                          <div>
                            <div className="text-white font-bold text-lg">@{video.username}</div>
                            <div className="text-gray-300 text-xs">Full profile coming soon...</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="text-white text-base max-w-xs break-words">
                    {video.caption.split(' ').map((word, i) =>
                      word.startsWith('#') ? (
                        <span
                          key={i}
                          className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold cursor-pointer hover:underline transition-all"
                          onClick={() => handleHashtagClick(word)}
                        > {word} </span>
                      ) : (
                        <span key={i}> {word} </span>
                      )
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-black/40 border-2 border-pink-500 flex items-center justify-center shadow-lg"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    >
                      <FaMusic className="w-5 h-5 text-pink-400" />
                    </motion.div>
                    <span className="text-white text-xs">{video.music}</span>
                  </div>
                </div>
                {/* Right: Buttons */}
                <div className="flex flex-col items-center gap-6 mb-8 mr-2">
                  <motion.button
                    className="flex flex-col items-center group"
                    whileTap={{ scale: 1.2 }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => {
                      setLiked((prev) => prev.map((l, i) => (i === idx ? !l : l)));
                      setLikes((prev) => prev.map((l, i) => (i === idx ? (liked[idx] ? l - 1 : l + 1) : l)));
                    }}
                  >
                    {liked[idx] ? (
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1.2 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <FaHeart className="w-8 h-8 text-pink-500 drop-shadow-glow" />
                      </motion.span>
                    ) : (
                      <FaRegHeart className="w-8 h-8 text-white group-hover:text-pink-500 transition-colors" />
                    )}
                    <span className="text-white text-xs mt-1">{likes[idx]}</span>
                  </motion.button>
                  <motion.button
                    className="flex flex-col items-center group"
                    whileTap={{ scale: 1.2 }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <FaCommentDots className="w-8 h-8 text-white group-hover:text-blue-400 transition-colors" />
                    <span className="text-white text-xs mt-1">{video.commentCount}</span>
                  </motion.button>
                  <motion.button
                    className="flex flex-col items-center group"
                    whileTap={{ scale: 1.2 }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <FaShare className="w-8 h-8 text-white group-hover:text-green-400 transition-colors" />
                    <span className="text-white text-xs mt-1">Share</span>
                  </motion.button>
                </div>
                {/* Progress bar (top, animated gradient) handled above */}
              </div>
            </motion.div>
          );
        })}
      </div>
      </div>
    </div>
  );
};

export default Reels;