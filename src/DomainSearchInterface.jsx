import React, { useState, useEffect } from 'react';
import './DomainSearchApp.css';

// Icon components (you can replace these with your preferred icon library)
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

const DomainSearchApp = () => {
  const [activeTab, setActiveTab] = useState('domains');
  const [searchQuery, setSearchQuery] = useState('premium news sites with high viewability for finance audiences');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  
  // Filter states
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

  // Sample data
  const domainResults = [
    {
      domain: 'nytimes.com',
      categories: ['News', 'Business'],
      reach: '15.4M',
      relevance: '92%',
      viewability: '88%',
      ctr: '2.1%',
      spend: '$45K'
    },
    {
      domain: 'wsj.com',
      categories: ['Business', 'Finance'],
      reach: '10.2M',
      relevance: '87%',
      viewability: '91%',
      ctr: '1.9%',
      spend: '$38K'
    },
    {
      domain: 'cnn.com',
      categories: ['News', 'Politics'],
      reach: '12.6M',
      relevance: '85%',
      viewability: '86%',
      ctr: '1.7%',
      spend: '$42K'
    }
  ];

  const keywordResults = [
    {
      keyword: 'business',
      type: 'Category',
      frequency: 'High',
      urls: '9.6M',
      relevance: '95%'
    },
    {
      keyword: 'technology',
      type: 'Topic',
      frequency: 'Medium',
      urls: '6.4M',
      relevance: '84%'
    },
    {
      keyword: 'investment',
      type: 'Topic',
      frequency: 'Medium',
      urls: '4.1M',
      relevance: '82%'
    }
  ];

  const bundlePerformance = {
    totalReach: '38.2M',
    ecpm: '$3.24',
    bidRate: '0.72',
    viewability: '88%'
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

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Discover Inventory</h1>
        <p className="header-subtitle">Find and select relevant inventory using natural language search</p>
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

            {/* Distribution Channel */}
            <div className="filter-section">
              <h3 className="filter-title">Distribution Channel</h3>
              {['App', 'Site'].map(channel => (
                <label key={channel} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.distributionChannel?.includes(channel)}
                    onChange={() => toggleArrayFilter('distributionChannel', channel)}
                  />
                  <span className="checkbox-text">{channel}</span>
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

            {/* Safety Tier */}
            <div className="filter-section">
              <h3 className="filter-title">Safety Tier</h3>
              <div className="safety-tags">
                <span className="tag tag-green">Universal</span>
                <span className="tag tag-yellow">Family</span>
                <span className="tag tag-yellow">Standard</span>
                <span className="tag tag-orange">Mature</span>
                <span className="tag tag-red">Restricted</span>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="search-button">
                <SearchIcon />
                Search
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

          {/* Tabs */}
          <div className="tabs-container">
            <button
              onClick={() => setActiveTab('domains')}
              className={`tab ${activeTab === 'domains' ? 'tab-active' : 'tab-inactive'}`}
            >
              Domains
            </button>
            <button
              onClick={() => setActiveTab('keywords')}
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
                  {domainResults.map((domain, index) => (
                    <div key={index} className="result-item">
                      <div className="result-content">
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
                  
                  <button className="more-results-btn">
                    + More domains...
                  </button>
                </div>
              ) : (
                <div className="results-list">
                  {keywordResults.map((keyword, index) => (
                    <div key={index} className="result-item">
                      <div className="result-content">
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
                  
                  <button className="more-results-btn">
                    + More keywords...
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                {activeTab === 'domains' ? (
                  <>
                    <button className="btn btn-primary btn-green">Create Bundle</button>
                    <button className="btn btn-secondary btn-green-outline">Exclude Domains</button>
                    <button className="btn btn-secondary btn-green-outline">Add More Domains</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-primary btn-purple">Add to Search</button>
                    <button className="btn btn-secondary btn-purple-outline">Exclude Keywords</button>
                  </>
                )}
              </div>

              {/* Bundle Performance */}
              {activeTab === 'domains' && (
                <div className="bundle-performance">
                  <h3 className="performance-title">Bundle Performance</h3>
                  <p className="performance-text">
                    Total Reach: {bundlePerformance.totalReach} | ECPM: {bundlePerformance.ecpm} | 
                    Bid Rate: {bundlePerformance.bidRate} | Viewability: {bundlePerformance.viewability}
                  </p>
                </div>
              )}
            </div>

            {/* Suggestions Section */}
            <div className={`suggestions-section ${activeTab === 'domains' ? 'section-green' : 'section-purple'}`}>
              <h2 className="section-title">
                {activeTab === 'domains' ? 'Suggested Actions' : 'Suggested Refinements'}
              </h2>
              
              {activeTab === 'domains' ? (
                <div className="suggestions-list">
                  <div className="suggestion-card card-blue">
                    <h3 className="suggestion-title">Performance Optimization</h3>
                    <p className="suggestion-text">
                      Consider filtering by viewability &gt; 85% to improve campaign performance
                    </p>
                  </div>
                  
                  <div className="suggestion-card card-green">
                    <h3 className="suggestion-title">Reach Expansion</h3>
                    <p className="suggestion-text">
                      Add business and technology domains to increase total reach by 40%
                    </p>
                  </div>
                  
                  <div className="suggestion-card card-purple">
                    <h3 className="suggestion-title">Cost Efficiency</h3>
                    <p className="suggestion-text">
                      Include programmatic direct inventory to reduce ECPM by 15%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="suggestions-list">
                  <div className="suggestion-card card-purple">
                    <h3 className="suggestion-title">Try these refinements:</h3>
                    <div className="refinement-tags">
                      <span className="refinement-tag">"finance executives"</span>
                      <span className="refinement-tag">"market trends"</span>
                      <span className="refinement-tag">"investment strategies"</span>
                    </div>
                  </div>
                  
                  <div className="suggestion-card card-gray">
                    <h3 className="suggestion-title">Keyword Insights</h3>
                    <p className="suggestion-text">
                      Business-related keywords show 23% higher engagement rates for finance audiences
                    </p>
                  </div>
                </div>
              )}

              {/* Export Actions */}
              <div className="export-actions">
                <button className="btn btn-secondary btn-gray">
                  <DownloadIcon />
                  Export Results
                </button>
                <button className="btn btn-secondary btn-gray">
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
          className="toggle-filters-btn"
        >
          <FilterIcon />
        </button>
      )}
    </div>
  );
};

export default DomainSearchApp;