import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiBookmark, FiFolder, FiClock, FiSettings, FiHelpCircle, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ isSidebarOpen }) => {
  const navigationItems = [
    { icon: <FiHome className="w-5 h-5" />, text: "Home", link: "/" },
    { icon: <FiTrendingUp className="w-5 h-5" />, text: "Reels", link: "/Reels" },
    { icon: <FiBookmark className="w-5 h-5" />, text: "Subscriptions", link: "/subscription" },
    { icon: <FiFolder className="w-5 h-5" />, text: "Library", link: "/library" },
    { icon: <FiClock className="w-5 h-5" />, text: "History", link: "/history" }
  ];

  // Mock trending tags
  const trendingTags = [
    '#AI', '#React', '#Music', '#Viral', '#Coding', '#Travel', '#Food', '#Sports', '#News', '#Shorts'
  ];

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-900/50 backdrop-blur-xl border-r border-indigo-500/20 w-72 transform transition-all duration-500 z-50 ${
        isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.link}
                  className={`flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 ${
                    window.location.pathname === item.link
                      ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/10 border border-indigo-500/30 shadow-lg' 
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <span className={window.location.pathname === item.link ? "text-purple-400" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span className={`text-sm ${window.location.pathname === item.link ? "font-medium text-white" : "text-gray-300"}`}>
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Trending Tags/Topics */}
          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase">Trending</h3>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag, idx) => (
                <button
                  key={idx}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-700/30 to-indigo-700/10 text-purple-300 text-xs font-medium hover:bg-purple-700/50 hover:text-white transition-colors duration-200 shadow"
                  onClick={() => alert(`Clicked tag: ${tag}`)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </nav>
        {/* Footer with Settings/Help/Logout */}
        <div className="absolute bottom-0 left-0 w-full border-t border-indigo-500/10 bg-gray-900/70 px-4 py-4 flex flex-col gap-2">
          <Link to="/settings" className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors text-sm py-1">
            <FiSettings className="w-5 h-5" /> Settings
          </Link>
          <Link to="/help" className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors text-sm py-1">
            <FiHelpCircle className="w-5 h-5" /> Help
          </Link>
          <button className="flex items-center gap-3 text-gray-300 hover:text-pink-400 transition-colors text-sm py-1 focus:outline-none" onClick={() => alert('Logging out...')}>
            <FiLogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 