import React, { useState, useEffect } from 'react';
import './DomainSearchApp.css';

// Icon components
const SearchIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const XIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PlusIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const DomainSearchApp = () => {
  const [activeTab, setActiveTab] = useState('domains');
  const [searchQuery, setSearchQuery] = useState('premium news sites with high viewability for finance audiences');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResults, setSelectedResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchContext, setSearchContext] = useState(null);
  const [refinementStage, setRefinementStage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [excludedTerms, setExcludedTerms] = useState([]);
  const [includedTerms, setIncludedTerms] = useState([]);
  const itemsPerPage = 10;
  
  // Contextual search intelligence
  const searchContexts = {
    'sports': {
      keywords: ['football', 'basketball', 'soccer', 'tennis', 'cricket', 'baseball', 'hockey'],
      domains: ['espn.com', 'sports.com', 'bleacherreport.com', 'si.com'],
      categories: ['Sports', 'Entertainment'],
      refinements: ['specific sport', 'league', 'season', 'team']
    },
    'finance': {
      keywords: ['investment', 'banking', 'stocks', 'cryptocurrency', 'trading', 'markets', 'economy'],
      domains: ['bloomberg.com', 'wsj.com', 'ft.com', 'marketwatch.com', 'cnbc.com'],
      categories: ['Finance', 'Business', 'News'],
      refinements: ['investment type', 'market sector', 'financial instrument', 'company size']
    },
    'technology': {
      keywords: ['software', 'hardware', 'AI', 'machine learning', 'cybersecurity', 'cloud', 'mobile'],
      domains: ['techcrunch.com', 'wired.com', 'arstechnica.com', 'theverge.com'],
      categories: ['Technology', 'Innovation', 'Business'],
      refinements: ['tech category', 'company type', 'innovation stage', 'platform']
    },
    'news': {
      keywords: ['breaking', 'politics', 'world', 'local', 'international', 'current events'],
      domains: ['cnn.com', 'bbc.com', 'reuters.com', 'nytimes.com', 'washingtonpost.com'],
      categories: ['News', 'Politics', 'World'],
      refinements: ['news type', 'geography', 'topic focus', 'time sensitivity']
    },
    'entertainment': {
      keywords: ['movies', 'music', 'celebrities', 'tv shows', 'streaming', 'gaming'],
      domains: ['entertainment.com', 'variety.com', 'hollywood.com', 'ign.com'],
      categories: ['Entertainment', 'Lifestyle', 'Media'],
      refinements: ['content type', 'genre', 'platform', 'audience age']
    }
  };

  // Intelligent search suggestions based on input
  const generateSearchSuggestions = (input) => {
    const suggestions = [];
    const lowerInput = input.toLowerCase();
    
    // Context-aware suggestions
    Object.keys(searchContexts).forEach(context => {
      if (lowerInput.includes(context) || searchContexts[context].keywords.some(k => lowerInput.includes(k))) {
        suggestions.push(...searchContexts[context].keywords.map(k => `${input} ${k}`));
        suggestions.push(...searchContexts[context].refinements.map(r => `${input} refined by ${r}`));
      }
    });

    // Common search patterns
    const patterns = [
      'premium sites for',
      'high viewability',
      'mobile-optimized',
      'video-enabled',
      'brand-safe content',
      'audience targeting'
    ];

    patterns.forEach(pattern => {
      if (!lowerInput.includes(pattern.split(' ')[0])) {
        suggestions.push(`${input} ${pattern}`);
      }
    });

    return [...new Set(suggestions)].slice(0, 8);
  };

  // Detect search context from query
  const detectSearchContext = (query) => {
    const lowerQuery = query.toLowerCase();
    
    for (const [context, data] of Object.entries(searchContexts)) {
      if (lowerQuery.includes(context) || 
          data.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return {
          primaryContext: context,
          detectedKeywords: data.keywords.filter(k => lowerQuery.includes(k)),
          suggestedDomains: data.domains,
          categories: data.categories,
          refinementOptions: data.refinements
        };
      }
    }
    
    return null;
  };

  // Extract refinement terms from search
  const extractRefinementTerms = (query) => {
    const includeTerms = [];
    const excludeTerms = [];
    
    // Look for exclude patterns
    const excludePatterns = ['not', 'except', 'without', 'exclude', 'minus'];
    excludePatterns.forEach(pattern => {
      const regex = new RegExp(`${pattern}\\s+([\\w\\s]+?)(?:\\s+(?:and|or|,)|$)`, 'gi');
      const matches = query.match(regex);
      if (matches) {
        matches.forEach(match => {
          const term = match.replace(new RegExp(pattern, 'i'), '').trim();
          if (term) excludeTerms.push(term);
        });
      }
    });

    // Look for include patterns
    const includePatterns = ['include', 'with', 'plus', 'and'];
    includePatterns.forEach(pattern => {
      const regex = new RegExp(`${pattern}\\s+([\\w\\s]+?)(?:\\s+(?:not|except|without)|$)`, 'gi');
      const matches = query.match(regex);
      if (matches) {
        matches.forEach(match => {
          const term = match.replace(new RegExp(pattern, 'i'), '').trim();
          if (term && !excludeTerms.includes(term)) includeTerms.push(term);
        });
      }
    });

    return { includeTerms, excludeTerms };
  };

  // Simulate intelligent search processing
  const performIntelligentSearch = async (query) => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const context = detectSearchContext(query);
    const { includeTerms, excludeTerms } = extractRefinementTerms(query);
    
    setSearchContext(context);
    setIncludedTerms(includeTerms);
    setExcludedTerms(excludeTerms);
    
    // Add to search history
    setSearchHistory(prev => [{
      query,
      timestamp: new Date(),
      context: context?.primaryContext,
      stage: refinementStage
    }, ...prev.slice(0, 9)]);
    
    setIsSearching(false);
  };

  // Handle search input changes
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 2) {
      const suggestions = generateSearchSuggestions(value);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle search execution
  const handleSearch = () => {
    if (searchQuery.trim()) {
      performIntelligentSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  // Handle refinement search
  const handleRefinementSearch = (refinementTerm) => {
    const newQuery = `${searchQuery} ${refinementTerm}`;
    setSearchQuery(newQuery);
    setRefinementStage(prev => prev + 1);
    performIntelligentSearch(newQuery);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    performIntelligentSearch(suggestion);
  };

  // Clear search context
  const clearSearchContext = () => {
    setSearchContext(null);
    setIncludedTerms([]);
    setExcludedTerms([]);
    setRefinementStage(1);
    setSearchQuery('');
  };
  const [filters, setFilters] = useState({
    includeExclude: 'include',
    mediaSubtype: ['Video'],
    deviceType: ['phone', 'tablet', 'desktop'],
    geography: 'Global',
    language: ['English'],
    contentStyle: ['Factual', 'Editorial'],
    safetyTier: ['Universal'],
    publishers: ['Financial Times Ltd.', 'Dow Jones & Co.', 'Bloomberg L.P.'],
    minViewability: 70,
    minCTR: 1.5,
    minReach: 10,
    relevance: 75,
    totalReach: '25M+',
    minViewabilityThreshold: 65,
    minCTRVTR: 0.8
  });

  // Generate sample data with more entries
  const generateDomainResults = (count) => {
    const domains = [
      'nytimes.com', 'wsj.com', 'cnn.com', 'bbc.com', 'reuters.com', 
      'bloomberg.com', 'ft.com', 'economist.com', 'guardian.com', 'washingtonpost.com',
      'forbes.com', 'businessinsider.com', 'cnbc.com', 'marketwatch.com', 'yahoo.com'
    ];
    const categories = [
      ['News', 'Business'], ['Business', 'Finance'], ['News', 'Politics'], 
      ['News', 'World'], ['Business', 'Technology'], ['Finance', 'Markets']
    ];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      domain: domains[i % domains.length] || `domain${i + 1}.com`,
      categories: categories[i % categories.length],
      reach: `${(Math.random() * 20 + 5).toFixed(1)}M`,
      relevance: `${Math.floor(Math.random() * 20 + 80)}%`,
      viewability: `${Math.floor(Math.random() * 15 + 80)}%`,
      ctr: `${(Math.random() * 2 + 1).toFixed(1)}%`,
      spend: `$${Math.floor(Math.random() * 50 + 20)}K`
    }));
  };

  const generateKeywordResults = (count) => {
    const keywords = [
      'business', 'technology', 'investment', 'finance', 'news', 'politics',
      'economy', 'markets', 'stocks', 'banking', 'startup', 'innovation',
      'cryptocurrency', 'trading', 'insurance'
    ];
    const types = ['Category', 'Topic', 'Brand', 'Product'];
    const frequencies = ['High', 'Medium', 'Low'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      keyword: keywords[i % keywords.length] || `keyword${i + 1}`,
      type: types[i % types.length],
      frequency: frequencies[i % frequencies.length],
      urls: `${(Math.random() * 10 + 1).toFixed(1)}M`,
      relevance: `${Math.floor(Math.random() * 20 + 75)}%`
    }));
  };

  const domainResults = generateDomainResults(150);
  const keywordResults = generateKeywordResults(120);

  // Sample campaign data
  const campaignData = [
    {
      id: 1,
      title: 'Premium Sports Video Campaign',
      company: 'SportMax Inc',
      match: 95,
      status: 'active',
      tags: ['PMP', 'CPM'],
      budget: { used: 285000, total: 500000, status: 'On track' },
      metrics: {
        ctr: { value: '30.00%', change: '+15%', positive: true },
        viewability: { value: '85%', change: '+8%', positive: true },
        cpm: { value: '$38.00', change: '', positive: null }
      },
      daysRemaining: 45
    },
    {
      id: 2,
      title: 'Luxury Auto Display Campaign',
      company: 'LuxuryCars International',
      match: 88,
      status: 'active',
      tags: ['Programmatic Guaranteed', 'CPM'],
      budget: { used: 425000, total: 750000, status: 'Pacing ahead' },
      metrics: {
        ctr: { value: '25.00%', change: '+12%', positive: true },
        viewability: { value: '82%', change: '+5%', positive: true },
        cpm: { value: '$40.48', change: '', positive: null }
      },
      daysRemaining: 60
    },
    {
      id: 3,
      title: 'E-commerce Retargeting Campaign',
      company: 'ShopStream',
      match: 82,
      status: 'active',
      tags: ['Private Auction', 'CPM'],
      budget: { used: 98000, total: 250000, status: 'Pacing behind' },
      metrics: {
        ctr: { value: '50.00%', change: '', positive: null },
        viewability: { value: '75%', change: '', positive: null },
        cpm: { value: '$7.26', change: '', positive: null }
      },
      daysRemaining: 35
    }
  ];

  const handleDomainSelect = (domain) => {
    setSelectedDomains(prev => 
      prev.includes(domain) 
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const handleKeywordSelect = (keyword) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleResultSelect = (id) => {
    setSelectedResults(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      includeExclude: 'include',
      mediaSubtype: [],
      deviceType: [],
      geography: 'Global',
      language: [],
      contentStyle: [],
      safetyTier: [],
      publishers: [],
      minViewability: 0,
      minCTR: 0,
      minReach: 0,
      relevance: 0,
      totalReach: '0',
      minViewabilityThreshold: 0,
      minCTRVTR: 0
    });
  };

  // Pagination logic
  const getCurrentPageData = () => {
    const data = activeTab === 'domains' ? domainResults : keywordResults;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const data = activeTab === 'domains' ? domainResults : keywordResults;
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const Pagination = () => {
    const totalPages = getTotalPages();
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button 
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon />
        </button>
        
        {startPage > 1 && (
          <>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon />
        </button>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1 className="header-title">Discover Inventory</h1>
          <p className="header-subtitle">Find and select relevant inventory using natural language search</p>
        </div>
      </div>

      <div className="main-layout">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="filters-sidebar">
            <div className="filters-header">
              <h2 className="filters-title">Filters</h2>
              <div className="filters-actions">
                <button className="clear-all-btn" onClick={clearAllFilters}>
                  Clear All
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="close-btn"
                >
                  <XIcon />
                </button>
              </div>
            </div>

            {/* Include/Exclude Toggle */}
            <div className="filter-section">
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="includeExclude"
                    value="include"
                    checked={filters.includeExclude === 'include'}
                    onChange={(e) => updateFilter('includeExclude', e.target.value)}
                  />
                  <span className="radio-text">Include</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="includeExclude"
                    value="exclude"
                    checked={filters.includeExclude === 'exclude'}
                    onChange={(e) => updateFilter('includeExclude', e.target.value)}
                  />
                  <span className="radio-text">Exclude</span>
                </label>
              </div>
            </div>

            {/* Media Subtype */}
            <div className="filter-section">
              <h3 className="filter-title">Media Subtype</h3>
              {['Video', 'Native', 'Display', 'Video+Native', 'Display+Video', 'Display+Native', 'Display+Video+Native'].map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.mediaSubtype.includes(type)}
                    onChange={() => toggleArrayFilter('mediaSubtype', type)}
                  />
                  <span className="checkbox-text">{type}</span>
                </label>
              ))}
            </div>

            {/* Device Type */}
            <div className="filter-section">
              <h3 className="filter-title">Device Type</h3>
              {['desktop', 'phone', 'tablet', 'set-top box', 'connected tv', 'mobile/tablet', 'connected device'].map(device => (
                <label key={device} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.deviceType.includes(device)}
                    onChange={() => toggleArrayFilter('deviceType', device)}
                  />
                  <span className="checkbox-text">{device}</span>
                </label>
              ))}
            </div>

            {/* Geography & Language */}
            <div className="filter-section">
              <h3 className="filter-title">Geography & Language</h3>
              <div className="geography-section">
                <div className="geography-tags">
                  <span className="tag tag-blue">Global</span>
                  <span className="tag tag-blue">US</span>
                  <span className="tag tag-blue">Europe</span>
                  <span className="tag tag-blue">APAC</span>
                </div>
                <div className="language-tags">
                  <span className="tag tag-gray">English</span>
                  <span className="tag tag-gray">Spanish</span>
                  <span className="tag tag-gray">French</span>
                </div>
              </div>
            </div>

            {/* Content Style */}
            <div className="filter-section">
              <h3 className="filter-title">Content Style</h3>
              <div className="content-style-tags">
                {['Factual', 'Editorial', 'Promotional', 'Educational', 'Entertainment', 'User-Generated', 'Reference'].map(style => (
                  <span 
                    key={style} 
                    className={`tag tag-clickable ${filters.contentStyle.includes(style) ? 'tag-selected' : 'tag-gray'}`}
                    onClick={() => toggleArrayFilter('contentStyle', style)}
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>

            {/* Publishers */}
            <div className="filter-section">
              <h3 className="filter-title">Publishers</h3>
              {['Financial Times Ltd.', 'Dow Jones & Co.', 'Bloomberg L.P.', 'NBCUniversal'].map(pub => (
                <label key={pub} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.publishers.includes(pub)}
                    onChange={() => toggleArrayFilter('publishers', pub)}
                  />
                  <span className="checkbox-text">{pub}</span>
                </label>
              ))}
            </div>

            {/* Performance & Reach */}
            <div className="filter-section">
              <h3 className="filter-title">Performance & Reach</h3>
              
              <div className="slider-group">
                <div className="slider-container">
                  <label className="slider-label">Min. Viewability: {filters.minViewability}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.minViewability}
                    onChange={(e) => updateFilter('minViewability', parseInt(e.target.value))}
                    className="slider slider-blue"
                  />
                </div>
                
                <div className="slider-container">
                  <label className="slider-label">Min. CTR/VTR: {filters.minCTR}%</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.minCTR}
                    onChange={(e) => updateFilter('minCTR', parseFloat(e.target.value))}
                    className="slider slider-blue"
                  />
                </div>
                
                <div className="slider-container">
                  <label className="slider-label">Min. Expected Reach: {filters.minReach}M</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={filters.minReach}
                    onChange={(e) => updateFilter('minReach', parseInt(e.target.value))}
                    className="slider slider-blue"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="main-content">
          {/* Search Interface */}
          <div className="search-interface">
            <div className="search-bar-container">
              <div className="search-input-wrapper">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search for categories, keywords, or audience..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="search-input"
                />
                
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="search-suggestions">
                    {searchSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="search-suggestion"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <SearchIcon />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                className="search-button"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="loading-spinner"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    Search
                  </>
                )}
              </button>
            </div>

            {/* Quick Filters Row */}
            <div className="quick-filters">
              <span className="quick-filter">Format: Display</span>
              <span className="quick-filter">GEO: Global</span>
              <span className="quick-filter">Channel: All</span>
              <span className="quick-filter">Stream: In-stream</span>
              <span className="quick-filter">Min. Relevance: 75%</span>
              <span className="quick-filter">Total Reach: 25M+</span>
              <span className="quick-filter">Min. Viewability: 65%</span>
              <span className="quick-filter">Min. CTR/VTR: 0.8%</span>
            </div>
          </div>

          {/* Search Context & Intelligence Display */}
          {searchContext && (
            <div className="search-context-panel">
              <div className="context-header">
                <div className="context-info">
                  <h3 className="context-title">
                    🎯 Detected Context: {searchContext.primaryContext.charAt(0).toUpperCase() + searchContext.primaryContext.slice(1)}
                  </h3>
                  <p className="context-description">
                    Search Stage {refinementStage} | Found {searchContext.detectedKeywords.length} relevant keywords
                  </p>
                </div>
                <button onClick={clearSearchContext} className="context-clear-btn">
                  <XIcon />
                </button>
              </div>
              
              {/* Detected Keywords */}
              {searchContext.detectedKeywords.length > 0 && (
                <div className="context-section">
                  <h4 className="context-section-title">Detected Keywords:</h4>
                  <div className="context-tags">
                    {searchContext.detectedKeywords.map((keyword, index) => (
                      <span key={index} className="tag tag-blue tag-clickable">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Include/Exclude Terms */}
              {(includedTerms.length > 0 || excludedTerms.length > 0) && (
                <div className="context-section">
                  {includedTerms.length > 0 && (
                    <div className="terms-group">
                      <h4 className="context-section-title">Including:</h4>
                      <div className="context-tags">
                        {includedTerms.map((term, index) => (
                          <span key={index} className="tag tag-green">
                            + {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {excludedTerms.length > 0 && (
                    <div className="terms-group">
                      <h4 className="context-section-title">Excluding:</h4>
                      <div className="context-tags">
                        {excludedTerms.map((term, index) => (
                          <span key={index} className="tag tag-red">
                            - {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Refinement Options */}
              <div className="context-section">
                <h4 className="context-section-title">Refine Your Search:</h4>
                <div className="refinement-options">
                  {searchContext.refinementOptions.map((option, index) => (
                    <button
                      key={index}
                      className="refinement-btn"
                      onClick={() => handleRefinementSearch(option)}
                    >
                      <PlusIcon />
                      Add {option}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Suggested Domains */}
              {searchContext.suggestedDomains.length > 0 && (
                <div className="context-section">
                  <h4 className="context-section-title">Suggested Relevant Domains:</h4>
                  <div className="context-tags">
                    {searchContext.suggestedDomains.slice(0, 6).map((domain, index) => (
                      <span key={index} className="tag tag-gray tag-clickable">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="search-history-panel">
              <h4 className="history-title">Recent Searches</h4>
              <div className="history-items">
                {searchHistory.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="history-item"
                    onClick={() => setSearchQuery(item.query)}
                  >
                    <div className="history-query">{item.query}</div>
                    <div className="history-meta">
                      {item.context && <span className="history-context">{item.context}</span>}
                      <span className="history-stage">Stage {item.stage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="set-tab-container">
            <div className="set-tab-info">
              <div className="set-tab-icon">i</div>
              <div>
                <div className="set-tab-text">Showing deals matching:</div>
                <div className="set-tab-description">create premium auto campaign</div>
              </div>
            </div>
            <button className="clear-selection-btn">Clear Selection</button>
          </div>

          {/* Campaign Cards Grid */}
          <div className="campaign-cards-grid">
            {campaignData.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-card-header">
                  <input type="checkbox" className="campaign-checkbox" />
                  <div className="campaign-header-right">
                    <div className={`campaign-status status-${campaign.status}`}>
                      {campaign.status}
                    </div>
                    <div className={`match-percentage ${
                      campaign.match >= 90 ? 'match-high' : 
                      campaign.match >= 80 ? 'match-medium' : 'match-low'
                    }`}>
                      {campaign.match}% Match
                    </div>
                  </div>
                </div>
                
                <h3 className="campaign-title">{campaign.title}</h3>
                <p className="campaign-company">{campaign.company}</p>
                
                <div className="campaign-tags">
                  {campaign.tags.map((tag, index) => (
                    <span key={index} className={`campaign-tag tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="budget-section">
                  <div className="budget-title">Budget Utilization</div>
                  <div className="budget-amounts">
                    <span>${campaign.budget.used.toLocaleString()}</span>
                    <span>of ${campaign.budget.total.toLocaleString()}</span>
                  </div>
                  <div className="budget-bar">
                    <div 
                      className={`budget-progress ${
                        campaign.budget.status === 'On track' ? 'budget-on-track' :
                        campaign.budget.status === 'Pacing ahead' ? 'budget-ahead' : 'budget-behind'
                      }`}
                      style={{ width: `${(campaign.budget.used / campaign.budget.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="budget-status">{campaign.budget.status}</div>
                </div>
                
                <div className="campaign-metrics">
                  <div className="metric-group">
                    <div className="metric-label">CTR</div>
                    <div className="metric-value">
                      {campaign.metrics.ctr.value}
                      {campaign.metrics.ctr.change && (
                        <span className={`metric-change ${campaign.metrics.ctr.positive ? 'change-positive' : 'change-negative'}`}>
                          {campaign.metrics.ctr.change}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="metric-group">
                    <div className="metric-label">Viewability</div>
                    <div className="metric-value">
                      {campaign.metrics.viewability.value}
                      {campaign.metrics.viewability.change && (
                        <span className={`metric-change ${campaign.metrics.viewability.positive ? 'change-positive' : 'change-negative'}`}>
                          {campaign.metrics.viewability.change}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="metric-group">
                    <div className="metric-label">CPM</div>
                    <div className="metric-value">{campaign.metrics.cpm.value}</div>
                  </div>
                </div>
                
                <div className="campaign-actions">
                  <button className="action-btn">
                    👁️ Details
                  </button>
                  <button className="action-btn">
                    🎯 Targeting
                  </button>
                </div>
                
                <div className="days-remaining">
                  {campaign.daysRemaining} days remaining
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <button
              onClick={() => {setActiveTab('domains'); setCurrentPage(1);}}
              className={`tab ${activeTab === 'domains' ? 'tab-active' : 'tab-inactive'}`}
            >
              Domains
            </button>
            <button
              onClick={() => {setActiveTab('keywords'); setCurrentPage(1);}}
              className={`tab ${activeTab === 'keywords' ? 'tab-active' : 'tab-inactive'}`}
            >
              Keywords
            </button>
          </div>

          {/* Results Grid */}
          <div className="results-grid">
            {/* Results Section */}
            <div className={`results-section ${activeTab === 'domains' ? 'section-green' : 'section-purple'}`}>
              <h2 className="section-title">
                {activeTab === 'domains' ? 'Domain Results' : 'Keyword Results'}
              </h2>
              
              {activeTab === 'domains' ? (
                <div className="results-list">
                  {getCurrentPageData().map((domain) => (
                    <div key={domain.id} className="result-item">
                      <div className="result-content">
                        <div className="result-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedResults.includes(domain.id)}
                            onChange={() => handleResultSelect(domain.id)}
                          />
                        </div>
                        <div className="result-main">
                          <h3 className="result-title">{domain.domain}</h3>
                          <p className="result-subtitle">Categories: {domain.categories.join(', ')}</p>
                        </div>
                        <div className="result-metrics">
                          <div className="metric">Reach: {domain.reach}</div>
                          <div className="metric">Relevance: {domain.relevance}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Pagination />
                </div>
              ) : (
                <div className="results-list">
                  {getCurrentPageData().map((keyword) => (
                    <div key={keyword.id} className="result-item">
                      <div className="result-content">
                        <div className="result-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedResults.includes(keyword.id)}
                            onChange={() => handleResultSelect(keyword.id)}
                          />
                        </div>
                        <div className="result-main">
                          <h3 className="result-title">{keyword.keyword}</h3>
                          <p className="result-subtitle">Type: {keyword.type} | Frequency: {keyword.frequency}</p>
                        </div>
                        <div className="result-metrics">
                          <div className="metric">{keyword.urls} URLs</div>
                          <div className="metric">Relevance: {keyword.relevance}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Pagination />
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                {activeTab === 'domains' ? (
                  <>
                    <button className="btn btn-success-outline btn-medium">Exclude Selected</button>
                    <button className="btn btn-success-outline btn-medium">Add More Domains</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-medium">Add to Search</button>
                    <button className="btn btn-primary-outline btn-medium">Exclude Selected</button>
                  </>
                )}
              </div>
            </div>

            {/* Export Actions Section */}
            <div className="suggestions-section">
              <h2 className="section-title">Export & Actions</h2>
              
              <div className="export-actions">
                <button className="btn btn-secondary btn-medium">
                  <DownloadIcon />
                  Export Results
                </button>
                <button className="btn btn-secondary btn-medium">
                  <PlusIcon />
                  Save Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Filters Button (when filters are hidden) */}
      {!showFilters && (
        <button
          onClick={() => setShowFilters(true)}
          className="btn btn-primary btn-medium toggle-filters-btn"
        >
          <FilterIcon />
        </button>
      )}
    </div>
  );
};

export default DomainSearchApp;