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
  const [refinedQuery, setRefinedQuery] = useState('');
  const [searchStage, setSearchStage] = useState(1); // 1 = initial, 2 = refined
  const [enhancedSearchContext, setEnhancedSearchContext] = useState(null);
  const [activeView, setActiveView] = useState('performance');
  const [metricsDisplayMode, setMetricsDisplayMode] = useState('detailed');
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDomainSet, setSelectedDomainSet] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDomains, setUploadedDomains] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchName, setSearchName] = useState('');
  const itemsPerPage = 10;

  // Contextual search intelligence
  const searchContexts = {
    'sports': {
      keywords: ['football', 'basketball', 'soccer', 'tennis', 'cricket', 'baseball', 'hockey'],
      domains: ['espn.com', 'sports.com', 'bleacherreport.com', 'si.com'],
      categories: ['Sports', 'Entertainment'],
      refinements: ['specific sport', 'league', 'season', 'team'],
      excludeTerms: ['gambling', 'betting', 'controversial']
    },
    'finance': {
      keywords: ['investment', 'banking', 'stocks', 'cryptocurrency', 'trading', 'markets', 'economy'],
      domains: ['bloomberg.com', 'wsj.com', 'ft.com', 'marketwatch.com', 'cnbc.com'],
      categories: ['Finance', 'Business', 'News'],
      refinements: ['investment type', 'market sector', 'financial instrument', 'company size'],
      excludeTerms: ['risky investments', 'penny stocks', 'gambling']
    },
    'technology': {
      keywords: ['software', 'hardware', 'AI', 'machine learning', 'cybersecurity', 'cloud', 'mobile'],
      domains: ['techcrunch.com', 'wired.com', 'arstechnica.com', 'theverge.com'],
      categories: ['Technology', 'Innovation', 'Business'],
      refinements: ['tech category', 'company type', 'innovation stage', 'platform'],
      excludeTerms: ['adult content', 'piracy', 'hacking']
    },
    'news': {
      keywords: ['breaking', 'politics', 'world', 'local', 'international', 'current events'],
      domains: ['cnn.com', 'bbc.com', 'reuters.com', 'nytimes.com', 'washingtonpost.com'],
      categories: ['News', 'Politics', 'World'],
      refinements: ['news type', 'geography', 'topic focus', 'time sensitivity'],
      excludeTerms: ['fake news', 'conspiracy', 'unverified']
    },
    'entertainment': {
      keywords: ['movies', 'music', 'celebrities', 'tv shows', 'streaming', 'gaming'],
      domains: ['entertainment.com', 'variety.com', 'hollywood.com', 'ign.com'],
      categories: ['Entertainment', 'Lifestyle', 'Media'],
      refinements: ['content type', 'genre', 'platform', 'audience age'],
      excludeTerms: ['adult content', 'violence', 'inappropriate']
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
  const performIntelligentSearch = async (query, isRefinement = false) => {
    setIsSearching(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const context = detectSearchContext(query);
    const { includeTerms, excludeTerms } = extractRefinementTerms(query);

    const enhancedContext = context ? {
      ...context,
      suggestedExclusions: context.excludeTerms || [],
      searchStage: isRefinement ? 2 : 1,
      originalQuery: isRefinement ? searchQuery : query,
      refinedQuery: isRefinement ? query : null
    } : null;

    setSearchContext(context);
    setIncludedTerms(includeTerms);
    setExcludedTerms(excludeTerms);

    if (isRefinement) {
      setSearchStage(2);
      setRefinedQuery(query);
    } else {
      setSearchStage(1);
      setRefinedQuery('');
    }

    // Add to search history
    setSearchHistory(prev => [{
      query,
      timestamp: new Date(),
      context: context?.primaryContext,
      stage: refinementStage ? 2 : 1,
      isRefinement
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
    const baseQuery = searchStage === 1 ? searchQuery : refinedQuery;
    const newQuery = `${baseQuery} ${refinementTerm}`;
    performIntelligentSearch(newQuery, true);
  };

  //Save search
  const saveCurrentSearch = () => {
    const savedSearch = {
      id: Date.now(),
      name: searchName.trim(),
      query: searchQuery,
      context: searchContext,
      filters: { ...filters },
      selectedDomainSet: selectedDomainSet,
      timestamp: new Date(),
      resultCount: activeTab === 'domains' ? domainResults.length : keywordResults.length
    };

    setSavedSearches(prev => [savedSearch, ...prev]);
    setShowSaveModal(false);
    setSearchName('');

    alert(`Search "${searchName}" saved successfully!`);
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
    setRefinedQuery('');
  };
  const [filters, setFilters] = useState({
    includeExclude: 'include',
    mediaSubtype: ['Video'],
    deviceType: ['phone', 'tablet', 'desktop'],
    distributionChannel: ['Programmatic', 'Direct'],
    videoPlacement: ['instream'],
    dateRange: 30,
    geography: 'Global',
    language: ['English'],
    contentStyle: ['Factual', 'Editorial'],
    safetyTier: ['Universal'],
    isDirect: false,
    publishers: ['Financial Times Ltd.', 'Dow Jones & Co.', 'Bloomberg L.P.'],
    minViewability: 70,
    minCTR: 1.5,
    minReach: 10,
    relevance: 75,
    relevanceThreshold: 75,
    minReachThreshold: 1,
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
    const publishers = [
      'The New York Times Company', 'Dow Jones & Company', 'CNN Inc.', 'BBC', 'Thomson Reuters',
      'Bloomberg L.P.', 'Financial Times Ltd.', 'The Economist Group', 'Guardian Media Group',
      'The Washington Post Company', 'Forbes Media', 'Insider Inc.', 'NBCUniversal', 'MarketWatch Inc.',
      'Yahoo Inc.', 'ESPN Inc.', 'Sports Media', 'TechCrunch Inc.', 'Condé Nast', 'Vox Media'
    ];
    const contentCategories = [
      ['News', 'Business'], ['Business', 'Finance'], ['News', 'Politics'],
      ['News', 'World'], ['Business', 'Technology'], ['Finance', 'Markets']
    ];

    return Array.from({ length: count }, (_, i) => {
      const baseReach = Math.random() * 20 + 5;
      const baseCTR = Math.random() * 2 + 1;
      const baseViewability = Math.random() * 15 + 80;

      return {
        id: i + 1,
        domain: domains[i % domains.length] || `domain${i + 1}.com`,
        publisher: publishers[i % publishers.length] || `Publisher ${i + 1}`,
        publisherId: `pub_${i + 1}`,
        categories: contentCategories[i % contentCategories.length],

        // Basic metrics
        reach: `${baseReach.toFixed(1)}M`,
        relevance: Math.floor(Math.random() * 20 + 80),

        // Comprehensive engagement metrics
        metrics: {
          // Viewability & Visibility
          viewability: Math.floor(baseViewability),
          viewabilityTrend: Math.random() > 0.5 ? '+' : '-',
          viewabilityChange: (Math.random() * 10 + 1).toFixed(1),

          // Click metrics
          ctr: baseCTR.toFixed(2),
          ctrTrend: Math.random() > 0.6 ? '+' : '-',
          ctrChange: (Math.random() * 0.5 + 0.1).toFixed(2),
          clicks: Math.floor(Math.random() * 2000000 + 100000),
          clicksMonthly: Math.floor(Math.random() * 500000 + 50000),

          // Video metrics (when applicable)
          vtr: (Math.random() * 25 + 60).toFixed(1),
          vtrTrend: Math.random() > 0.5 ? '+' : '-',
          vtrChange: (Math.random() * 5 + 1).toFixed(1),
          videoCompletionRate: (Math.random() * 20 + 70).toFixed(1),

          // Campaign efficiency indicators
          bidRate: (Math.random() * 30 + 65).toFixed(1), // % of auctions participated
          winRate: (Math.random() * 25 + 35).toFixed(1), // % of auctions won
          fillRate: (Math.random() * 15 + 80).toFixed(1), // % of ad requests filled

          // Financial performance
          spend: Math.floor(Math.random() * 80000 + 10000),
          spendMonthly: Math.floor(Math.random() * 30000 + 5000),
          cpm: (Math.random() * 20 + 5).toFixed(2),
          cpc: (Math.random() * 2 + 0.5).toFixed(2),
          cpa: (Math.random() * 50 + 10).toFixed(2),

          // Advanced performance indicators
          engagementRate: (Math.random() * 5 + 2).toFixed(2),
          bounceRate: (Math.random() * 30 + 20).toFixed(1),
          sessionDuration: Math.floor(Math.random() * 300 + 60), // seconds
          pagesPerSession: (Math.random() * 3 + 1).toFixed(1),

          // Quality scores
          brandSafetyScore: Math.floor(Math.random() * 20 + 80),
          fraudScore: Math.floor(Math.random() * 10 + 1), // lower is better
          qualityScore: Math.floor(Math.random() * 30 + 70)
        },

        // Technical specifications
        supportedFormats: ['display', 'video', 'native'].filter(() => Math.random() > 0.3),
        supportedDevices: ['desktop', 'mobile', 'tablet'].filter(() => Math.random() > 0.2),
        videoOptions: {
          placements: ['instream', 'outstream'].filter(() => Math.random() > 0.4),
          maxDuration: Math.floor(Math.random() * 60 + 15),
          skipEnabled: Math.random() > 0.5
        },

        // Targeting capabilities
        targetingOptions: {
          geographic: ['country', 'region', 'city'].filter(() => Math.random() > 0.3),
          demographic: ['age', 'gender', 'income'].filter(() => Math.random() > 0.4),
          behavioral: ['interests', 'purchase_intent'].filter(() => Math.random() > 0.5),
          contextual: ['keywords', 'topics', 'sentiment'].filter(() => Math.random() > 0.4)
        },

        // Operational data
        isDirect: Math.random() > 0.6,
        distributionChannels: ['programmatic', 'direct'].filter(() => Math.random() > 0.3),
        safetyTier: ['universal', 'standard', 'limited'][Math.floor(Math.random() * 3)],
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),

        // Performance trends (30-day)
        trends: {
          reach: Math.random() > 0.5 ? 'up' : 'down',
          engagement: Math.random() > 0.6 ? 'up' : 'down',
          efficiency: Math.random() > 0.5 ? 'up' : 'down'
        }
      };
    });
  };

  const generateKeywordResults = (count) => {
    const keywords = [
      'business', 'technology', 'investment', 'finance', 'news', 'politics',
      'economy', 'markets', 'stocks', 'banking', 'startup', 'innovation',
      'cryptocurrency', 'trading', 'insurance', 'healthcare', 'automotive',
      'real estate', 'education', 'entertainment', 'sports', 'lifestyle',
      'travel', 'food', 'fashion', 'gaming', 'music', 'movies'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      keyword: keywords[i % keywords.length] || `keyword${i + 1}`,
      type: ['Category', 'Topic', 'Brand', 'Product', 'Intent'][i % 5],
      frequency: ['High', 'Medium', 'Low'][i % 3],

      // Enhanced metrics
      metrics: {
        searchVolume: Math.floor(Math.random() * 100000 + 10000),
        searchVolumeMonthly: Math.floor(Math.random() * 30000 + 5000),
        competition: ['High', 'Medium', 'Low'][i % 3],
        competitionScore: (Math.random() * 100).toFixed(0),
        cpc: (Math.random() * 3 + 0.5).toFixed(2),
        clickVolume: Math.floor(Math.random() * 50000 + 1000),
        impressionShare: (Math.random() * 40 + 60).toFixed(1)
      },

      // Domain associations
      associatedDomains: Math.floor(Math.random() * 500 + 50),
      topDomains: [
        'nytimes.com', 'wsj.com', 'bloomberg.com', 'cnn.com', 'bbc.com'
      ].slice(0, Math.floor(Math.random() * 4 + 2)),

      // Relevance scoring
      relevance: Math.floor(Math.random() * 20 + 75),
      contextualRelevance: Math.floor(Math.random() * 15 + 80),
      semanticRelevance: Math.floor(Math.random() * 25 + 70),

      // Trending data
      trending: Math.random() > 0.7,
      trendDirection: Math.random() > 0.5 ? 'up' : 'down',
      trendStrength: ['strong', 'moderate', 'weak'][Math.floor(Math.random() * 3)],

      // Related keywords
      relatedKeywords: keywords.slice((i * 2) % keywords.length, (i * 2 + 4) % keywords.length),
      synonyms: keywords.slice((i * 3) % keywords.length, (i * 3 + 2) % keywords.length),

      // Seasonal data
      seasonality: {
        peak: ['Q1', 'Q2', 'Q3', 'Q4'][Math.floor(Math.random() * 4)],
        variance: (Math.random() * 50 + 10).toFixed(1)
      }
    }));
  };

const [domainResults, setDomainResults] = useState(generateDomainResults(150));
const [keywordResults, setKeywordResults] = useState(generateKeywordResults(120));


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

  const prebuiltDomainSets = {
    'high-performance': {
      name: 'High Performance Domains',
      description: 'Top performing domains based on CTR and viewability',
      domains: domainResults.filter(d =>
        d.metrics.viewability >= 85 &&
        parseFloat(d.metrics.ctr) >= 2.0
      ).slice(0, 20),
      color: 'var(--openx-success)'
    },
    'premium-news': {
      name: 'Premium News Publishers',
      description: 'High-quality news and media publishers',
      domains: domainResults.filter(d =>
        d.categories.includes('News') &&
        d.relevance >= 85
      ).slice(0, 15),
      color: 'var(--openx-primary)'
    },
    'direct-only': {
      name: 'Direct Publishers',
      description: 'Publishers available through direct deals only',
      domains: domainResults.filter(d => d.isDirect).slice(0, 12),
      color: '#8b5cf6'
    }
  };

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
      distributionChannel: [], // ADD
      videoPlacement: [], // ADD
      dateRange: 30, // ADD
      geography: 'Global',
      language: [],
      contentStyle: [],
      safetyTier: [],
      isDirect: false, // ADD
      publishers: [],
      minViewability: 0,
      minCTR: 0,
      minReach: 0,
      relevance: 0,
      relevanceThreshold: 0, // ADD
      minReachThreshold: 1, // ADD
      totalReach: '0',
      minViewabilityThreshold: 0,
      minCTRVTR: 0
    });
  };

  //sort
  const getSortedData = (data) => {
    const sortedData = [...data].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'relevance':
          aValue = a.relevance;
          bValue = b.relevance;
          break;
        case 'reach':
          aValue = parseFloat(a.reach.replace('M', ''));
          bValue = parseFloat(b.reach.replace('M', ''));
          break;
        case 'viewability':
          aValue = a.metrics?.viewability || 0;
          bValue = b.metrics?.viewability || 0;
          break;
        case 'ctr':
          aValue = parseFloat(a.metrics?.ctr || 0);
          bValue = parseFloat(b.metrics?.ctr || 0);
          break;
        case 'domain':
          aValue = a.domain || a.keyword;
          bValue = b.domain || b.keyword;
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        default:
          return 0;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sortedData;
  };

  //handle export
  const exportToCSV = () => {
    setIsExporting(true);

    const data = activeTab === 'domains' ? domainResults : keywordResults;
    const sortedData = getSortedData(data);

    let csvContent = '';
    let headers = [];

    if (activeTab === 'domains') {
      headers = ['Domain', 'Publisher', 'Categories', 'Reach', 'Relevance', 'Viewability', 'CTR', 'VTR'];
      csvContent = headers.join(',') + '\n';

      sortedData.forEach(domain => {
        const row = [
          domain.domain,
          domain.publisher,
          `"${domain.categories.join(', ')}"`,
          domain.reach,
          domain.relevance,
          domain.metrics?.viewability || 'N/A',
          domain.metrics?.ctr || 'N/A',
          domain.metrics?.vtr || 'N/A'
        ];
        csvContent += row.join(',') + '\n';
      });
    } else {
      headers = ['Keyword', 'Type', 'Frequency', 'Associated Domains', 'Relevance'];
      csvContent = headers.join(',') + '\n';

      sortedData.forEach(keyword => {
        const row = [
          keyword.keyword,
          keyword.type,
          keyword.frequency,
          keyword.associatedDomains || 'N/A',
          keyword.relevance
        ];
        csvContent += row.join(',') + '\n';
      });
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsExporting(false), 1000);
  };

  //handle csv upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const domains = [];

      // Skip header row, process remaining lines
      for (let i = 1; i < lines.length; i++) {
        const domain = lines[i].trim();
        if (domain) {
          domains.push({
            id: domainResults.length + domains.length + 1,
            domain: domain,
            publisher: 'Custom Upload',
            categories: ['Custom'],
            reach: `${(Math.random() * 10 + 1).toFixed(1)}M`,
            relevance: Math.floor(Math.random() * 20 + 60),
            metrics: {
              viewability: Math.floor(Math.random() * 20 + 70),
              ctr: (Math.random() * 2 + 1).toFixed(2),
              vtr: (Math.random() * 25 + 60).toFixed(1)
            },
            isDirect: false,
            supportedFormats: ['display'],
            supportedDevices: ['desktop', 'mobile'],
            isCustom: true
          });
        }
      }

      setUploadedDomains(domains);
    };

    reader.readAsText(file);
  };

  const processUploadedDomains = () => {
    setIsUploading(true);

    // Simulate processing time
    setTimeout(() => {
      // Add uploaded domains to main results
      domainResults.push(...uploadedDomains);

      setIsUploading(false);
      setShowUploadModal(false);
      setUploadedDomains([]);

      // Show success message
      alert(`Successfully added ${uploadedDomains.length} custom domains!`);
    }, 2000);
  };

  // Pagination logic
  const getCurrentPageData = () => {
    let data = activeTab === 'domains' ? domainResults : keywordResults;

    // Filter by selected domain set if applicable
    if (activeTab === 'domains' && selectedDomainSet && prebuiltDomainSets[selectedDomainSet]) {
      const setDomainIds = prebuiltDomainSets[selectedDomainSet].domains.map(d => d.id);
      data = data.filter(domain => setDomainIds.includes(domain.id));
    }

    const sortedData = getSortedData(data);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
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

            {/* Distribution Channel */}
            <div className="filter-section">
              <h3 className="filter-title">Distribution Channel</h3>
              {['Programmatic', 'Direct', 'Private Marketplace', 'Programmatic Guaranteed'].map(channel => (
                <label key={channel} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.distributionChannel.includes(channel)}
                    onChange={() => toggleArrayFilter('distributionChannel', channel)}
                  />
                  <span className="checkbox-text">{channel}</span>
                </label>
              ))}
            </div>

            {/* Video Placement */}
            <div className="filter-section">
              <h3 className="filter-title">Video Placement</h3>
              {['instream', 'outstream', 'rewarded', 'interstitial'].map(placement => (
                <label key={placement} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.videoPlacement.includes(placement)}
                    onChange={() => toggleArrayFilter('videoPlacement', placement)}
                  />
                  <span className="checkbox-text">{placement}</span>
                </label>
              ))}
            </div>

            {/* Date Range */}
            <div className="filter-section">
              <h3 className="filter-title">Date Range</h3>
              <select
                value={filters.dateRange}
                onChange={(e) => updateFilter('dateRange', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--openx-border)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'var(--openx-surface)',
                  color: 'var(--openx-text-primary)'
                }}
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={60}>Last 60 days</option>
                <option value={90}>Last 90 days</option>
              </select>
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

            {/* Safety Tier */}
            <div className="filter-section">
              <h3 className="filter-title">Safety Tier</h3>
              {['Universal', 'Standard', 'Limited', 'Restricted'].map(tier => (
                <label key={tier} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.safetyTier.includes(tier)}
                    onChange={() => toggleArrayFilter('safetyTier', tier)}
                  />
                  <span className="checkbox-text">{tier}</span>
                </label>
              ))}
            </div>

            {/* Direct Publishers Checkbox */}
            <div className="filter-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.isDirect}
                  onChange={(e) => updateFilter('isDirect', e.target.checked)}
                />
                <span className="checkbox-text" style={{ fontWeight: 500 }}>Direct Publishers Only</span>
              </label>
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

            {/*Relevance scoring*/}
            <div className="filter-section">
              <h3 className="filter-title">Relevance Scoring</h3>

              <div className="slider-group">
                <div className="slider-container">
                  <label className="slider-label">Min. Relevance Score: {filters.relevance}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.relevance}
                    onChange={(e) => updateFilter('relevance', parseInt(e.target.value))}
                    className="slider slider-blue"
                  />
                </div>
              </div>

              <div style={{
                fontSize: '12px',
                color: 'var(--openx-text-secondary)',
                marginTop: '8px',
                backgroundColor: 'var(--openx-background)',
                padding: '8px',
                borderRadius: '4px'
              }}>
                💡 Relevance combines contextual matching, keyword alignment, and content quality scores
              </div>
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
                  placeholder={searchStage === 1
                    ? "Search for categories, keywords, or audience..."
                    : "Refine your search..."
                  }
                  value={searchStage === 1 ? searchQuery : (refinedQuery || searchQuery)}
                  onChange={(e) => {
                    if (searchStage === 1) {
                      handleSearchInputChange(e);
                    } else {
                      setRefinedQuery(e.target.value);
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="search-input"
                  style={{
                    borderColor: searchStage === 2 ? 'var(--openx-warning)' : 'var(--openx-border)'
                  }}
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
                    {searchStage === 1 ? 'Search' : 'Refine'}
                  </>
                )}
              </button>
            </div>
            {searchStage === 2 && (
              <div style={{
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                borderRadius: '6px',
                padding: '12px 16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span className="tag tag-orange">Stage 2</span>
                <span style={{ color: 'var(--openx-text-primary)', fontSize: '14px', fontWeight: 500 }}>
                  🔍 Refining: "{searchQuery}"
                </span>
                <button
                  onClick={() => {
                    setSearchStage(1);
                    setRefinedQuery('');
                    setSearchContext(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--openx-text-secondary)',
                    cursor: 'pointer',
                    marginLeft: 'auto',
                    padding: '4px'
                  }}
                >
                  <XIcon />
                </button>
              </div>
            )}

            {/* Quick Filters Row */}
            <div className="quick-filters">
              <span className="quick-filter">Format: {filters.mediaSubtype.join(', ') || 'All'}</span>
              <span className="quick-filter">GEO: {filters.geography}</span>
              <span className="quick-filter">Channel: {filters.distributionChannel.join(', ') || 'All'}</span>
              <span className="quick-filter">Placement: {filters.videoPlacement.join(', ') || 'All'}</span>
              <span className="quick-filter">Min. Relevance: {filters.relevanceThreshold}%</span>
              <span className="quick-filter">Min. Reach: {filters.minReachThreshold}M+</span>
              <span className="quick-filter">Min. Viewability: {filters.minViewabilityThreshold}%</span>
              <span className="quick-filter">Min. CTR/VTR: {filters.minCTRVTR}%</span>
              <span className="quick-filter">Period: {filters.dateRange} days</span>
              {filters.isDirect && <span className="quick-filter">Direct Only</span>}
            </div>
          </div>

          {/* Search Context & Intelligence Display */}
          {searchContext && (
            <div className="search-context-panel">
              <div className="context-header">
                <div className="context-info">
                  <h3 className="context-title">
                    🎯 Context: {searchContext.primaryContext.charAt(0).toUpperCase() + searchContext.primaryContext.slice(1)}
                  </h3>
                  <p className="context-description">
                    Search Stage {refinementStage} | Found {searchContext.detectedKeywords.length} relevant keywords
                    {searchStage === 2 && <span style={{ color: 'var(--openx-warning)' }}> | Refinement Mode</span>}
                  </p>
                </div>
                <button onClick={clearSearchContext} className="context-clear-btn">
                  <XIcon />
                </button>
              </div>

              {searchStage === 2 && (
                <div className="context-section">
                  <h4 className="context-section-title">Original Search:</h4>
                  <div className="context-tags">
                    <span className="tag tag-blue">{searchQuery}</span>
                  </div>
                </div>
              )}

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

              <div className="context-section">
                <h4 className="context-section-title">
                  {searchStage === 1 ? 'Refine Your Search:' : 'Further Refinements:'}
                </h4>
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

              {/* NEW: Suggested Exclusions */}
              {searchContext.suggestedExclusions && searchContext.suggestedExclusions.length > 0 && (
                <div className="context-section">
                  <h4 className="context-section-title">Suggested Exclusions:</h4>
                  <div className="refinement-options">
                    {searchContext.suggestedExclusions.map((exclusion, index) => (
                      <button
                        key={index}
                        className="refinement-btn"
                        style={{
                          backgroundColor: 'rgba(244, 67, 54, 0.1)',
                          borderColor: 'var(--openx-error)',
                          color: 'var(--openx-error)'
                        }}
                        onClick={() => handleRefinementSearch(`exclude ${exclusion}`)}
                      >
                        ➖ Exclude {exclusion}
                      </button>
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
          {/* <div className="set-tab-container">
            <div className="set-tab-info">
              <div className="set-tab-icon">i</div>
              <div>
                <div className="set-tab-text">Showing deals matching:</div>
                <div className="set-tab-description">create premium auto campaign</div>
              </div>
            </div>
            <button className="clear-selection-btn">Clear Selection</button>
          </div> */}

          {selectedDomainSet && (
            <div style={{
              backgroundColor: `${prebuiltDomainSets[selectedDomainSet].color}15`,
              border: `1px solid ${prebuiltDomainSets[selectedDomainSet].color}`,
              borderRadius: '6px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{
                  fontWeight: '500',
                  color: prebuiltDomainSets[selectedDomainSet].color,
                  fontSize: '14px'
                }}>
                  📋 Active Set: {prebuiltDomainSets[selectedDomainSet].name}
                </span>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--openx-text-secondary)',
                  marginTop: '2px'
                }}>
                  Showing {prebuiltDomainSets[selectedDomainSet].domains.length} domains from this set
                </div>
              </div>
              <button
                onClick={() => setSelectedDomainSet(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--openx-text-secondary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <XIcon />
              </button>
            </div>
          )}

          {/* Campaign Cards Grid
          <div className="campaign-cards-grid">
            {campaignData.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-card-header">
                  <input type="checkbox" className="campaign-checkbox" />
                  <div className="campaign-header-right">
                    <div className={`campaign-status status-${campaign.status}`}>
                      {campaign.status}
                    </div>
                    <div className={`match-percentage ${campaign.match >= 90 ? 'match-high' :
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
                      className={`budget-progress ${campaign.budget.status === 'On track' ? 'budget-on-track' :
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
          </div> */}

          <div className="sort-controls" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            backgroundColor: 'var(--openx-surface)',
            padding: '12px 16px',
            borderRadius: '6px',
            border: '1px solid var(--openx-border)'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--openx-text-primary)' }}>
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--openx-border)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: 'var(--openx-surface)'
                }}
              >
                <option value="relevance">Relevance</option>
                <option value="reach">Reach</option>
                <option value="viewability">Viewability</option>
                <option value="ctr">CTR/VTR</option>
                <option value="domain">Domain Name</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn btn-secondary btn-small"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>

          <div className="prebuild-sets-container" style={{
            backgroundColor: 'var(--openx-surface)',
            border: '1px solid var(--openx-border)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--openx-text-primary)',
              marginBottom: '16px'
            }}>
              📋 Prebuild Domain Sets
            </h3>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(prebuiltDomainSets).map(([key, set]) => (
                <div
                  key={key}
                  style={{
                    border: `2px solid ${set.color}`,
                    borderRadius: '8px',
                    padding: '12px',
                    backgroundColor: `${set.color}10`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '200px'
                  }}
                  onClick={() => {
                    // Handle set selection - we'll implement this in next step
                    console.log('Selected set:', key);
                  }}
                >
                  <div style={{
                    fontWeight: '500',
                    color: set.color,
                    marginBottom: '4px',
                    fontSize: '14px'
                  }}>
                    {set.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--openx-text-secondary)',
                    marginBottom: '8px'
                  }}>
                    {set.description}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--openx-text-primary)'
                  }}>
                    {set.domains.length} domains
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <button
              onClick={() => { setActiveTab('domains'); setCurrentPage(1); }}
              className={`tab ${activeTab === 'domains' ? 'tab-active' : 'tab-inactive'}`}
            >
              Domains
            </button>
            <button
              onClick={() => { setActiveTab('keywords'); setCurrentPage(1); }}
              className={`tab ${activeTab === 'keywords' ? 'tab-active' : 'tab-inactive'}`}
            >
              Keywords
            </button>
          </div>

          {/* View Controls */}
          {activeTab === 'domains' && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              backgroundColor: 'var(--openx-surface)',
              padding: '16px 20px',
              borderRadius: '8px',
              border: '1px solid var(--openx-border)'
            }}>
              {/* View Mode Toggle */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setActiveView('performance')}
                  className={`btn btn-small ${activeView === 'performance' ? 'btn-success' : 'btn-secondary'}`}
                >
                  📊 Performance View
                </button>
                <button
                  onClick={() => setActiveView('relevance')}
                  className={`btn btn-small ${activeView === 'relevance' ? 'btn-primary-outline' : ''}`}
                  style={{
                    backgroundColor: activeView === 'relevance' ? '#8b5cf6' : 'transparent',
                    color: activeView === 'relevance' ? 'white' : '#8b5cf6',
                    borderColor: '#8b5cf6'
                  }}
                >
                  🎯 Relevance View
                </button>
              </div>

              {/* Metrics Display Toggle */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--openx-text-secondary)' }}>Display:</span>
                <button
                  onClick={() => setMetricsDisplayMode('summary')}
                  className={`btn btn-small ${metricsDisplayMode === 'summary' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setMetricsDisplayMode('detailed')}
                  className={`btn btn-small ${metricsDisplayMode === 'detailed' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Detailed
                </button>
              </div>
            </div>
          )}

          {/* Results and Actions Section */}
          <div className="results-container">
            {/* Results Section */}
            <div className={`results-section ${activeTab === 'domains' ? 'section-green' : 'section-purple'}`}>
              <h2 className="section-title">
                {activeTab === 'domains' ? 'Domain Results' : 'Keyword Results'}
              </h2>

              <div className="results-list">
                {getCurrentPageData().map((item) => (
                  <div key={item.id} className="result-item">
                    <div className="result-content">
                      <div className="result-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedResults.includes(item.id)}
                          onChange={() => handleResultSelect(item.id)}
                        />
                      </div>
                      <div className="result-main">
                        <h3 className="result-title">
                          {activeTab === 'domains' ? item.domain : item.keyword}
                        </h3>
                        <p className="result-subtitle">
                          {activeTab === 'domains'
                            ? `Categories: ${item.categories.join(', ')}`
                            : `Type: ${item.type} | Frequency: ${item.frequency}`}
                        </p>
                      </div>
                      <div className="result-metrics">
                        {activeTab === 'domains' ? (
                          <>
                            <div className="metric">Reach: {item.reach}</div>
                            <div className="metric">Relevance: {item.relevance}</div>
                          </>
                        ) : (
                          <>
                            <div className="metric">{item.urls} URLs</div>
                            <div className="metric">Relevance: {item.relevance}</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Pagination />
              </div>

              {/* Action Buttons for Domains / Keywords */}
              <div className="action-buttons">
                {activeTab === 'domains' ? (
                  <>
                    <button type="button" className="btn btn-success-outline btn-medium">Exclude Selected</button>
                    {/* <button type="button" className="btn btn-success-outline btn-medium">Add More Domains</button> */}
                    <button
                  className="btn btn-primary-outline btn-medium"
                  onClick={() => setShowUploadModal(true)}
                >
                  📁 Upload Domains
                </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-primary btn-medium">Add to Search</button>
                    <button type="button" className="btn btn-primary-outline btn-medium">Exclude Selected</button>
                  </>
                )}
              </div>

              {/* Export & Actions Section BELOW results */}
              <div className="export-actions-below">
                <h2 className="section-title">Export & Actions</h2>
                <div className="export-actions">
                  <button className="btn btn-secondary btn-medium" onClick={exportToCSV} disabled={isExporting}>
                    <DownloadIcon />
                    {isExporting ? 'Exporting...' : 'Export Results'}
                  </button>
                  <button
                    className="btn btn-secondary btn-medium"
                    onClick={() => setShowSaveModal(true)}
                    disabled={!searchQuery.trim()}>
                    <PlusIcon />
                    Save Search
                  </button>
                </div>
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

      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--openx-surface)',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: 'var(--openx-shadow-lg)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--openx-text-primary)' }}>
                Upload Domain List
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <XIcon />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: 'var(--openx-text-secondary)', marginBottom: '12px' }}>
                Upload a CSV file with domain names. Expected format:
              </p>
              <div style={{
                backgroundColor: 'var(--openx-background)',
                padding: '12px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: 'var(--openx-text-primary)'
              }}>
                domain<br />
                example.com<br />
                another-site.com<br />
                news-site.org
              </div>
            </div>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px dashed var(--openx-border)',
                borderRadius: '6px',
                marginBottom: '16px',
                cursor: 'pointer'
              }}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUploadModal(false)}
                className="btn btn-secondary btn-medium"
              >
                Cancel
              </button>
              <button
                onClick={processUploadedDomains}
                className="btn btn-primary btn-medium"
                disabled={uploadedDomains.length === 0 || isUploading}
              >
                {isUploading ? 'Processing...' : `Add ${uploadedDomains.length} Domains`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainSearchApp;