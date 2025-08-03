import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Home/Sidebar.jsx';
import HomeHeader from '../components/Home/HomeHeader.jsx';
import { useSelector } from 'react-redux';
import { getSubscribedChannels, getUserChannelSubscribers } from "../api/subscription.api.js";

const Subscription = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [channels, setChannels] = useState([]); // Channels the user is subscribed to
  const [subscribers, setSubscribers] = useState([]); // Users who subscribe to this user
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [errorChannels, setErrorChannels] = useState(null);
  const [errorSubscribers, setErrorSubscribers] = useState(null);

  // Dummy handlers for now
  const handleSearch = () => {};
  const handleVoiceSearch = () => {};
  const isListening = false;
  const isAuthenticated = true; // Replace with your auth logic

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoadingChannels(true);
        setErrorChannels(null);
        if (!user?._id) throw new Error('User not found');
        const res = await getSubscribedChannels(user._id);
        setChannels(res?.data || []);
      } catch (err) {
        setErrorChannels('Failed to load subscriptions');
        setChannels([]);
        console.error(err);
      } finally {
        setLoadingChannels(false);
      }
    };
    const fetchSubscribers = async () => {
      try {
        setLoadingSubscribers(true);
        setErrorSubscribers(null);
        if (!user?._id) throw new Error('User not found');
        const res = await getUserChannelSubscribers(user._id);
        setSubscribers(res?.data || []);
      } catch (err) {
        setErrorSubscribers('Failed to load subscribers');
        setSubscribers([]);
        console.error(err);
      } finally {
        setLoadingSubscribers(false);
      }
    };
    if (user?._id) {
      fetchSubscriptions();
      fetchSubscribers();
    }
  }, [user]);

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
        <div className={`flex-1 pt-16 ${isSidebarOpen ? 'ml-0 sm:ml-72' : 'ml-0'} transition-all duration-500 flex flex-col items-center justify-start px-4 sm:px-8`}>
          {/* Channels you subscribed to */}
          <h2 className="text-2xl font-bold text-white mt-8 mb-6 self-start">Channels You Subscribed To</h2>
          {loadingChannels ? (
            <div className="text-gray-400 text-lg mt-10">Loading...</div>
          ) : errorChannels ? (
            <div className="text-red-400 text-lg mt-10">{errorChannels}</div>
          ) : channels.length === 0 ? (
            <div className="text-gray-400 text-lg mt-10">You haven't subscribed to any channels yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-12">
              {channels.map((channel) => (
                <div key={channel._id} className="bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <img
                    src={channel.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                    alt={channel.username || channel.fullName || 'Channel Avatar'}
                    className="w-20 h-20 rounded-full border-4 border-white shadow mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-white mb-1 text-center truncate w-full">{channel.fullName || channel.username || 'Channel Name'}</h3>
                  <p className="text-gray-400 text-sm text-center mb-2">@{channel.username}</p>
                  <div className="flex gap-4 text-gray-400 text-xs justify-center">
                    <span>{channel.subscribersCount?.toLocaleString?.() || 0} subscribers</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Subscribers to your channel */}
          <h2 className="text-2xl font-bold text-white mt-8 mb-6 self-start">Your Subscribers</h2>
          {loadingSubscribers ? (
            <div className="text-gray-400 text-lg mt-10">Loading...</div>
          ) : errorSubscribers ? (
            <div className="text-red-400 text-lg mt-10">{errorSubscribers}</div>
          ) : subscribers.length === 0 ? (
            <div className="text-gray-400 text-lg mt-10">No one has subscribed to your channel yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-12">
              {subscribers.map((subscriber) => (
                <div key={subscriber._id} className="bg-gray-800 rounded-xl p-6 flex flex-col items-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <img
                    src={subscriber.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                    alt={subscriber.username || subscriber.fullName || 'Subscriber Avatar'}
                    className="w-20 h-20 rounded-full border-4 border-white shadow mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-white mb-1 text-center truncate w-full">{subscriber.fullName || subscriber.username || 'User'}</h3>
                  <p className="text-gray-400 text-sm text-center mb-2">@{subscriber.username}</p>
                  <div className="flex gap-4 text-gray-400 text-xs justify-center">
                    <span>{subscriber.subscribersCount?.toLocaleString?.() || 0} subscribers</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;