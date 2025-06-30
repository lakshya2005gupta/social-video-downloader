import React, { useState, useEffect } from 'react';
import { Download, Link, CheckCircle, AlertCircle, Globe, Instagram, Twitter, Facebook, Loader, Play, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface DetectedPlatform {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  supported: boolean;
}

interface MediaContent {
  type: 'video' | 'image' | 'carousel';
  thumbnail: string;
  downloadUrl: string;
  title?: string;
  duration?: string;
  resolution: string;
}

const platforms: Record<string, DetectedPlatform> = {
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'from-pink-500 to-purple-600',
    supported: true
  },
  twitter: {
    name: 'X (Twitter)',
    icon: Twitter,
    color: 'from-blue-400 to-blue-600',
    supported: true
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'from-blue-600 to-blue-800',
    supported: true
  },
  threads: {
    name: 'Threads',
    icon: Globe,
    color: 'from-gray-600 to-gray-800',
    supported: true
  },
  default: {
    name: 'Unknown Platform',
    icon: Globe,
    color: 'from-gray-500 to-gray-700',
    supported: false
  }
};

function App() {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<DetectedPlatform | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaContent, setMediaContent] = useState<MediaContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectPlatform = (inputUrl: string): DetectedPlatform => {
    const urlLower = inputUrl.toLowerCase();
    
    if (urlLower.includes('instagram.com')) return platforms.instagram;
    if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return platforms.twitter;
    if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) return platforms.facebook;
    if (urlLower.includes('threads.net')) return platforms.threads;
    
    return platforms.default;
  };

  const validateUrl = (inputUrl: string): boolean => {
    try {
      new URL(inputUrl);
      return true;
    } catch {
      return false;
    }
  };

  const fetchMediaContent = async (inputUrl: string, platform: DetectedPlatform): Promise<MediaContent> => {
    // Simulate API call to extract media content
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) { // 90% success rate for demo
          const isVideo = Math.random() > 0.4;
          const mockContent: MediaContent = {
            type: isVideo ? 'video' : 'image',
            thumbnail: `https://images.pexels.com/photos/${1000 + Math.floor(Math.random() * 2000)}/pexels-photo-${1000 + Math.floor(Math.random() * 2000)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
            downloadUrl: inputUrl,
            title: `${platform.name} ${isVideo ? 'Video' : 'Image'}`,
            duration: isVideo ? `${Math.floor(Math.random() * 3) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
            resolution: ['720p', '1080p', '4K'][Math.floor(Math.random() * 3)]
          };
          resolve(mockContent);
        } else {
          reject(new Error('Failed to extract media'));
        }
      }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds
    });
  };

  const processUrl = async (inputUrl: string) => {
    if (!isValidUrl || !detectedPlatform?.supported) return;
    
    setIsProcessing(true);
    setError(null);
    setMediaContent(null);
    
    try {
      const content = await fetchMediaContent(inputUrl, detectedPlatform);
      setMediaContent(content);
    } catch (err) {
      setError('Failed to process the URL. Please check the link and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAndReset = () => {
    setUrl('');
    setIsValidUrl(false);
    setDetectedPlatform(null);
    setIsProcessing(false);
    setMediaContent(null);
    setError(null);
  };

  useEffect(() => {
    if (url.trim()) {
      const valid = validateUrl(url);
      setIsValidUrl(valid);
      
      if (valid) {
        const platform = detectPlatform(url);
        setDetectedPlatform(platform);
        
        // Auto-process when URL is valid and platform is supported
        if (platform.supported) {
          processUrl(url);
        } else {
          setError('This platform is not supported yet. We support Instagram, Facebook, X (Twitter), and Threads.');
        }
      } else {
        setDetectedPlatform(null);
        setMediaContent(null);
        setError(null);
      }
    } else {
      setIsValidUrl(false);
      setDetectedPlatform(null);
      setMediaContent(null);
      setError(null);
      setIsProcessing(false);
    }
  }, [url]);

  const handleDownload = () => {
    if (!mediaContent) return;
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = mediaContent.downloadUrl;
    link.download = `${detectedPlatform?.name}_${Date.now()}.${mediaContent.type === 'video' ? 'mp4' : 'jpg'}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Downloading ${mediaContent.type} from ${detectedPlatform?.name} in ${mediaContent.resolution}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-4 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Download className="text-white w-6 h-6" />
              <span className="text-white font-medium">Universal Media Downloader</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Made by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">Lakshya</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-2">
              For Sanjay to download his videos on his own
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Just paste any social media link and download instantly in highest quality
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
            {/* URL Input Section */}
            <div className="mb-8">
              <label htmlFor="url-input" className="block text-white text-lg font-medium mb-4">
                Paste your social media link here
              </label>
              
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Link className="h-5 w-5 text-white/50" />
                  </div>
                  
                  <input
                    id="url-input"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://instagram.com/p/example..."
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                  />
                  
                  {url && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      {isValidUrl ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Download More Button */}
                {url && (
                  <button
                    onClick={clearAndReset}
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl text-white transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Download More
                  </button>
                )}
              </div>
            </div>

            {/* Platform Detection */}
            {detectedPlatform && isValidUrl && (
              <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${detectedPlatform.color}`}>
                    <detectedPlatform.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{detectedPlatform.name} Detected</h3>
                    <p className="text-white/60 text-sm">
                      {detectedPlatform.supported ? 'Processing automatically...' : 'Platform not supported yet'}
                    </p>
                  </div>
                  {isProcessing && (
                    <div className="ml-auto">
                      <Loader className="w-5 h-5 text-cyan-400 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && detectedPlatform?.supported && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-white">
                  <Loader className="w-6 h-6 animate-spin text-cyan-400" />
                  <span className="text-lg">Processing your {detectedPlatform.name} link...</span>
                </div>
                <p className="text-white/60 mt-2">This usually takes a few seconds</p>
              </div>
            )}

            {/* Media Preview & Download */}
            {mediaContent && !isProcessing && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="text-white font-medium text-lg mb-4">Ready to Download</h3>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Media Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative w-full md:w-48 h-48 bg-black/20 rounded-xl overflow-hidden">
                        <img
                          src={mediaContent.thumbnail}
                          alt="Media preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.pexels.com/photos/1000/pexels-photo-1000.jpeg?auto=compress&cs=tinysrgb&w=400`;
                          }}
                        />
                        {mediaContent.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-3">
                              <Play className="w-6 h-6 text-white fill-white" />
                            </div>
                          </div>
                        )}
                        {mediaContent.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {mediaContent.duration}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Media Info & Download */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {mediaContent.type === 'video' ? (
                            <Play className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-cyan-400" />
                          )}
                          <h4 className="text-white font-medium capitalize">
                            {mediaContent.type} • {mediaContent.resolution}
                          </h4>
                        </div>
                        <p className="text-white/60 text-sm mb-4">
                          {mediaContent.title} from {detectedPlatform?.name}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleDownload}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                        >
                          <Download className="w-6 h-6" />
                          Download in Highest Quality
                        </button>
                        
                        <button
                          onClick={clearAndReset}
                          className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl text-white transition-all duration-200 flex items-center gap-2"
                        >
                          <RotateCcw className="w-5 h-5" />
                          Download More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-white/60">
            Built with ❤️ for seamless social media downloads
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;