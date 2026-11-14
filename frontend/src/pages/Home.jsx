import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Code,
  Palette,
  Layers,
  Database,
  BarChart,
  Megaphone,
  Globe,
  Award,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const POPULAR_CATEGORIES = [
  { name: 'Software Development', icon: Code, count: '30+ Jobs', color: 'from-blue-500 to-indigo-600' },
  { name: 'Full Stack Development', icon: Layers, count: '24+ Jobs', color: 'from-indigo-500 to-purple-600' },
  { name: 'Frontend Development', icon: Globe, count: '18+ Jobs', color: 'from-purple-500 to-pink-600' },
  { name: 'Backend Development', icon: Database, count: '22+ Jobs', color: 'from-emerald-500 to-teal-600' },
  { name: 'Artificial Intelligence', icon: Cpu, count: '15+ Jobs', color: 'from-amber-500 to-orange-600' },
  { name: 'UI/UX Design', icon: Palette, count: '14+ Jobs', color: 'from-rose-500 to-pink-600' },
  { name: 'Data Science', icon: BarChart, count: '16+ Jobs', color: 'from-cyan-500 to-blue-600' },
  { name: 'DevOps', icon: TrendingUp, count: '12+ Jobs', color: 'from-teal-500 to-emerald-600' },
];

const POPULAR_SEARCH_TAGS = [
  'React.js',
  'Node.js',
  'Full Stack',
  'DevOps',
  'Python',
  'UI/UX Design',
  'Bengaluru',
  'Pune',
  'Remote',
];

const Home = () => {
  const { toggleBookmark, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [stats, setStats] = useState({
    jobsCount: 120,
    companiesCount: 20,
    seekersCount: 2000,
    interviewsScheduled: 350,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [jobsRes, compRes] = await Promise.all([
          api.get('/jobs?limit=6&sort=popular'),
          api.get('/companies?limit=6'),
        ]);

        if (jobsRes.data.success) {
          setFeaturedJobs(jobsRes.data.jobs);
          if (jobsRes.data.total) {
            setStats((prev) => ({ ...prev, jobsCount: jobsRes.data.total }));
          }
        }
        if (compRes.data.success) {
          setTopCompanies(compRes.data.companies);
          if (compRes.data.total) {
            setStats((prev) => ({ ...prev, companiesCount: compRes.data.total }));
          }
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (locationTerm.trim()) params.append('location', locationTerm.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickTag = (tag) => {
    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 pt-16 sm:pt-24 pb-20 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        {/* Decorative background glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 shadow-sm border border-brand-200 dark:border-brand-800">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Over 10,000+ Verified Tech Jobs Across India</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Find Your Next Career Move on{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              JobNova
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Inspired by Naukri, Indeed & LinkedIn. Discover high-paying engineering, product, design, and management opportunities with top Indian enterprises and funded startups.
          </p>

          {/* Two-Input Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 max-w-4xl mx-auto bg-white dark:bg-slate-900 p-3 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-3 transition-colors"
          >
            {/* Keyword Input */}
            <div className="flex-1 flex items-center gap-3 px-3 w-full">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800" />

            {/* Location Input */}
            <div className="flex-1 flex items-center gap-3 px-3 w-full">
              <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
              <input
                type="text"
                placeholder="City (Bengaluru, Pune, Remote)..."
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                className="w-full py-2.5 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition shrink-0 flex items-center justify-center gap-2"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Search Tags */}
          <div className="mt-5 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Popular Searches:</span>
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTag(tag)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Metrics Counter Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{stats.jobsCount}+</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Live Listings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">{stats.companiesCount}+</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Hiring Companies</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">30</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Job Categories</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Verified Employers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Explore Roles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Popular Job Categories
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose from 30 specialized domains with verified openings
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {POPULAR_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-card-hover transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-110 transition-transform mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition truncate">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Job Listings
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top paying roles with direct interview tracks from reputable employers
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition"
          >
            <span>Browse All {stats.jobsCount}+ Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </div>
        )}
      </section>

      {/* Top Hiring Companies */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Top Companies Actively Hiring
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Explore open positions at India's leading technology powerhouses and fast-growing unicorns
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCompanies.map((company) => (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-card-hover transition-all flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="font-bold text-lg text-brand-600 dark:text-brand-400">{company.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition truncate">
                      {company.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{company.industry}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {company.location?.split(',')[0]}
                    </span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                      {company.activeJobsCount || 6} Open Jobs
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/companies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-800 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition shadow-sm"
            >
              <span>Explore All 20+ Companies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How JobNova Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            How JobNova Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Seamless workflow for candidates seeking growth and employers looking for talent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-extrabold text-lg flex items-center justify-center mb-6">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Build Your Profile</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Upload your resume in PDF/DOCX, add skills, verified education, and work experience in under 2 minutes.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-extrabold text-lg flex items-center justify-center mb-6">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1-Click Apply & Match</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Filter by INR salary, city, work mode, and experience. Submit applications with custom cover letters.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-extrabold text-lg flex items-center justify-center mb-6">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Track & Get Hired</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Receive real-time notifications for Shortlists, schedule interviews on Google Meet, and accept offer letters.
            </p>
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate CTA */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
                For Job Seekers
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Looking for Your Next Big Opportunity?</h3>
              <p className="text-sm text-brand-100 leading-relaxed max-w-md">
                Create a free account, browse 100+ high-growth tech positions, and get directly discovered by recruiters.
              </p>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-bold text-sm shadow-md hover:bg-brand-50 transition"
                >
                  <span>Create Free Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Employer CTA */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-400 uppercase tracking-wider">
                For Employers
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Hiring High-Performance Talent?</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                Publish job openings, filter applicants with our integrated ATS, and schedule interviews seamlessly.
              </p>
              <div className="pt-2">
                <Link
                  to="/post-job"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md transition"
                >
                  <span>Post a Job Opening</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
