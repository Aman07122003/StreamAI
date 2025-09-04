import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import {
  HomeHeader,
  Sidebar,
  SortOptions,
  VideoGrid,
  Pagination
} from '../components/Home';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice';

// Simple cache implementation
const videoCache = new Map();

const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState(-1);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const profileMenuRef = useRef(null);
  const dispatch = useDispatch();
  const isAuthenticatedRedux = useSelector((state) => state.auth.isAuthenticated);
  const userRedux = useSelector((state) => state.auth.user);

  // Memoized values to prevent unnecessary re-renders
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.auth.user);

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Generate cache key based on current state
  const generateCacheKey = useCallback(() => {
    return `${searchQuery}-${currentPage}-${sortBy}-${sortOrder}`;
  }, [searchQuery, currentPage, sortBy, sortOrder]);

  // Fetch videos with caching
  const fetchVideos = useCallback(async () => {
    const cacheKey = generateCacheKey();
    
    // Return cached data if available
    if (videoCache.has(cacheKey)) {
      const cachedData = videoCache.get(cacheKey);
      setVideos(cachedData.data);
      setTotalPages(Math.ceil(cachedData.total / 12));
      return;
    }

    try {
      setIsLoadingVideos(true);
      const response = await axiosInstance.get('/videos', {
        params: {
          page: currentPage,
          limit: 12,
          sortBy,
          sortOrder,
          search: searchQuery
        }
      });
      
      setVideos(response.data.data);
      setTotalPages(Math.ceil(response.data.total / 12));
      
      // Cache the response
      videoCache.set(cacheKey, {
        data: response.data.data,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  }, [currentPage, sortBy, sortOrder, searchQuery, generateCacheKey]);

  // Debounced version of fetchVideos
  const debouncedFetchVideos = useCallback(
    debounce(() => {
      fetchVideos();
    }, 300),
    [fetchVideos]
  );

  // Effect for authentication check
  useEffect(() => {
    if (authStatus === false) {
      navigate('/');
    }
  }, [authStatus, navigate]);

  // Effect for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsSidebarOpen(window.innerWidth > 600);
    };
    
    window.addEventListener("resize", handleResize);
    // Set initial state
    setIsSidebarOpen(window.innerWidth > 600);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect for video fetching with debounce
  useEffect(() => {
    if (authStatus) {
      debouncedFetchVideos();
    }
  }, [currentPage, sortBy, sortOrder, searchQuery, authStatus, debouncedFetchVideos]);

  // Effect for profile menu click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Memoized event handlers
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchVideos();
  }, [fetchVideos]);

  const handleSort = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  }, []);

  const handleVoiceSearch = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search is not supported in your browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setCurrentPage(1);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, []);

  // Memoized components to prevent unnecessary re-renders
  const memoizedHomeHeader = useMemo(() => (
    <HomeHeader
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      handleSearch={handleSearch}
      handleVoiceSearch={handleVoiceSearch}
      isListening={isListening}
      isAuthenticated={authStatus}
      user={userData}
      isProfileMenuOpen={isProfileMenuOpen}
      setIsProfileMenuOpen={setIsProfileMenuOpen}
      profileMenuRef={profileMenuRef}
    />
  ), [isSidebarOpen, searchQuery, handleSearch, handleVoiceSearch, isListening, 
      authStatus, userData, isProfileMenuOpen]);

  const memoizedSidebar = useMemo(() => (
    <Sidebar isSidebarOpen={isSidebarOpen} />
  ), [isSidebarOpen]);

  const memoizedSortOptions = useMemo(() => (
    <SortOptions sortBy={sortBy} handleSort={handleSort} />
  ), [sortBy, handleSort]);

  const memoizedVideoGrid = useMemo(() => (
    <VideoGrid videos={videos} isLoadingVideos={isLoadingVideos} />
  ), [videos, isLoadingVideos]);

  const memoizedPagination = useMemo(() => (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
    />
  ), [currentPage, totalPages]);

  if (!authStatus) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {memoizedHomeHeader}
  
      {/* Sidebar */}
      {memoizedSidebar}
  
      {/* Main Content */}
      <main
        className={`pt-16 ${
          isSidebarOpen ? "ml-0 sm:ml-72" : "ml-0"
        } transition-all duration-500`}
      >
        <div className="container mx-auto md:px-10 px-3 py-8">
          {memoizedSortOptions}
          {memoizedVideoGrid}
          {memoizedPagination}
        </div>
      </main>
    </div>
  );
};

export default React.memo(Home);