import React, { useState, useRef, useEffect } from 'react';

const MultimediaVideoAnalysisTool = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [error, setError] = useState('');
  const [timestamps, setTimestamps] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState('landing');
  const [hoveredTimestamp, setHoveredTimestamp] = useState(null);
  
  const chatEndRef = useRef(null);

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const validateYouTubeUrl = (url) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return false;
    }
    setError('');
    return videoId;
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    
    const extractedId = validateYouTubeUrl(videoUrl);
    if (!extractedId) return;

    setIsProcessing(true);
    setCurrentStep('processing');
    setVideoId(extractedId);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTimestamps = [
        { id: 1, title: "Introduction & Overview", time: "0:00", seconds: 0, description: "Video introduction and topic overview" },
        { id: 2, title: "Main Concepts Explained", time: "2:15", seconds: 135, description: "Core concepts and theoretical background" },
        { id: 3, title: "Practical Examples", time: "5:30", seconds: 330, description: "Real-world examples and demonstrations" },
        { id: 4, title: "Advanced Topics", time: "8:45", seconds: 525, description: "Advanced concepts and edge cases" },
        { id: 5, title: "Q&A and Discussion", time: "12:20", seconds: 740, description: "Questions and community discussion" },
        { id: 6, title: "Summary & Conclusion", time: "15:10", seconds: 910, description: "Key takeaways and final thoughts" }
      ];

      setTimestamps(mockTimestamps);
      setIsVideoLoaded(true);
      setCurrentStep('loaded');
      
      setChatMessages([{
        id: Date.now(),
        type: 'system',
        content: '✨ Video analysis complete! Ask me anything about the content.',
        timestamp: new Date()
      }]);

    } catch (err) {
      setError('Failed to process video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTimestampClick = (seconds) => {
    console.log(`Jumping to ${seconds} seconds`);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Based on the video analysis, here's what I found: The topic you're asking about is covered in detail around the [2:15-3:30] mark in the "Main Concepts" section. You can also find related information discussed at [8:45-9:20] in the advanced topics section.`,
        timestamp: new Date(),
        citations: [
          { text: "2:15-3:30", seconds: 135 },
          { text: "8:45-9:20", seconds: 525 }
        ]
      };

      setChatMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFrameSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = [
        {
          id: 1,
          timestamp: "3:42",
          seconds: 222,
          description: "Visual content matching your query",
          confidence: 92
        },
        {
          id: 2,
          timestamp: "7:18",
          seconds: 438,
          description: "Similar visual elements found",
          confidence: 87
        },
        {
          id: 3,
          timestamp: "11:05",
          seconds: 665,
          description: "Related visual content",
          confidence: 81
        }
      ];

      setSearchResults(mockResults);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEnterPress = (e, handler) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handler(e);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Beautiful Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            🎥 Multimodal Video Analysis ✨
          </h1>
          <p className="text-2xl text-gray-600 font-light">
            Chat with your YouTube videos, get insights, and explore content.
          </p>
        </div>

        {/* Landing Page */}
        {currentStep === 'landing' && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 text-center">
                  <h3 className="text-white text-2xl font-bold">
                    🎬 Enter YouTube Video URL
                  </h3>
                </div>
                
                <div className="p-8">
                  <div className="mb-6">
                    <input
                      type="url"
                      className={`w-full p-4 text-lg border-2 rounded-2xl outline-none transition-all duration-300 ${
                        error ? 'border-red-500' : 'border-transparent'
                      } bg-gray-50 focus:bg-white focus:border-purple-500 focus:shadow-lg`}
                      placeholder="Paste YouTube URL here..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      onKeyPress={(e) => handleEnterPress(e, handleVideoSubmit)}
                    />
                    {error && (
                      <div className="text-red-500 text-sm mt-2">
                        ❌ {error}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleVideoSubmit}
                    disabled={isProcessing}
                    className={`w-full p-4 text-xl font-bold text-white rounded-2xl transition-all duration-300 ${
                      isProcessing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Analyzing Magic...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">🚀</span>
                        Start Analysis
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing State */}
        {currentStep === 'processing' && (
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl text-center overflow-hidden">
                <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-6 text-white">
                  <h3 className="text-2xl font-bold">🤖 AI Processing in Progress</h3>
                </div>
                
                <div className="p-12">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                  
                  <h4 className="text-gray-800 mb-4 text-2xl font-semibold">
                    Analyzing Video with Gemini AI
                  </h4>
                  
                  <div className="text-gray-600 text-lg mb-8 space-y-2">
                    <p>🎬 Extracting video content</p>
                    <p>🕒 Generating intelligent timestamps</p>
                    <p>💬 Preparing interactive chat interface</p>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Interface */}
        {currentStep === 'loaded' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Video Player */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-400 to-blue-400 p-4">
                  <h3 className="text-white font-bold text-lg">🎬 Video Player</h3>
                </div>
                <div className="relative pb-[56.25%]">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </div>

              {/* Visual Search */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-6">
                  <h3 className="text-white font-bold text-xl mb-4">🔍 Visual Content Search</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      className="flex-1 p-3 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/70 focus:border-white focus:outline-none"
                      placeholder="Describe what you're looking for..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => handleEnterPress(e, handleFrameSearch)}
                    />
                    <button 
                      onClick={handleFrameSearch}
                      disabled={isSearching}
                      className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold"
                    >
                      {isSearching ? '🔄' : '🔍'}
                    </button>
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {searchResults.map((result) => (
                        <div 
                          key={result.id} 
                          className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl p-4 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
                          onClick={() => handleTimestampClick(result.seconds)}
                        >
                          <div className="font-bold text-lg mb-2">
                            🎬 {result.timestamp}
                          </div>
                          <p className="text-white/90 mb-3 text-sm">
                            {result.description}
                          </p>
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold inline-block">
                            {result.confidence}% match ✨
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Interface */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-400 to-rose-400 p-4">
                  <h3 className="text-white font-bold text-xl">💬 Chat with Video</h3>
                </div>
                
                <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-pink-50/50 to-rose-50/50">
                  {chatMessages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white' 
                          : message.type === 'system'
                          ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}>
                        {message.type === 'ai' && (
                          <div className="text-purple-500 text-sm font-bold mb-2">
                            🤖 AI Assistant
                          </div>
                        )}
                        <div className="leading-relaxed">{message.content}</div>
                        {message.citations && (
                          <div className="mt-3 space-x-2">
                            {message.citations.map((citation, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleTimestampClick(citation.seconds)}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200"
                              >
                                🔗 {citation.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
                        <div className="w-4 h-4 border-2 border-pink-400 border-t-pink-500 rounded-full animate-spin"></div>
                        <span className="text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-pink-50/50 to-rose-50/50">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      className="flex-1 p-4 border-2 border-gray-200 rounded-2xl focus:border-cyan-500 focus:outline-none bg-white"
                      placeholder="Ask about the video..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => handleEnterPress(e, handleChatSubmit)}
                      disabled={isChatLoading}
                    />
                    <button 
                      onClick={handleChatSubmit}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="px-6 py-4 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
                    >
                      📤
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps Sidebar */}
            <div>
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-4">
                  <h3 className="text-white font-bold text-lg">⏰ Smart Timestamps</h3>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {timestamps.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 ${
                        hoveredTimestamp === item.id ? 'bg-gradient-to-r from-purple-50 to-indigo-50' : ''
                      }`}
                      onMouseEnter={() => setHoveredTimestamp(item.id)}
                      onMouseLeave={() => setHoveredTimestamp(null)}
                      onClick={() => handleTimestampClick(item.seconds)}
                    >
                      <div className="flex justify-content-between align-items-center mb-2">
                        <h6 className="font-semibold text-sm text-purple-500">
                          {item.title}
                        </h6>
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default MultimediaVideoAnalysisTool;