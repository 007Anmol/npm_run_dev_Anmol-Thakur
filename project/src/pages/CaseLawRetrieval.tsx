import React, { useState } from 'react';
import { BookOpen, Search, Filter, Download, ExternalLink } from 'lucide-react';

const CaseLawRetrieval = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    jurisdiction: 'all',
    dateRange: 'all',
    caseType: 'all'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults(null);
    
    // Simulate search process
    setTimeout(() => {
      setIsSearching(false);
      setSearchResults([
        {
          id: 1,
          title: 'Smith v. Johnson',
          citation: '123 F.3d 456 (9th Cir. 2023)',
          court: 'United States Court of Appeals for the Ninth Circuit',
          date: 'June 15, 2023',
          snippet: 'The court held that landlords must provide reasonable accommodations to tenants with disabilities under the Fair Housing Act, including modifications to rental policies when necessary.',
          relevance: 95
        },
        {
          id: 2,
          title: 'Garcia v. Metropolitan Housing Authority',
          citation: '456 N.E.2d 789 (Ohio 2022)',
          court: 'Supreme Court of Ohio',
          date: 'November 3, 2022',
          snippet: 'The court found that housing authorities must engage in an interactive process with tenants requesting accommodations and cannot impose unreasonable documentation requirements.',
          relevance: 87
        },
        {
          id: 3,
          title: 'Williams v. Apartment Complex LLC',
          citation: '789 S.W.2d 123 (Tex. App. 2021)',
          court: 'Texas Court of Appeals',
          date: 'March 22, 2021',
          snippet: 'The court ruled that a tenant with a disability was entitled to keep an emotional support animal despite a "no pets" policy, as it constituted a reasonable accommodation.',
          relevance: 82
        },
        {
          id: 4,
          title: 'Thompson v. Residential Properties Inc.',
          citation: '234 A.3d 567 (Md. 2022)',
          court: 'Court of Appeals of Maryland',
          date: 'August 9, 2022',
          snippet: 'The court determined that a landlord\'s failure to timely respond to a reasonable accommodation request may itself constitute a violation of fair housing laws.',
          relevance: 78
        }
      ]);
    }, 2000);
  };

  const handleFilterChange = (filter: string, value: string) => {
    setActiveFilters({
      ...activeFilters,
      [filter]: value
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brown-50 mb-4">
          <BookOpen className="h-8 w-8 text-black" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Case Law & Statute Retrieval</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Search for relevant case law and statutes to support your legal research and decision-making.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="search-query" className="block text-sm font-medium text-black mb-1">
                  Search Query
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-black" />
                  </div>
                  <input
                    type="text"
                    id="search-query"
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="E.g., reasonable accommodation fair housing disability"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-shrink-0 flex items-end">
                <button
                  type="submit"
                  className="bg-black text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors"
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700 mb-1">
                  Jurisdiction
                </label>
                <select
                  id="jurisdiction"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={activeFilters.jurisdiction}
                  onChange={(e) => handleFilterChange('jurisdiction', e.target.value)}
                >
                  <option value="all">All Jurisdictions</option>
                  <option value="federal">Federal</option>
                  <option value="state">State</option>
                  <option value="california">California</option>
                  <option value="new-york">New York</option>
                  <option value="texas">Texas</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="date-range" className="block text-sm font-medium text-black mb-1">
                  Date Range
                </label>
                <select
                  id="date-range"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={activeFilters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="last-year">Last Year</option>
                  <option value="last-5-years">Last 5 Years</option>
                  <option value="last-10-years">Last 10 Years</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="case-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Case Type
                </label>
                <select
                  id="case-type"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  value={activeFilters.caseType}
                  onChange={(e) => handleFilterChange('caseType', e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="housing">Housing</option>
                  <option value="employment">Employment</option>
                  <option value="civil-rights">Civil Rights</option>
                  <option value="consumer">Consumer Protection</option>
                  <option value="family">Family Law</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {isSearching && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blsck mx-auto mb-4"></div>
          <p className="text-gray-700">Searching for relevant case law and statutes...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment as we analyze legal databases.</p>
        </div>
      )}
      
      {searchResults && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Search Results ({searchResults.length})
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                  <option value="relevance">Relevance</option>
                  <option value="date-desc">Date (Newest)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="court">Court</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {searchResults.map((result) => (
              <div key={result.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{result.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{result.citation}</p>
                    <p className="text-sm text-gray-700 mb-3">
                      <span className="font-medium">{result.court}</span> • {result.date}
                    </p>
                    <p className="text-gray-700 mb-4">{result.snippet}</p>
                    <div className="flex items-center space-x-4">
                      <button className="text-sm text-black hover:text-purple-800 flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </button>
                      <button className="text-sm text-black hover:text-purple-800 flex items-center">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Full Case
                      </button>
                    </div>
                  </div>
                  <div className="bg-purple-100 text-black text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {result.relevance}% Match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Search Tips</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-black font-bold mr-2">•</span>
              <span>Use specific legal terms relevant to your issue</span>
            </li>
            <li className="flex items-start">
              <span className="text-black font-bold mr-2">•</span>
              <span>Include jurisdiction if you need cases from a specific court system</span>
            </li>
            <li className="flex items-start">
              <span className="text-black font-bold mr-2">•</span>
              <span>Try different combinations of keywords for better results</span>
            </li>
            <li className="flex items-start">
              <span className="text-black font-bold mr-2">•</span>
              <span>Use quotation marks for exact phrases (e.g., "reasonable accommodation")</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            <button className="bg-purple-100 text-black px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
              Fair housing discrimination
            </button>
            <button className="bg-purple-100 text-black px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
              Eviction moratorium
            </button>
            <button className="bg-purple-100 text-black px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
              Tenant rights
            </button>
            <button className="bg-purple-100 text-black px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
              Employment discrimination
            </button>
            <button className="bg-purple-100 text-black px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
              Workers' compensation
            </button>
            <button className="bg-purple-100 text-black px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
              Child custody
            </button>
            <button className="bg-purple-100 text-black px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
              Consumer protection
            </button>
            <button className="bg-purple-100 text-black px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors">
              Small claims procedure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseLawRetrieval;