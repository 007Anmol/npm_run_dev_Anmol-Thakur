import React, { useState, useEffect } from 'react';

// Types
interface LegalCase {
  id: string;
  title: string;
  citation: string;
  court: string;
  date: string;
  judges: string[];
  summary: string;
  fullText?: string;
  category: string[];
  statutes: string[];
  tags: string[];
}

interface FilterOptions {
  court: string;
  category: string;
  yearFrom: string;
  yearTo: string;
  searchQuery: string;
}

const IndianLegalCaseLibrary: React.FC = () => {
  // State
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<LegalCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterOptions>({
    court: '',
    category: '',
    yearFrom: '',
    yearTo: '',
    searchQuery: '',
  });

  // Courts in India
  const courts = [
    'Supreme Court of India',
    'High Court of Delhi',
    'High Court of Bombay',
    'High Court of Calcutta',
    'High Court of Madras',
    'Other High Courts',
    'District Courts',
  ];

  // Legal categories
  const categories = [
    'Constitutional Law',
    'Criminal Law',
    'Civil Law',
    'Family Law',
    'Corporate Law',
    'Environmental Law',
    'Intellectual Property',
    'Tax Law',
    'Labor Law',
    'Human Rights',
  ];

  // Fetch legal cases
  useEffect(() => {
    // This would typically be an API call
    const fetchLegalCases = async () => {
      try {
        // Mock data - in a real app, you would fetch from an API
        const mockCases: LegalCase[] = [
          {
            id: '1',
            title: 'Kesavananda Bharati v. State of Kerala',
            citation: 'AIR 1973 SC 1461',
            court: 'Supreme Court of India',
            date: '1973-04-24',
            judges: ['S.M. Sikri', 'A.N. Ray', 'D.G. Palekar', 'H.R. Khanna'],
            summary: 'Established the basic structure doctrine, which limits Parliament\'s power to amend the Constitution.',
            category: ['Constitutional Law'],
            statutes: ['Constitution of India'],
            tags: ['Basic Structure Doctrine', 'Constitutional Amendment'],
          },
          {
            id: '2',
            title: 'Mohd. Ahmed Khan v. Shah Bano Begum',
            citation: '1985 SCR (3) 844',
            court: 'Supreme Court of India',
            date: '1985-04-23',
            judges: ['Y.V. Chandrachud', 'Ranganath Misra', 'D.A. Desai', 'O. Chinnappa Reddy', 'E.S. Venkataramiah'],
            summary: 'Landmark case concerning the rights of Muslim women to maintenance after divorce.',
            category: ['Family Law', 'Constitutional Law'],
            statutes: ['Muslim Women (Protection of Rights on Divorce) Act'],
            tags: ['Maintenance', 'Muslim Personal Law'],
          },
          {
            id: '3',
            title: 'Vishaka v. State of Rajasthan',
            citation: 'AIR 1997 SC 3011',
            court: 'Supreme Court of India',
            date: '1997-08-13',
            judges: ['J.S. Verma', 'Sujata Manohar', 'B.N. Kirpal'],
            summary: 'Established guidelines to address sexual harassment at workplace before the enactment of legislation.',
            category: ['Labor Law', 'Constitutional Law', 'Human Rights'],
            statutes: ['Constitution of India', 'Sexual Harassment of Women at Workplace Act'],
            tags: ['Sexual Harassment', 'Workplace Rights', 'Gender Justice'],
          },
          {
            id: '4',
            title: 'Indian Council for Enviro-Legal Action v. Union of India',
            citation: 'AIR 1996 SC 1446',
            court: 'Supreme Court of India',
            date: '1996-02-13',
            judges: ['Kuldip Singh', 'Faizan Uddin'],
            summary: 'Significant case on environmental protection and the polluter pays principle.',
            category: ['Environmental Law'],
            statutes: ['Environment Protection Act, 1986'],
            tags: ['Polluter Pays Principle', 'Environmental Protection'],
          },
          {
            id: '5',
            title: 'M.C. Mehta v. Union of India (Taj Trapezium Case)',
            citation: 'AIR 1997 SC 734',
            court: 'Supreme Court of India',
            date: '1996-12-30',
            judges: ['Kuldip Singh', 'Faizan Uddin'],
            summary: 'Landmark case concerning protection of the Taj Mahal from environmental pollution.',
            category: ['Environmental Law'],
            statutes: ['Environment Protection Act, 1986', 'Air (Prevention and Control of Pollution) Act, 1981'],
            tags: ['Monument Protection', 'Air Pollution'],
          },
        ];
        
        setCases(mockCases);
        setFilteredCases(mockCases);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching legal cases:', error);
        setLoading(false);
      }
    };

    fetchLegalCases();
  }, []);

  // Filter cases based on selected filters
  useEffect(() => {
    const filtered = cases.filter((legalCase) => {
      // Court filter
      if (filters.court && legalCase.court !== filters.court) {
        return false;
      }

      // Category filter
      if (filters.category && !legalCase.category.includes(filters.category)) {
        return false;
      }

      // Year range filter
      const caseYear = new Date(legalCase.date).getFullYear();
      if (
        (filters.yearFrom && caseYear < parseInt(filters.yearFrom)) ||
        (filters.yearTo && caseYear > parseInt(filters.yearTo))
      ) {
        return false;
      }

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          legalCase.title.toLowerCase().includes(query) ||
          legalCase.summary.toLowerCase().includes(query) ||
          legalCase.tags.some(tag => tag.toLowerCase().includes(query)) ||
          legalCase.statutes.some(statute => statute.toLowerCase().includes(query))
        );
      }

      return true;
    });

    setFilteredCases(filtered);
  }, [cases, filters]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      court: '',
      category: '',
      yearFrom: '',
      yearTo: '',
      searchQuery: '',
    });
  };

  // Handle case selection
  const handleCaseSelect = (legalCase: LegalCase) => {
    setSelectedCase(legalCase);
  };

  // Back to list
  const backToList = () => {
    setSelectedCase(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-black text-white p-4">
        <h1 className="text-2xl font-bold">Indian Legal Case Library</h1>
      </header>

      <main className="flex-grow p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading legal cases...</p>
          </div>
        ) : selectedCase ? (
          <div className="bg-white rounded-lg shadow p-6">
            <button 
              onClick={backToList}
              className="mb-4 bg-black text-black px-4 py-2 rounded hover:bg-blue-800"
            >
              ← Back to Cases
            </button>
            
            <h2 className="text-2xl font-bold mb-2">{selectedCase.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600"><strong>Citation:</strong> {selectedCase.citation}</p>
                <p className="text-gray-600"><strong>Court:</strong> {selectedCase.court}</p>
                <p className="text-gray-600"><strong>Date:</strong> {new Date(selectedCase.date).toLocaleDateString('en-IN')}</p>
              </div>
              <div>
                <p className="text-gray-600"><strong>Judges:</strong> {selectedCase.judges.join(', ')}</p>
                <p className="text-gray-600"><strong>Categories:</strong> {selectedCase.category.join(', ')}</p>
                <p className="text-gray-600"><strong>Statutes:</strong> {selectedCase.statutes.join(', ')}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-gray-800">{selectedCase.summary}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCase.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-black px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {selectedCase.fullText && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Full Text</h3>
                <div className="bg-gray-50 p-4 rounded border">
                  <p className="text-gray-800 whitespace-pre-line">{selectedCase.fullText}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4">Filters</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  name="searchQuery"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search cases, tags, statutes..."
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Court</label>
                <select
                  name="court"
                  value={filters.court}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Courts</option>
                  {courts.map((court, index) => (
                    <option key={index} value={court}>{court}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-1">Year From</label>
                  <input
                    type="number"
                    name="yearFrom"
                    value={filters.yearFrom}
                    onChange={handleFilterChange}
                    placeholder="From"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Year To</label>
                  <input
                    type="number"
                    name="yearTo"
                    value={filters.yearTo}
                    onChange={handleFilterChange}
                    placeholder="To"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Reset Filters
              </button>
            </div>
            
            <div className="lg:col-span-3">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">Legal Cases ({filteredCases.length})</h2>
                <div className="text-gray-600">
                  {filteredCases.length} of {cases.length} cases
                </div>
              </div>
              
              {filteredCases.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600">No cases match your filters. Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCases.map((legalCase) => (
                    <div
                      key={legalCase.id}
                      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleCaseSelect(legalCase)}
                    >
                      <h3 className="text-xl font-semibold mb-2 text-black">{legalCase.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-sm text-gray-600">
                        <p><strong>Citation:</strong> {legalCase.citation}</p>
                        <p><strong>Court:</strong> {legalCase.court}</p>
                        <p><strong>Date:</strong> {new Date(legalCase.date).toLocaleDateString('en-IN')}</p>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{legalCase.summary}</p>
                      <div className="flex flex-wrap gap-2">
                        {legalCase.category.map((cat, index) => (
                          <span key={index} className="bg-blue-100 text-black px-2 py-1 rounded text-xs">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Indian Legal Case Library. All rights reserved.</p>
        <p>This library is for educational purposes only and is not a substitute for legal advice.</p>
      </footer>
    </div>
  );
};

export default IndianLegalCaseLibrary;
