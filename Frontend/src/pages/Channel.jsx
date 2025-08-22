import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Home/Sidebar.jsx';
import HomeHeader from '../components/Home/HomeHeader.jsx';
import { getChannelStats, getChannelVideos } from '../api/dashboard.api.js';
import { useSelector } from 'react-redux';

const Channel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('videos');

  // Dummy handlers for now
  const handleSearch = () => {};
  const handleVoiceSearch = () => {};
  const isListening = false;
  const isAuthenticated = true; // Replace with your auth logic
 
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const [stats, videosRes] = await Promise.all([
          getChannelStats(),
          getChannelVideos(),
        ]);
        setChannel(stats?.data || null);
        setVideos(Array.isArray(videosRes?.data) ? videosRes.data : []);
      } catch (error) {
        console.error('Error fetching channel data:', error);
        setError('Failed to load channel data');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchChannelData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!channel) {
    return <div>No channel data found.</div>;
  }

  return (
    <div className='w-full min-h-screen flex flex-col bg-gray-900'>
      <HomeHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleVoiceSearch={handleVoiceSearch}
        isListening={isListening}
        isAuthenticated={isAuthenticated}
        user={user}
        isProfileMenuOpen={isProfileMenuOpen}
        setIsProfileMenuOpen={setIsProfileMenuOpen}
        profileMenuRef={profileMenuRef}
      />
      <div className='flex flex-1'>
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className={`flex-1 pt-16 ${isSidebarOpen ? 'ml-0 sm:ml-72' : 'ml-0'} transition-all duration-500`}>
          {/* Channel Banner with overlapping avatar (mobile only) */}
          <div
            className="w-full h-40 sm:h-56 md:h-72 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${user.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            {/* Avatar centered and overlapping on mobile only */}
            <img
              src={user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
              alt="Channel Avatar"
              className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg bg-white object-cover block md:hidden"
              style={{ zIndex: 2 }}
            />
          </div>
          {/* Channel Info Card below avatar, responsive */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-4 sm:px-8 mt-20 md:-mt-8 z-10">
            {/* Avatar on the left for md+ devices */}
            <img
              src={user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
              alt="Channel Avatar"
              className="hidden md:block w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white object-cover md:mr-6 md:mb-0"
              style={{ zIndex: 2 }}
            />
            <div className="flex-1 flex flex-col md:flex-row md:items-end md:justify-between w-full">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-white">{channel.ownername || 'Channel Name'}</h2>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-2">
                  <span className="text-gray-300">{channel.totalSubscribers?.toLocaleString?.() || 0} subscribers</span>
                  <span className="text-gray-300">{channel.totalVideos || 0} videos</span>
                  <span className="text-gray-300">{channel.totalViews?.toLocaleString?.() || 0} views</span>
                </div>
              </div>
            </div>
          </div>
          {/* Channel Description and Tabs */}
          <div className="px-4 sm:px-8 mt-8">
            <div className="mb-6">
              <p className="text-gray-200 text-center md:text-left text-lg">{channel.description || 'No description provided.'}</p>
            </div>
            {/* Tabs - sticky on scroll */}
            <div className="flex gap-8 border-b border-gray-700 mb-6 sticky top-0 bg-gray-900 z-20 py-2">
              <button
                className={`pb-2 font-semibold transition-colors duration-200 ${activeTab === 'videos' ? 'border-b-2 border-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('videos')}
              >
                Videos
              </button>
              <button
                className={`pb-2 font-semibold transition-colors duration-200 ${activeTab === 'about' ? 'border-b-2 border-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </div>
            {/* Tab Content */}
            {activeTab === 'videos' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.isArray(videos) && videos.length === 0 ? (
                  <div className="col-span-full text-gray-400 text-center">No videos found.</div>
                ) : (
                  Array.isArray(videos) && videos.map((video) => (
                    <div
                      key={video._id}
                      className="bg-gray-800 rounded-xl p-4 flex flex-col items-center justify-center text-gray-200 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer"
                    >
                      <img
                        src={video.thumbnail || 'https://via.placeholder.com/150'}
                        alt={video.title}
                        className="w-full h-32 sm:h-40 object-cover rounded mb-3"
                      />
                      <h3 className="text-lg font-semibold truncate w-full text-center">{video.title}</h3>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-6 sm:p-10 text-gray-200 shadow-2xl border border-gray-700 max-w-2xl mx-auto mt-8">
                <h3 className="text-2xl font-bold mb-4 text-center">About {channel.ownername}</h3>
                <p className="mb-4 text-gray-300 text-center">{channel.description || 'No description provided.'}</p>
                <div className="flex flex-col gap-2 text-gray-400 text-center">
                  <span><strong>Owner:</strong> {channel.ownername}</span>
                  <span><strong>Subscribers:</strong> {channel.totalSubscribers?.toLocaleString?.() || 0}</span>
                  <span><strong>Total Videos:</strong> {channel.totalVideos || 0}</span>
                  <span><strong>Total Views:</strong> {channel.totalViews?.toLocaleString?.() || 0}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channel;
