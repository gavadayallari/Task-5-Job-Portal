import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Building,
  ShieldCheck,
} from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate real submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'general',
        subject: '',
        message: '',
      });
    }, 800);
  };

  const faqs = [
    {
      q: 'Is JobNova free for job seekers?',
      a: 'Yes, JobNova is 100% free for job seekers. You can search jobs, create a verified profile, upload resumes, apply to unlimited job listings, and receive direct recruiter interview invites with zero charges.',
    },
    {
      q: 'What resume formats are supported?',
      a: 'We support PDF, DOC, and DOCX files up to 5MB. We recommend PDF format for best formatting preservation across recruiter devices.',
    },
    {
      q: 'How do employers post jobs and verify their company?',
      a: 'Employers can register with their work email, complete their corporate profile, and post jobs. All listings and company details are verified by our trust and safety team before going live.',
    },
    {
      q: 'How do I track my application status?',
      a: 'Navigate to "My Applications" from your candidate dashboard to view real-time status updates: Applied, Under Review, Shortlisted, Interview Scheduled, Hired, or Rejected.',
    },
    {
      q: 'How can I report a fraudulent or suspicious listing?',
      a: 'Every job detail page has a "Report this job" link. You can select the reason (Scam, Incorrect Info, Expired) and our admin moderation team will investigate immediately.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            <MessageSquare className="w-3.5 h-3.5" />
            24/7 Dedicated Support
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get in Touch With JobNova
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Have questions about finding a job, hiring top Indian tech talent, or technical support?
            Our support and enterprise solutions team is here to assist you.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Corporate HQ</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Tower B, Prestige Tech Park, Outer Ring Road, Marathahalli, Bengaluru, Karnataka 560103
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Email Support</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
              <p>support@jobnova.com</p>
              <p>employers@jobnova.com</p>
              <p className="text-xs text-slate-500">Average response time: &lt; 2 hours</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Phone Helpline</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">+91 80 4567 8900</p>
              <p>Toll-Free: 1800 123 5626</p>
              <p className="text-xs text-slate-500">Mon - Sat: 9 AM - 7 PM IST</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Trust & Safety</h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
              <p>fraud-alert@jobnova.com</p>
              <p>privacy@jobnova.com</p>
              <p className="text-xs text-slate-500">Fast escalation for job issues</p>
            </div>
          </div>
        </div>

        {/* Contact Form & Office Hours Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Send Us a Message
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Fill out the form below and our dedicated team will respond promptly.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                  Thank you for reaching out to JobNova. Our team has received your inquiry and will
                  contact you at the provided email within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahul.sharma@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="candidate">Job Seeker Support</option>
                      <option value="employer">Employer & Hiring Solutions</option>
                      <option value="technical">Bug or Technical Issue</option>
                      <option value="billing">Enterprise Accounts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Inquiry regarding employer verification"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe how we can assist you..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending Message...' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>

          {/* Regional Hubs & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Regional Indian Offices
              </h3>

              <div className="space-y-4 text-sm divide-y divide-slate-100 dark:divide-slate-800">
                <div className="pt-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Bengaluru (HQ)</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Prestige Tech Park, Outer Ring Road, Marathahalli
                  </p>
                </div>
                <div className="pt-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Mumbai Hub</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Bandra Kurla Complex (BKC), Bandra East, Mumbai 400051
                  </p>
                </div>
                <div className="pt-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Pune Tech Center</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Magarpatta Cybercity, Hadapsar, Pune 411028
                  </p>
                </div>
                <div className="pt-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Delhi NCR</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Cyber City, DLF Phase 2, Gurugram, Haryana 122002
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white space-y-3 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg">Looking to Hire Fast?</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Connect with our dedicated Employer Success Specialists for bulk talent sourcing, custom company branding, and priority listing spots.
              </p>
              <div className="pt-2">
                <a
                  href="mailto:employers@jobnova.com"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition"
                >
                  Contact Employer Team
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find quick answers to common questions about using JobNova.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition"
                >
                  <span className="font-semibold text-slate-900 dark:text-white text-sm">
                    {faq.q}
                  </span>
                  <span className="text-lg font-bold text-slate-400">
                    {expandedFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 py-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

