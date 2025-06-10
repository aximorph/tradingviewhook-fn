import React, { useState } from 'react';
import { 
  Download, 
  Grid, 
  List, 
  Filter,
  Search,
  Calendar,
  Tag,
  Star,
  ExternalLink
} from 'lucide-react';

interface EAVersion {
  id: string;
  name: string;
  version: string;
  description: string;
  releaseDate: string;
  downloads: number;
  rating: number;
  size: string;
  compatibility: string[];
  changelog: string[];
  featured: boolean;
}

const eaVersions: EAVersion[] = [
  {
    id: '1',
    name: 'Pro Scalper EA',
    version: '2.1.5',
    description: 'Advanced scalping expert advisor with AI-powered market analysis',
    releaseDate: '2024-01-15',
    downloads: 1247,
    rating: 4.8,
    size: '2.4 MB',
    compatibility: ['MT5', 'MT4'],
    changelog: [
      'Improved risk management algorithms',
      'Added new market conditions detection',
      'Fixed minor UI bugs'
    ],
    featured: true
  },
  {
    id: '2',
    name: 'Trend Master',
    version: '1.8.2',
    description: 'Long-term trend following system with multiple timeframe analysis',
    releaseDate: '2024-01-10',
    downloads: 856,
    rating: 4.6,
    size: '1.8 MB',
    compatibility: ['MT5'],
    changelog: [
      'Enhanced trend detection logic',
      'Optimized performance for large datasets'
    ],
    featured: false
  },
  {
    id: '3',
    name: 'Grid Master Pro',
    version: '3.0.1',
    description: 'Professional grid trading system with advanced money management',
    releaseDate: '2024-01-08',
    downloads: 642,
    rating: 4.5,
    size: '3.1 MB',
    compatibility: ['MT5', 'MT4'],
    changelog: [
      'Major version update with new features',
      'Redesigned user interface',
      'Added support for multiple currency pairs'
    ],
    featured: true
  },
  {
    id: '4',
    name: 'News Trader',
    version: '1.4.7',
    description: 'Automated news trading with economic calendar integration',
    releaseDate: '2024-01-05',
    downloads: 423,
    rating: 4.2,
    size: '1.5 MB',
    compatibility: ['MT5'],
    changelog: [
      'Updated economic calendar API',
      'Improved news filtering'
    ],
    featured: false
  }
];

export const EADownloads: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompatibility, setFilterCompatibility] = useState('all');
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  const filteredEAs = eaVersions.filter(ea => {
    const matchesSearch = ea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompatibility = filterCompatibility === 'all' ||
                               ea.compatibility.includes(filterCompatibility);
    return matchesSearch && matchesCompatibility;
  });

  const handleDownload = (ea: EAVersion) => {
    // Simulate download progress
    let progress = 0;
    setDownloadProgress(prev => ({ ...prev, [ea.id]: 0 }));
    
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setDownloadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[ea.id];
            return newProgress;
          });
          // Simulate actual download
          const element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('EA File Content'));
          element.setAttribute('download', `${ea.name.replace(/\s+/g, '_')}_v${ea.version}.ex5`);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }, 500);
      }
      setDownloadProgress(prev => ({ ...prev, [ea.id]: Math.round(progress) }));
    }, 100);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const EACard: React.FC<{ ea: EAVersion }> = ({ ea }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow ${
      ea.featured ? 'ring-2 ring-blue-500/20' : ''
    }`}>
      {ea.featured && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-t-xl">
          Featured
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {ea.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Version {ea.version}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {renderStars(ea.rating)}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              ({ea.rating})
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {ea.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {ea.compatibility.map(platform => (
            <span
              key={platform}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
            >
              {platform}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(ea.releaseDate).toLocaleDateString()}
          </span>
          <span>{ea.downloads} downloads</span>
          <span>{ea.size}</span>
        </div>
        
        {downloadProgress[ea.id] !== undefined ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Downloading...</span>
              <span className="text-gray-600 dark:text-gray-400">{downloadProgress[ea.id]}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress[ea.id]}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleDownload(ea)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        )}
      </div>
    </div>
  );

  const EAListItem: React.FC<{ ea: EAVersion }> = ({ ea }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ea.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Version {ea.version} • {ea.size} • {ea.downloads} downloads
              </p>
            </div>
            {ea.featured && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
            {ea.description}
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              {renderStars(ea.rating)}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({ea.rating})
              </span>
            </div>
            <div className="flex space-x-2">
              {ea.compatibility.map(platform => (
                <span
                  key={platform}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="ml-4">
          {downloadProgress[ea.id] !== undefined ? (
            <div className="w-32">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Downloading</span>
                <span className="text-gray-600 dark:text-gray-400">{downloadProgress[ea.id]}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress[ea.id]}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleDownload(ea)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            EA Downloads
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Download expert advisors and trading tools
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search expert advisors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        
        <select
          value={filterCompatibility}
          onChange={(e) => setFilterCompatibility(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Platforms</option>
          <option value="MT5">MT5 Only</option>
          <option value="MT4">MT4 Only</option>
        </select>
      </div>

      {/* EA List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEAs.map(ea => (
            <EACard key={ea.id} ea={ea} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEAs.map(ea => (
            <EAListItem key={ea.id} ea={ea} />
          ))}
        </div>
      )}

      {filteredEAs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No EAs Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
};