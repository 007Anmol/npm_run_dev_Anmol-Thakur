import React, { useState, useEffect } from "react";
import "./Lawyers.css"; // You'll need to create this CSS file separately

// Define interfaces for our data types
interface Lawyer {
  id: number;
  name: string;
  specialty: string;
  specialtyDisplay: string;
  experience: string;
  experienceYears: number;
  education: string;
  location: string;
  notableCases: string;
  keywords: string;
  image: string;
}

interface FilterState {
  specialty: string;
  experience: string;
  keyword: string;
  sort: string;
}

const Lawyers: React.FC = () => {
  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    specialty: "all",
    experience: "all",
    keyword: "",
    sort: "relevance",
  });

  // State for lawyer data (in a real app, this might come from an API)
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);

  // Initialize lawyer data
  useEffect(() => {
    // This would typically be an API call
    const lawyerData: Lawyer[] = [
      {
        id: 1,
        name: "James Wilson",
        specialty: "corporate",
        specialtyDisplay: "Corporate Law",
        experience: "senior",
        experienceYears: 15,
        education: "Harvard Law School",
        location: "New York, NY",
        notableCases:
          "Successfully negotiated $50M merger between tech companies",
        keywords: "contracts mergers acquisitions business corporate",
        image: "/api/placeholder/400/320",
      },
      {
        id: 2,
        name: "Sarah Chen",
        specialty: "corporate",
        specialtyDisplay: "Corporate Law",
        experience: "mid",
        experienceYears: 8,
        education: "Yale Law School",
        location: "San Francisco, CA",
        notableCases:
          "Secured patent portfolio protection for major tech company",
        keywords: "intellectual property patents trademarks corporate business",
        image: "/api/placeholder/400/320",
      },
      {
        id: 3,
        name: "Michael Rodriguez",
        specialty: "corporate",
        specialtyDisplay: "Corporate Law",
        experience: "senior",
        experienceYears: 12,
        education: "Columbia Law School",
        location: "Chicago, IL",
        notableCases: "Led compliance overhaul for Fortune 500 company",
        keywords: "securities regulations compliance corporate business",
        image: "/api/placeholder/400/320",
      },
      {
        id: 4,
        name: "Emily Johnson",
        specialty: "corporate",
        specialtyDisplay: "Corporate Law",
        experience: "junior",
        experienceYears: 4,
        education: "Stanford Law School",
        location: "Boston, MA",
        notableCases: "Assisted 12 startups secure Series A funding",
        keywords: "startups venture capital funding corporate business",
        image: "/api/placeholder/400/320",
      },
      {
        id: 5,
        name: "David Patel",
        specialty: "corporate",
        specialtyDisplay: "Corporate Law",
        experience: "mid",
        experienceYears: 9,
        education: "NYU Law School",
        location: "Washington, DC",
        notableCases:
          "Negotiated complex international trade agreements in 5 countries",
        keywords: "international business contracts corporate global",
        image: "/api/placeholder/400/320",
      },
      {
        id: 6,
        name: "Robert Jackson",
        specialty: "criminal",
        specialtyDisplay: "Criminal Law",
        experience: "senior",
        experienceYears: 20,
        education: "Georgetown Law",
        location: "Los Angeles, CA",
        notableCases: "Won acquittal in high-profile homicide case",
        keywords: "felony defense criminal trial jury",
        image: "/api/placeholder/400/320",
      },
      {
        id: 7,
        name: "Maria Gonzalez",
        specialty: "criminal",
        specialtyDisplay: "Criminal Law",
        experience: "mid",
        experienceYears: 7,
        education: "University of Michigan Law",
        location: "Miami, FL",
        notableCases:
          "Successfully defended executive in federal fraud investigation",
        keywords: "white collar fraud embezzlement criminal",
        image: "/api/placeholder/400/320",
      },
      {
        id: 8,
        name: "Thomas Washington",
        specialty: "criminal",
        specialtyDisplay: "Criminal Law",
        experience: "senior",
        experienceYears: 18,
        education: "UC Berkeley Law",
        location: "Philadelphia, PA",
        notableCases: "Overturned 12 wrongful convictions through appeals",
        keywords: "appeals post-conviction criminal",
        image: "/api/placeholder/400/320",
      },
      {
        id: 9,
        name: "Jessica Kim",
        specialty: "criminal",
        specialtyDisplay: "Criminal Law",
        experience: "junior",
        experienceYears: 3,
        education: "University of Texas Law",
        location: "Austin, TX",
        notableCases: "90% success rate in DUI dismissals and reductions",
        keywords: "dui dwi traffic criminal",
        image: "/api/placeholder/400/320",
      },
      {
        id: 10,
        name: "Andre Williams",
        specialty: "criminal",
        specialtyDisplay: "Criminal Law",
        experience: "mid",
        experienceYears: 10,
        education: "UCLA Law School",
        location: "Atlanta, GA",
        notableCases:
          "Successfully challenged evidence in 25+ drug-related cases",
        keywords: "drug charges possession criminal",
        image: "/api/placeholder/400/320",
      },
      {
        id: 11,
        name: "Lisa Thompson",
        specialty: "civil",
        specialtyDisplay: "Civil Law",
        experience: "senior",
        experienceYears: 17,
        education: "Duke University Law",
        location: "Seattle, WA",
        notableCases: "$4.2M settlement in major personal injury case",
        keywords: "personal injury accident civil",
        image: "/api/placeholder/400/320",
      },
      {
        id: 12,
        name: "Daniel Brown",
        specialty: "civil",
        specialtyDisplay: "Civil Law",
        experience: "mid",
        experienceYears: 9,
        education: "Vanderbilt Law School",
        location: "Denver, CO",
        notableCases: "Won jury verdict in complex medical malpractice trial",
        keywords: "medical malpractice negligence civil",
        image: "/api/placeholder/400/320",
      },
      {
        id: 13,
        name: "Olivia Martinez",
        specialty: "civil",
        specialtyDisplay: "Civil Law",
        experience: "senior",
        experienceYears: 14,
        education: "University of Chicago Law",
        location: "Portland, OR",
        notableCases: "Class action settlement for workplace discrimination",
        keywords: "employment discrimination workplace civil",
        image: "/api/placeholder/400/320",
      },
      {
        id: 14,
        name: "Kevin Lee",
        specialty: "civil",
        specialtyDisplay: "Civil Law",
        experience: "junior",
        experienceYears: 5,
        education: "Fordham Law School",
        location: "San Diego, CA",
        notableCases:
          "Resolved complex boundary dispute for commercial property",
        keywords: "real estate property disputes civil",
        image: "/api/placeholder/400/320",
      },
      {
        id: 15,
        name: "Sophia Nelson",
        specialty: "civil",
        specialtyDisplay: "Civil Law",
        experience: "mid",
        experienceYears: 8,
        education: "University of Pennsylvania Law",
        location: "Dallas, TX",
        notableCases:
          "Multi-million dollar settlement in product liability case",
        keywords: "product liability defective civil",
        image: "/api/placeholder/400/320",
      },
      {
        id: 16,
        name: "Elizabeth Parker",
        specialty: "family",
        specialtyDisplay: "Family Law",
        experience: "senior",
        experienceYears: 19,
        education: "Northwestern Law School",
        location: "Minneapolis, MN",
        notableCases:
          "Successfully represented high-net-worth clients in complex divorce cases",
        keywords: "divorce custody family",
        image: "/api/placeholder/400/320",
      },
      {
        id: 17,
        name: "Jonathan Taylor",
        specialty: "family",
        specialtyDisplay: "Family Law",
        experience: "mid",
        experienceYears: 7,
        education: "Boston University Law",
        location: "Phoenix, AZ",
        notableCases:
          "Facilitated 50+ successful adoptions, including international cases",
        keywords: "adoption children family",
        image: "/api/placeholder/400/320",
      },
      {
        id: 18,
        name: "Rachel Cohen",
        specialty: "family",
        specialtyDisplay: "Family Law",
        experience: "senior",
        experienceYears: 16,
        education: "Cornell Law School",
        location: "Las Vegas, NV",
        notableCases:
          "Drafted and defended prenuptial agreements for high-profile clients",
        keywords: "prenuptial agreements marriage family",
        image: "/api/placeholder/400/320",
      },
      {
        id: 19,
        name: "Marcus Bennett",
        specialty: "family",
        specialtyDisplay: "Family Law",
        experience: "junior",
        experienceYears: 4,
        education: "University of Virginia Law",
        location: "Charlotte, NC",
        notableCases:
          "Successfully negotiated fair child support agreements in contested cases",
        keywords: "child support alimony family",
        image: "/api/placeholder/400/320",
      },
      {
        id: 20,
        name: "Aisha Robinson",
        specialty: "family",
        specialtyDisplay: "Family Law",
        experience: "mid",
        experienceYears: 11,
        education: "Emory Law School",
        location: "Detroit, MI",
        notableCases:
          "Obtained protective orders and safety provisions for vulnerable clients",
        keywords: "domestic violence restraining orders family",
        image: "/api/placeholder/400/320",
      },
    ];

    setLawyers(lawyerData);
    setFilteredLawyers(lawyerData);
  }, []);

  // Apply filters when they change
  useEffect(() => {
    filterLawyers();
  }, [filters, lawyers]);

  // Filter and sort lawyers
  const filterLawyers = () => {
    let results = [...lawyers];

    // Apply specialty filter
    if (filters.specialty !== "all") {
      results = results.filter(
        (lawyer) => lawyer.specialty === filters.specialty
      );
    }

    // Apply experience filter
    if (filters.experience !== "all") {
      results = results.filter(
        (lawyer) => lawyer.experience === filters.experience
      );
    }

    // Apply keyword filter
    if (filters.keyword.trim() !== "") {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(
        (lawyer) =>
          lawyer.keywords.toLowerCase().includes(keyword) ||
          lawyer.name.toLowerCase().includes(keyword)
      );
    }

    // Apply sorting
    if (filters.sort === "experience") {
      results.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (filters.sort === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredLawyers(results);
  };

  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    filterLawyers();
  };

  return (
    <div className="lawyers-container">
      <header className="lawyers-header">
        <h1>Find My Lawyer</h1>
        <p>Connect with the right legal professional for your needs</p>
      </header>

      <form className="lawyers-filters" onSubmit={handleSubmit}>
        <div className="filter-group">
          <label htmlFor="specialty">Specialty</label>
          <select
            id="specialty"
            name="specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
          >
            <option value="all">All Specialties</option>
            <option value="corporate">Corporate Law</option>
            <option value="criminal">Criminal Law</option>
            <option value="civil">Civil Law</option>
            <option value="family">Family Law</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="experience">Experience</label>
          <select
            id="experience"
            name="experience"
            value={filters.experience}
            onChange={handleFilterChange}
          >
            <option value="all">Any Experience</option>
            <option value="junior">1-5 Years</option>
            <option value="mid">6-10 Years</option>
            <option value="senior">10+ Years</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="keyword">Keyword Search</label>
          <input
            type="text"
            id="keyword"
            name="keyword"
            placeholder="E.g., contracts, divorce, etc."
            value={filters.keyword}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Sort By</label>
          <select
            id="sort"
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
          >
            <option value="relevance">Relevance</option>
            <option value="experience">Experience (High to Low)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        <button type="submit" className="search-btn">
          Search Lawyers
        </button>
      </form>

      <div className="lawyer-grid">
        {filteredLawyers.map((lawyer) => (
          <div key={lawyer.id} className={`lawyer-card ${lawyer.specialty}`}>
            <div className="lawyer-image">
              <img src={lawyer.image} alt={lawyer.name} />
            </div>
            <div className="lawyer-info">
              <h3 className="lawyer-name">{lawyer.name}</h3>
              <span className={`lawyer-specialty ${lawyer.specialty}`}>
                {lawyer.specialtyDisplay}
              </span>

              <div className="lawyer-details">
                <p>
                  <strong>Experience:</strong> {lawyer.experienceYears} years
                </p>
                <p>
                  <strong>Education:</strong> {lawyer.education}
                </p>
                <p>
                  <strong>Location:</strong> {lawyer.location}
                </p>
              </div>

              <div className="case-results">
                <h4>Notable Cases:</h4>
                <p>{lawyer.notableCases}</p>
              </div>

              <a href="#" className="contact-btn">
                Contact Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lawyers;
