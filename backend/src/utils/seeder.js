const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Category = require('../models/Category');
const SavedJob = require('../models/SavedJob');
const Notification = require('../models/Notification');
const Report = require('../models/Report');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobnova'
    );
    console.log('✅ Connected to MongoDB for JobNova Seeding');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  }
};

const CATEGORIES_LIST = [
  { name: 'Software Development', icon: 'Code', description: 'Core software engineering, algorithms & systems' },
  { name: 'Web Development', icon: 'Globe', description: 'Responsive web apps, portals & web technologies' },
  { name: 'Frontend Development', icon: 'Layout', description: 'React, Vue, Angular, Next.js & UI architecture' },
  { name: 'Backend Development', icon: 'Server', description: 'Node.js, Python, Java, Go, APIs & databases' },
  { name: 'Full Stack Development', icon: 'Layers', description: 'End-to-end full stack web & cloud application development' },
  { name: 'Mobile App Development', icon: 'Smartphone', description: 'iOS, Android, React Native & Flutter apps' },
  { name: 'UI/UX Design', icon: 'Palette', description: 'User interface, UX research, wireframes & Figma prototyping' },
  { name: 'Graphic Design', icon: 'Image', description: 'Visual branding, digital illustrations & creative design' },
  { name: 'Data Science', icon: 'Database', description: 'Predictive modeling, data mining & scientific computing' },
  { name: 'Data Analytics', icon: 'BarChart2', description: 'Business intelligence, SQL, dashboards & reporting' },
  { name: 'Artificial Intelligence', icon: 'Cpu', description: 'Deep learning, LLMs, computer vision & generative AI' },
  { name: 'Machine Learning', icon: 'GitMerge', description: 'ML algorithms, PyTorch, TensorFlow & model training' },
  { name: 'Cyber Security', icon: 'Shield', description: 'Network security, penetration testing & cloud compliance' },
  { name: 'Cloud Computing', icon: 'Cloud', description: 'AWS, Azure, GCP infrastructure & serverless systems' },
  { name: 'DevOps', icon: 'Terminal', description: 'CI/CD pipelines, Docker, Kubernetes & site reliability' },
  { name: 'Digital Marketing', icon: 'TrendingUp', description: 'Growth marketing, paid media & conversion optimization' },
  { name: 'SEO', icon: 'Search', description: 'Organic search ranking, on-page optimization & analytics' },
  { name: 'Content Writing', icon: 'FileText', description: 'Technical writing, copywriting & content strategy' },
  { name: 'Business Development', icon: 'Briefcase', description: 'Partnerships, strategic accounts & enterprise deals' },
  { name: 'Sales & Marketing', icon: 'Target', description: 'B2B/B2C sales, lead generation & brand positioning' },
  { name: 'Human Resources', icon: 'Users', description: 'Talent acquisition, employee engagement & people ops' },
  { name: 'Finance & Accounting', icon: 'DollarSign', description: 'Financial modeling, auditing & accounting operations' },
  { name: 'Banking', icon: 'CreditCard', description: 'Retail banking, investments, risk management & fintech' },
  { name: 'Customer Support', icon: 'Headphones', description: 'Customer success, helpdesk & client assistance' },
  { name: 'Education & Teaching', icon: 'BookOpen', description: 'EdTech instruction, curriculum & academic mentorship' },
  { name: 'Healthcare', icon: 'Activity', description: 'Clinical, medical technology & healthcare administration' },
  { name: 'Engineering', icon: 'Tool', description: 'Hardware, electrical & general engineering disciplines' },
  { name: 'Mechanical Engineering', icon: 'Settings', description: 'CAD, robotics, manufacturing & thermodynamics' },
  { name: 'Civil Engineering', icon: 'Home', description: 'Structural design, construction & urban planning' },
  { name: 'Government Jobs', icon: 'Award', description: 'Public sector, municipal & competitive exam postings' },
];

const COMPANIES_DATA = [
  {
    name: 'Tata Consultancy Services',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.tcs.com',
    industry: 'Information Technology & Consulting',
    companySize: '10,000+ employees',
    foundedYear: 1968,
    location: 'Mumbai, Maharashtra',
    description: 'A global leader in IT services, consulting & business solutions with over 600,000 consultants worldwide.',
  },
  {
    name: 'Infosys',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.infosys.com',
    industry: 'Next-Gen Digital Services',
    companySize: '10,000+ employees',
    foundedYear: 1981,
    location: 'Bengaluru, Karnataka',
    description: 'Infosys is a global leader in next-generation digital services and consulting navigating enterprise cloud transitions.',
  },
  {
    name: 'Wipro Technologies',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.wipro.com',
    industry: 'IT Services & Consulting',
    companySize: '10,000+ employees',
    foundedYear: 1945,
    location: 'Bengaluru, Karnataka',
    description: 'Leading technology services and consulting company focused on building innovative solutions addressing clients’ complex digital transformation needs.',
  },
  {
    name: 'HCLTech',
    logo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.hcltech.com',
    industry: 'Enterprise Technology Solutions',
    companySize: '10,000+ employees',
    foundedYear: 1976,
    location: 'Noida, Delhi NCR',
    description: 'Supercharging progress for world-leading enterprises through industry-first engineering services and cloud engineering.',
  },
  {
    name: 'Flipkart',
    logo: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.flipkart.com',
    industry: 'E-commerce & Retail Tech',
    companySize: '5,000-10,000 employees',
    foundedYear: 2007,
    location: 'Bengaluru, Karnataka',
    description: "India's homegrown e-commerce marketplace enabling millions of consumers, sellers, and small businesses to be part of the digital commerce revolution.",
  },
  {
    name: 'Swiggy',
    logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.swiggy.com',
    industry: 'Hyperlocal Delivery & Quick Commerce',
    companySize: '5,000-10,000 employees',
    foundedYear: 2014,
    location: 'Bengaluru, Karnataka',
    description: "India's leading on-demand convenience platform, delivering food, groceries through Instamart, and instant courier services.",
  },
  {
    name: 'Zomato',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.zomato.com',
    industry: 'Food Tech & Quick Commerce',
    companySize: '5,000-10,000 employees',
    foundedYear: 2008,
    location: 'Gurugram, Delhi NCR',
    description: 'Connecting food lovers with top restaurant partners and powering grocery deliveries across 1,000+ cities in India.',
  },
  {
    name: 'Razorpay',
    logo: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=120&auto=format&fit=crop&q=80',
    website: 'https://razorpay.com',
    industry: 'FinTech & Payments Infrastructure',
    companySize: '1,000-5,000 employees',
    foundedYear: 2014,
    location: 'Bengaluru, Karnataka',
    description: 'The converged payments and neo-banking platform powering digital transactions for over 8 million Indian businesses.',
  },
  {
    name: 'Paytm',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    website: 'https://paytm.com',
    industry: 'Digital Payments & Financial Services',
    companySize: '5,000-10,000 employees',
    foundedYear: 2010,
    location: 'Noida, Delhi NCR',
    description: 'Pioneer of the mobile QR code revolution in India, offering full-stack payments and financial products.',
  },
  {
    name: 'Reliance Jio Platforms',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.jio.com',
    industry: 'Telecommunications & Cloud Platforms',
    companySize: '10,000+ employees',
    foundedYear: 2019,
    location: 'Navi Mumbai, Maharashtra',
    description: 'Building the digital foundation of India through nationwide 5G connectivity, enterprise cloud, and native digital services.',
  },
  {
    name: 'Zoho Corporation',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.zoho.com',
    industry: 'SaaS & Enterprise Business Suite',
    companySize: '10,000+ employees',
    foundedYear: 1996,
    location: 'Chennai, Tamil Nadu',
    description: 'A unique and powerful suite of 55+ software applications to run your entire business from CRM to accounting and team collaboration.',
  },
  {
    name: 'Freshworks',
    logo: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.freshworks.com',
    industry: 'Customer Engagement & IT Service Management',
    companySize: '1,000-5,000 employees',
    foundedYear: 2010,
    location: 'Chennai, Tamil Nadu',
    description: 'Freshworks makes business software people love to use, purpose-built for IT, customer service, sales, and marketing teams.',
  },
  {
    name: 'CRED',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    website: 'https://cred.club',
    industry: 'FinTech & Member Privileges',
    companySize: '500-1,000 employees',
    foundedYear: 2018,
    location: 'Bengaluru, Karnataka',
    description: 'A members-only club that rewards individuals for their financial trustworthiness and seamless credit card management.',
  },
  {
    name: 'Zerodha',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80',
    website: 'https://zerodha.com',
    industry: 'FinTech & Discount Stock Broking',
    companySize: '1,000-5,000 employees',
    foundedYear: 2010,
    location: 'Bengaluru, Karnataka',
    description: 'Pioneered zero-brokerage trading in India and powers over 10 million active retail investors through Kite and Coin.',
  },
  {
    name: 'Ola',
    logo: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=120&auto=format&fit=crop&q=80',
    website: 'https://olacabs.com',
    industry: 'Mobility & Electric Vehicles',
    companySize: '5,000-10,000 employees',
    foundedYear: 2010,
    location: 'Bengaluru, Karnataka',
    description: 'Leading ride-hailing network and EV revolution with Ola Electric FutureFactory manufacturing world-class electric two-wheelers.',
  },
  {
    name: 'PhonePe',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.phonepe.com',
    industry: 'Digital Payments & WealthTech',
    companySize: '5,000-10,000 employees',
    foundedYear: 2015,
    location: 'Bengaluru, Karnataka',
    description: 'India’s leading digital payments app with 500 million registered users handling over 45% of all UPI transactions.',
  },
  {
    name: 'Nykaa',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.nykaa.com',
    industry: 'Beauty & Fashion E-commerce',
    companySize: '1,000-5,000 employees',
    foundedYear: 2012,
    location: 'Mumbai, Maharashtra',
    description: 'Premier omnichannel lifestyle retailer for authentic cosmetics, wellness, and curated fashion across India.',
  },
  {
    name: 'Tata Elxsi',
    logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.tataelxsi.com',
    industry: 'Design & Technology Services',
    companySize: '5,000-10,000 employees',
    foundedYear: 1989,
    location: 'Bengaluru, Karnataka',
    description: 'Global provider of design and engineering services across Automotive, Media, Communications, and Healthcare sectors.',
  },
  {
    name: 'LTIMindtree',
    logo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.ltimindtree.com',
    industry: 'Digital Consulting & IT Solutions',
    companySize: '10,000+ employees',
    foundedYear: 1996,
    location: 'Mumbai, Maharashtra',
    description: 'A global technology consulting and digital solutions company that enables enterprises across industries to reimagine business models.',
  },
  {
    name: 'MakeMyTrip',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=80',
    website: 'https://www.makemytrip.com',
    industry: 'Online Travel & Hospitality Tech',
    companySize: '1,000-5,000 employees',
    foundedYear: 2000,
    location: 'Gurugram, Delhi NCR',
    description: 'India’s one-stop travel shop empowering millions of travelers with frictionless flight, hotel, and holiday bookings.',
  },
];

const CITIES = [
  'Bengaluru, Karnataka',
  'Pune, Maharashtra',
  'Hyderabad, Telangana',
  'Mumbai, Maharashtra',
  'Delhi NCR, Delhi',
  'Chennai, Tamil Nadu',
  'Ahmedabad, Gujarat',
  'Indore, Madhya Pradesh',
  'Remote',
];

const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract'];

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Purging existing collections...');
    await Promise.all([
      User.deleteMany(),
      Job.deleteMany(),
      Company.deleteMany(),
      Application.deleteMany(),
      Category.deleteMany(),
      SavedJob.deleteMany(),
      Notification.deleteMany(),
      Report.deleteMany(),
    ]);

    console.log('📂 Seeding 30 job categories...');
    const createdCategories = await Category.insertMany(CATEGORIES_LIST);
    console.log(`✅ Seeded ${createdCategories.length} categories.`);

    console.log('👤 Seeding Admin account...');
    const admin = await User.create({
      name: 'JobNova Admin',
      email: 'admin@jobnova.com',
      password: 'admin123',
      role: 'admin',
      headline: 'Platform Operations & Super Administrator',
      bio: 'Oversees platform governance, verified company compliance, and talent safety standards.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'Bengaluru, India',
      phone: '+91 99000 11223',
    });

    console.log('🏢 Seeding 10 Employer accounts & 20 Companies...');
    const employerAccounts = [];
    const createdCompanies = [];

    for (let i = 0; i < 10; i++) {
      const compData = COMPANIES_DATA[i];
      const empUser = await User.create({
        name: `HR Lead ${compData.name.split(' ')[0]}`,
        email: `hr.${compData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@jobnova.com`,
        password: 'employer123',
        role: 'employer',
        headline: `Head of Talent Acquisition @ ${compData.name}`,
        bio: `Leading technical & business hiring squads at ${compData.name}. Connect with our team for high-impact careers!`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + (i * 1234567 % 100000000)}?w=150&auto=format&fit=crop&q=80`,
        location: compData.location,
        phone: `+91 98${10000000 + i * 45678}`,
      });
      employerAccounts.push(empUser);

      const comp = await Company.create({
        ...compData,
        employer: empUser._id,
      });
      createdCompanies.push(comp);

      empUser.company = comp._id;
      empUser.companyDetails = {
        name: comp.name,
        logo: comp.logo,
        website: comp.website,
        about: comp.description,
        size: comp.companySize,
        location: comp.location,
      };
      await empUser.save();
    }

    // Create remaining 10 companies assigned randomly to employers
    for (let i = 10; i < 20; i++) {
      const compData = COMPANIES_DATA[i];
      const assignedEmp = employerAccounts[i % employerAccounts.length];
      const comp = await Company.create({
        ...compData,
        employer: assignedEmp._id,
      });
      createdCompanies.push(comp);
    }
    console.log(`✅ Seeded ${employerAccounts.length} employers and ${createdCompanies.length} companies.`);

    console.log('🧑‍💻 Seeding 20 Job Seeker accounts...');
    const SEEKER_NAMES = [
      { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', title: 'Senior Full Stack Developer', city: 'Bengaluru, Karnataka', skills: ['React.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'] },
      { name: 'Priya Patel', email: 'priya.patel@example.com', title: 'Lead UI/UX Product Designer', city: 'Pune, Maharashtra', skills: ['Figma', 'UI Design', 'Design Systems', 'User Research', 'Prototyping'] },
      { name: 'Amit Verma', email: 'amit.verma@example.com', title: 'Staff DevOps & Cloud Architect', city: 'Hyderabad, Telangana', skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'] },
      { name: 'Sneha Kulkarni', email: 'sneha.kulkarni@example.com', title: 'Data Scientist & AI Researcher', city: 'Mumbai, Maharashtra', skills: ['Python', 'Machine Learning', 'PyTorch', 'SQL', 'NLP'] },
      { name: 'Vikram Malhotra', email: 'vikram.malhotra@example.com', title: 'Backend Systems Engineer', city: 'Delhi NCR, Delhi', skills: ['Go', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka'] },
      { name: 'Ananya Deshmukh', email: 'ananya.deshmukh@example.com', title: 'Product Manager - FinTech', city: 'Bengaluru, Karnataka', skills: ['Product Roadmap', 'Agile', 'Jira', 'Data Analytics', 'FinTech'] },
      { name: 'Rohan Gupta', email: 'rohan.gupta@example.com', title: 'Mobile App Developer (Flutter/iOS)', city: 'Ahmedabad, Gujarat', skills: ['Flutter', 'Dart', 'React Native', 'Swift', 'REST APIs'] },
      { name: 'Deepika Iyer', email: 'deepika.iyer@example.com', title: 'Cyber Security Analyst', city: 'Chennai, Tamil Nadu', skills: ['SOC', 'Penetration Testing', 'SIEM', 'Network Security', 'ISO 27001'] },
      { name: 'Aditya Nair', email: 'aditya.nair@example.com', title: 'Frontend Developer (Next.js)', city: 'Bengaluru, Karnataka', skills: ['React', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'GraphQL'] },
      { name: 'Kavita Joshi', email: 'kavita.joshi@example.com', title: 'Digital Growth Marketing Manager', city: 'Pune, Maharashtra', skills: ['SEO', 'SEM', 'Google Ads', 'Content Strategy', 'Growth Hacking'] },
      { name: 'Siddharth Rao', email: 'siddharth.rao@example.com', title: 'Business Development Manager', city: 'Mumbai, Maharashtra', skills: ['Enterprise Sales', 'Client Acquisition', 'Negotiation', 'CRM', 'B2B'] },
      { name: 'Pooja Chawla', email: 'pooja.chawla@example.com', title: 'Technical Recruiter & HR Specialist', city: 'Delhi NCR, Delhi', skills: ['Talent Sourcing', 'HR Operations', 'LinkedIn Recruiter', 'Interviewing'] },
      { name: 'Manoj Pillai', email: 'manoj.pillai@example.com', title: 'Mechanical Design Engineer', city: 'Pune, Maharashtra', skills: ['SolidWorks', 'AutoCAD', 'Catia', 'Finite Element Analysis', 'GD&T'] },
      { name: 'Neha Bansal', email: 'neha.bansal@example.com', title: 'Chartered Financial Analyst (CFA)', city: 'Mumbai, Maharashtra', skills: ['Financial Modeling', 'Valuation', 'Corporate Finance', 'Excel', 'Tally'] },
      { name: 'Arjun Sen', email: 'arjun.sen@example.com', title: 'Machine Learning Engineer', city: 'Bengaluru, Karnataka', skills: ['TensorFlow', 'Python', 'MLOps', 'Computer Vision', 'Deep Learning'] },
      { name: 'Meera Nambiar', email: 'meera.nambiar@example.com', title: 'Content & Technical Writer', city: 'Kochi, Kerala', skills: ['Copywriting', 'Technical Documentation', 'SEO Writing', 'Blogging', 'Editing'] },
      { name: 'Kunal Singhal', email: 'kunal.singhal@example.com', title: 'Site Reliability Engineer', city: 'Hyderabad, Telangana', skills: ['Linux', 'Kubernetes', 'Prometheus', 'Grafana', 'Python'] },
      { name: 'Tanvi Shinde', email: 'tanvi.shinde@example.com', title: 'Senior Data Analyst', city: 'Indore, Madhya Pradesh', skills: ['Power BI', 'Tableau', 'SQL', 'Python', 'Advanced Excel'] },
      { name: 'Gaurav Dubey', email: 'gaurav.dubey@example.com', title: 'Customer Experience & Support Lead', city: 'Bengaluru, Karnataka', skills: ['Zendesk', 'Client Resolution', 'Escalation Management', 'CRM'] },
      { name: 'Ritu Saxena', email: 'ritu.saxena@example.com', title: 'Cloud Solutions Architect (AWS/Azure)', city: 'Remote', skills: ['AWS Architecture', 'Azure', 'Serverless', 'Terraform', 'System Design'] },
    ];

    const jobSeekerAccounts = [];
    for (let i = 0; i < SEEKER_NAMES.length; i++) {
      const s = SEEKER_NAMES[i];
      const user = await User.create({
        name: s.name,
        email: s.email,
        password: 'seeker123',
        role: 'jobseeker',
        headline: s.title,
        bio: `Accomplished professional with proven track record in ${s.skills.slice(0, 3).join(', ')}. Eager to contribute to scalable engineering and product teams.`,
        location: s.city,
        phone: `+91 97${10000000 + i * 37291}`,
        avatar: `https://images.unsplash.com/photo-${1530000000000 + (i * 987654 % 100000000)}?w=150&auto=format&fit=crop&q=80`,
        skills: s.skills,
        resumeUrl: '/uploads/resumes/sample-candidate-resume.pdf',
        resumeOriginalName: `${s.name.replace(/\s+/g, '_')}_Resume.pdf`,
        experience: [
          {
            title: s.title.split(' ')[0] + ' Specialist',
            company: 'Previous Innovations Pvt Ltd',
            location: s.city,
            startDate: 'Jul 2023',
            endDate: 'Present',
            current: true,
            duration: '2+ years',
            description: `Contributed to key projects, implemented best practices, and collaborated cross-functionally using ${s.skills.slice(0, 2).join(' and ')}.`,
          },
        ],
        education: [
          {
            degree: 'Bachelor of Technology (B.Tech)',
            institution: 'National Institute of Technology',
            fieldOfStudy: 'Computer Science & Engineering',
            startYear: '2019',
            endYear: '2023',
            year: '2023',
            grade: '8.8 CGPA',
          },
        ],
      });
      jobSeekerAccounts.push(user);
    }
    console.log(`✅ Seeded ${jobSeekerAccounts.length} job seekers.`);

    console.log('💼 Seeding 100+ realistic job listings across 30 categories...');
    const JOB_TEMPLATES = [
      // Software Development
      {
        title: 'Senior Software Engineer (Distributed Systems)',
        category: 'Software Development',
        exp: '4-7 years',
        minSal: 2200000,
        maxSal: 3800000,
        skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'System Design'],
        desc: 'Design and develop high-throughput distributed microservices handling millions of concurrent requests daily.',
        res: ['Architect scalable backend services with 99.99% uptime', 'Drive code reviews and mentor junior software engineers', 'Optimize database queries and async event processing pipelines'],
        req: ['4+ years of hands-on experience in Java or Go', 'Solid understanding of distributed systems and CAP theorem', 'Experience with Kafka, Redis, and relational databases'],
        ben: ['Competitive ESOPs', 'Comprehensive Medical Insurance for family', 'Annual Learning & Conference Allowance'],
      },
      {
        title: 'Software Development Engineer II (SDE-2)',
        category: 'Software Development',
        exp: '2-5 years',
        minSal: 1600000,
        maxSal: 2800000,
        skills: ['C++', 'Data Structures', 'Algorithms', 'Multithreading', 'Linux'],
        desc: 'Build low-latency high-frequency transaction systems with stringent real-time performance constraints.',
        res: ['Write clean, performant, and memory-safe C++ code', 'Benchmark systems under peak network loads', 'Collaborate with quantitative research squads'],
        req: ['Strong grasp of DSA and low-level OS internals', 'B.Tech/M.Tech in Computer Science or equivalent', 'Excellent debugging skills'],
        ben: ['Gym & Wellness stipend', 'Flexible work hours', 'Daily catered meals'],
      },
      {
        title: 'Principal Software Architect',
        category: 'Software Development',
        exp: '8-12 years',
        minSal: 4000000,
        maxSal: 6500000,
        skills: ['Software Architecture', 'Cloud Native', 'Domain-Driven Design', 'Java', 'Distributed Systems'],
        desc: 'Lead strategic technical vision, platform re-architecture, and architectural governance across multi-cloud workloads.',
        res: ['Define enterprise-wide engineering standards', 'Lead migration from monolithic services to event-driven meshes', 'Interface with VP of Engineering on technical roadmap'],
        req: ['8+ years designing high-scale cloud platforms', 'Track record of architecting Tier-1 systems', 'Exceptional communication and leadership'],
        ben: ['Executive health cover', 'Generous equity options', 'Home office setup grant'],
      },
      {
        title: 'Junior Software Developer (Campus Graduate)',
        category: 'Software Development',
        exp: '0-1 years',
        minSal: 600000,
        maxSal: 950000,
        skills: ['Java', 'Python', 'SQL', 'Git', 'Data Structures'],
        desc: 'Kickstart your software engineering career in a fast-paced product environment solving real customer problems.',
        res: ['Implement features under the guidance of senior mentors', 'Write automated unit and integration tests', 'Participate in agile sprint ceremonies'],
        req: ['Degree in CS/IT/ECE with strong academic record', 'Solid understanding of OOP concepts and basic algorithms', 'Eager learner and team player'],
        ben: ['Structured mentorship program', 'Health insurance', 'Relocation assistance'],
      },

      // Web Development
      {
        title: 'Senior Web Application Developer',
        category: 'Web Development',
        exp: '3-6 years',
        minSal: 1400000,
        maxSal: 2400000,
        skills: ['JavaScript', 'HTML5', 'CSS3', 'React.js', 'REST APIs', 'Webpack'],
        desc: 'Craft responsive, accessible, and blazing fast web experiences across desktop and mobile browsers.',
        res: ['Build interactive web applications with modern JS tooling', 'Optimize Core Web Vitals and load times', 'Collaborate closely with UI/UX designers'],
        req: ['3+ years in web development', 'Expert knowledge of modern ES6+, CSS Grid, Flexbox', 'Familiarity with performance profiling'],
        ben: ['Flexible remote work options', 'Health insurance', 'Annual team offsites'],
      },
      {
        title: 'Full Lifecycle Webmaster & Portal Developer',
        category: 'Web Development',
        exp: '2-4 years',
        minSal: 900000,
        maxSal: 1500000,
        skills: ['WordPress', 'PHP', 'JavaScript', 'Tailwind CSS', 'SEO Basics'],
        desc: 'Manage and scale multi-locale corporate web portals, landing pages, and interactive microsites.',
        res: ['Maintain high-conversion web portals', 'Implement security patches and CDN caching rules', 'Conduct A/B testing on marketing funnels'],
        req: ['Proficiency in modern PHP/CMS and modern web toolchains', 'Solid eye for layout and typography', 'Understanding of web accessibility (WCAG)'],
        ben: ['Internet reimbursement', 'Paid time off', 'Health insurance'],
      },
      {
        title: 'Jamstack & Headless Web Developer',
        category: 'Web Development',
        exp: '2-5 years',
        minSal: 1200000,
        maxSal: 2200000,
        skills: ['Next.js', 'Contentful', 'GraphQL', 'Tailwind CSS', 'Vercel'],
        desc: 'Build modular, decoupled websites using headless CMS platforms and modern serverless edge functions.',
        res: ['Integrate headless content APIs with Next.js frontend', 'Implement incremental static regeneration (ISR)', 'Ensure 100/100 Lighthouse performance scores'],
        req: ['2+ years with Next.js or Astro', 'Strong knowledge of GraphQL APIs', 'Experience deploying on Vercel or Netlify'],
        ben: ['Work from anywhere', 'Generous equipment allowance', 'Learning budget'],
      },

      // Frontend Development
      {
        title: 'Lead Frontend Engineer (React / Next.js)',
        category: 'Frontend Development',
        exp: '5-8 years',
        minSal: 2500000,
        maxSal: 4200000,
        skills: ['React.js', 'Next.js', 'TypeScript', 'Redux Toolkit', 'Design Systems'],
        desc: 'Lead the frontend engineering squad in building consumer-facing web experiences with state-of-the-art UI architectures.',
        res: ['Architect scalable React component libraries and design tokens', 'Spearhead frontend performance and accessibility standards', 'Conduct code reviews and foster an inclusive engineering culture'],
        req: ['5+ years modern frontend development', 'Deep knowledge of React 18, Server Components, and SSR', 'Strong proficiency in TypeScript'],
        ben: ['Top-tier health coverage', 'Company stock options', 'Unlimited PTO'],
      },
      {
        title: 'Frontend UI Developer (Vue.js / Tailwind)',
        category: 'Frontend Development',
        exp: '2-4 years',
        minSal: 1100000,
        maxSal: 1800000,
        skills: ['Vue.js', 'Nuxt.js', 'Tailwind CSS', 'Pinia', 'Vite'],
        desc: 'Develop modern interactive single page dashboards using Vue 3 Composition API and clean CSS utility systems.',
        res: ['Build pixel-perfect UI views from Figma specifications', 'Manage global state with Pinia and clean composables', 'Write unit tests using Vitest and Vue Test Utils'],
        req: ['Strong experience with Vue 3 and TypeScript', 'Mastery of responsive Tailwind layouts', 'Passion for smooth micro-animations'],
        ben: ['Hybrid flexibility', 'Annual health checkup', 'Subsidized transport'],
      },
      {
        title: 'Angular Frontend Specialist',
        category: 'Frontend Development',
        exp: '3-6 years',
        minSal: 1300000,
        maxSal: 2200000,
        skills: ['Angular', 'RxJS', 'TypeScript', 'NgRx', 'Karma/Jasmine'],
        desc: 'Develop high-security enterprise enterprise banking and fintech web consoles using modern Angular framework.',
        res: ['Design reactive data streams with RxJS', 'Implement complex form validations and role-based route guards', 'Ensure strict TypeScript type safety'],
        req: ['3+ years enterprise Angular experience', 'Expertise in RxJS and NgRx state management', 'Experience in financial or healthcare applications'],
        ben: ['Group medical insurance', 'Performance bonuses', 'Upskilling reimbursements'],
      },

      // Backend Development
      {
        title: 'Staff Backend Engineer (Node.js & Go)',
        category: 'Backend Development',
        exp: '6-10 years',
        minSal: 3000000,
        maxSal: 5000000,
        skills: ['Node.js', 'Golang', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
        desc: 'Architect resilient backend microservices handling high transactional volume with sub-50ms latency guarantees.',
        res: ['Design and deploy robust RESTful and gRPC APIs', 'Tune database schemas and query plans on PostgreSQL', 'Establish observability using OpenTelemetry and Datadog'],
        req: ['6+ years backend development in production', 'Proven experience with both Node.js and Golang', 'Hands-on experience with message queues and caching'],
        ben: ['High-value equity allocation', 'Family health and wellness cover', 'Flexible work arrangements'],
      },
      {
        title: 'Python Backend Engineer (FastAPI / Django)',
        category: 'Backend Development',
        exp: '3-6 years',
        minSal: 1500000,
        maxSal: 2600000,
        skills: ['Python', 'FastAPI', 'PostgreSQL', 'Celery', 'Docker', 'AWS'],
        desc: 'Build high-performance asynchronous APIs and background task orchestration pipelines powering data-heavy applications.',
        res: ['Develop REST APIs using FastAPI and Pydantic', 'Manage async tasks with Celery and RabbitMQ', 'Implement JWT and OAuth2 security protocols'],
        req: ['3+ years backend Python experience', 'Strong database modeling and indexing skills', 'Familiarity with cloud deployments'],
        ben: ['Remote work stipend', 'Health insurance', 'Paid parental leave'],
      },
      {
        title: 'Java Spring Boot Backend Developer',
        category: 'Backend Development',
        exp: '2-5 years',
        minSal: 1200000,
        maxSal: 2000000,
        skills: ['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'REST APIs'],
        desc: 'Deliver robust enterprise services for supply chain and fulfillment tracking with enterprise-grade reliability.',
        res: ['Build secure Spring Boot microservices', 'Write JUnit and Mockito test suites with high code coverage', 'Collaborate with DevOps on Dockerized deployments'],
        req: ['2+ years working with Spring Boot & Hibernate', 'Solid SQL query optimization knowledge', 'Good understanding of RESTful API principles'],
        ben: ['Comprehensive health plan', 'Retirement benefits', 'Commuter allowance'],
      },

      // Full Stack Development
      {
        title: 'Senior Full Stack Developer (MERN Stack)',
        category: 'Full Stack Development',
        exp: '3-6 years',
        minSal: 1800000,
        maxSal: 3000000,
        skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'AWS'],
        desc: 'Own end-to-end features from database schema design to responsive React UI components in a rapid-growth product team.',
        res: ['Build full-stack web applications using the MERN stack', 'Develop REST APIs and secure authentication flows', 'Deploy and monitor applications on AWS ECS/Lambda'],
        req: ['3+ years building full-stack applications', 'Solid understanding of MongoDB aggregations and indexes', 'Proficiency in React hooks and state management'],
        ben: ['Work from home options', 'Stock grant', 'Health insurance'],
      },
      {
        title: 'Full Stack Engineer (TypeScript & Next.js + NestJS)',
        category: 'Full Stack Development',
        exp: '4-7 years',
        minSal: 2200000,
        maxSal: 3600000,
        skills: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Docker'],
        desc: 'Deliver end-to-end type safety from server to client with modern Next.js and NestJS enterprise frameworks.',
        res: ['Build isomorphic TypeScript services', 'Implement real-time WebSockets and notification feeds', 'Write integration tests and end-to-end Cypress tests'],
        req: ['4+ years in TypeScript full-stack ecosystem', 'Experience with relational databases and ORMs like Prisma', 'Deep knowledge of frontend and backend design patterns'],
        ben: ['Flexible work hours', 'Annual wellness stipend', 'Tech equipment provided'],
      },
      {
        title: 'Junior Full Stack Developer',
        category: 'Full Stack Development',
        exp: '1-3 years',
        minSal: 700000,
        maxSal: 1200000,
        skills: ['React.js', 'Node.js', 'JavaScript', 'MongoDB', 'Git'],
        desc: 'Collaborate with a collaborative squad to build user-facing web tools and internal operations dashboards.',
        res: ['Implement frontend components and link with backend APIs', 'Fix bugs and write automated tests', 'Contribute to daily standups and sprint planning'],
        req: ['1+ year experience with JavaScript/React/Node', 'Knowledge of REST APIs and MongoDB', 'Strong problem solving mindset'],
        ben: ['Mentorship from senior staff', 'Medical insurance', 'Team dinners'],
      },

      // Mobile App Development
      {
        title: 'Senior React Native Developer',
        category: 'Mobile App Development',
        exp: '3-6 years',
        minSal: 1600000,
        maxSal: 2800000,
        skills: ['React Native', 'TypeScript', 'Redux', 'iOS', 'Android', 'REST APIs'],
        desc: 'Build slick, smooth cross-platform mobile apps for millions of users with native performance and delightful gestures.',
        res: ['Develop cross-platform iOS and Android features', 'Bridge native modules when necessary', 'Deploy and manage app releases on Google Play and Apple App Store'],
        req: ['3+ years in React Native production apps', 'Proficient in Redux and performance profiling', 'Experience with offline caching and push notifications'],
        ben: ['Remote work flexibility', 'Top-tier phone and laptop provision', 'Health insurance'],
      },
      {
        title: 'Lead Flutter Developer',
        category: 'Mobile App Development',
        exp: '4-7 years',
        minSal: 2000000,
        maxSal: 3400000,
        skills: ['Flutter', 'Dart', 'BLoC Pattern', 'Firebase', 'State Management'],
        desc: 'Architect and scale our customer-facing mobile application using Flutter with 60 FPS UI performance.',
        res: ['Lead mobile app architecture and state management with BLoC', 'Integrate payment gateways and biometric authentication', 'Automate CI/CD pipelines with Fastlane'],
        req: ['4+ years Flutter & mobile app development', 'Published 2+ production apps on App Store and Play Store', 'Strong eye for UI animations and responsive design'],
        ben: ['Competitive equity', 'Family medical cover', 'Annual bonus'],
      },
      {
        title: 'iOS Native Swift Developer',
        category: 'Mobile App Development',
        exp: '2-5 years',
        minSal: 1400000,
        maxSal: 2500000,
        skills: ['Swift', 'SwiftUI', 'Combine', 'Core Data', 'Xcode'],
        desc: 'Develop native iOS applications utilizing the latest SwiftUI APIs and Apple Human Interface Guidelines.',
        res: ['Build native iOS interfaces and widgets', 'Integrate Apple Pay and Core Location services', 'Ensure top rating and zero-crash releases'],
        req: ['2+ years developing native iOS apps in Swift', 'Deep knowledge of SwiftUI and Combine', 'Familiarity with Apple submission guidelines'],
        ben: ['Apple ecosystem hardware provided', 'Health insurance', 'Flexible timings'],
      },

      // UI/UX Design
      {
        title: 'Senior Product Designer (UI/UX)',
        category: 'UI/UX Design',
        exp: '4-7 years',
        minSal: 1800000,
        maxSal: 3200000,
        skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Wireframing'],
        desc: 'Shape the future of our product experience by designing intuitive, accessible, and delightful digital interfaces.',
        res: ['Lead user research sessions and usability testing', 'Create interactive high-fidelity prototypes in Figma', 'Maintain and evolve our multi-brand design system'],
        req: ['4+ years product design experience with stellar portfolio', 'Mastery of Figma, auto-layout, and interactive components', 'Strong ability to articulate design decisions with data'],
        ben: ['Design conference ticket every year', 'Home office setup fund', 'Comprehensive insurance'],
      },
      {
        title: 'UI/UX Designer (Mobile & Web)',
        category: 'UI/UX Design',
        exp: '2-4 years',
        minSal: 1000000,
        maxSal: 1700000,
        skills: ['Figma', 'Prototyping', 'Mobile UX', 'Micro-interactions', 'Information Architecture'],
        desc: 'Design engaging mobile workflows and frictionless web checkout flows for consumer retail products.',
        res: ['Design intuitive screens, flows, and states for mobile and web', 'Collaborate with frontend engineers for pixel-perfect implementation', 'Conduct A/B test UI iterations'],
        req: ['2+ years UI/UX design with portfolio', 'Deep understanding of mobile UX patterns', 'Proficiency in Figma and Adobe Creative Suite'],
        ben: ['Flexible work mode', 'Health insurance', 'Skill growth budget'],
      },
      {
        title: 'UX Researcher & Usability Specialist',
        category: 'UI/UX Design',
        exp: '3-5 years',
        minSal: 1200000,
        maxSal: 2100000,
        skills: ['UX Research', 'User Interviews', 'Usability Testing', 'Persona Building', 'Analytics'],
        desc: 'Uncover qualitative and quantitative user insights to inform core product roadmaps and reduce friction.',
        res: ['Conduct user interviews, surveys, and usability sessions', 'Synthesize research data into actionable product recommendations', 'Define behavioral personas and customer journey maps'],
        req: ['Degree in Design, HCI, Psychology or equivalent experience', 'Strong track record of qualitative and quantitative research', 'Empathetic listener and communicator'],
        ben: ['Remote work options', 'Health insurance', 'Paid time off'],
      },

      // Graphic Design
      {
        title: 'Senior Brand & Graphic Designer',
        category: 'Graphic Design',
        exp: '3-6 years',
        minSal: 900000,
        maxSal: 1600000,
        skills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Brand Identity', 'Typography'],
        desc: 'Drive visual storytelling across digital marketing campaigns, packaging, social media, and brand collaterals.',
        res: ['Design impactful visual assets for digital campaigns and brand launches', 'Create brand guidelines and iconography sets', 'Collaborate with marketing teams on high-converting visuals'],
        req: ['3+ years in graphic and brand design with strong portfolio', 'Mastery of Adobe Creative Cloud', 'Exceptional visual aesthetic and attention to detail'],
        ben: ['Creative software subscriptions covered', 'Health insurance', 'Hybrid schedule'],
      },
      {
        title: 'Motion Graphics & Visual Designer',
        category: 'Graphic Design',
        exp: '2-5 years',
        minSal: 1000000,
        maxSal: 1800000,
        skills: ['After Effects', 'Premiere Pro', 'Motion Design', '2D Animation', 'Storyboarding'],
        desc: 'Create captivating motion graphics, explainer videos, and animated UI illustrations for our digital campaigns.',
        res: ['Animate product demos, social reels, and ad creatives', 'Develop storyboards and style frames', 'Produce engaging video intros and brand stings'],
        req: ['2+ years in motion design with video reel', 'Proficiency in After Effects and Premiere Pro', 'Understanding of pacing, timing, and sound design'],
        ben: ['High-end workstation provided', 'Health insurance', 'Annual team offsite'],
      },

      // Data Science
      {
        title: 'Senior Data Scientist (Predictive Analytics)',
        category: 'Data Science',
        exp: '4-7 years',
        minSal: 2400000,
        maxSal: 4000000,
        skills: ['Python', 'R', 'Machine Learning', 'Pandas', 'SQL', 'Scikit-learn', 'Statistics'],
        desc: 'Build predictive statistical models and recommendation engines to enhance user personalization and reduce churn.',
        res: ['Develop machine learning models for customer lifetime value and churn', 'Design statistical A/B tests and evaluate significance', 'Deploy production models alongside engineering teams'],
        req: ['MS or PhD in Data Science, Statistics, CS, or quantitative field', '4+ years applying machine learning in business contexts', 'Expertise in Python, Pandas, and SQL'],
        ben: ['Generous stock incentives', 'Comprehensive medical cover', 'Learning stipend'],
      },
      {
        title: 'Data Scientist (NLP & Speech)',
        category: 'Data Science',
        exp: '3-6 years',
        minSal: 2000000,
        maxSal: 3500000,
        skills: ['NLP', 'Hugging Face', 'Transformers', 'Python', 'PyTorch', 'BERT'],
        desc: 'Leverage state-of-the-art Natural Language Processing models to extract customer sentiment and automate support classification.',
        res: ['Fine-tune transformer models on proprietary datasets', 'Build text summarization and categorization pipelines', 'Evaluate model performance and latency trade-offs'],
        req: ['3+ years in NLP or computational linguistics', 'Hands-on experience with PyTorch and Hugging Face', 'Strong coding and mathematical foundations'],
        ben: ['Conference sponsorships', 'Health cover', 'Flexible working policy'],
      },

      // Data Analytics
      {
        title: 'Lead Business Data Analyst',
        category: 'Data Analytics',
        exp: '4-7 years',
        minSal: 1600000,
        maxSal: 2700000,
        skills: ['SQL', 'Power BI', 'Tableau', 'Python', 'Business Intelligence', 'Data Modeling'],
        desc: 'Translate raw transactional data into strategic business insights and executive performance dashboards.',
        res: ['Build automated KPI dashboards in Power BI and Tableau', 'Write complex SQL queries and data marts', 'Partner with business leaders to identify revenue opportunities'],
        req: ['4+ years in data analytics or business intelligence', 'Advanced SQL skills across BigQuery / Snowflake', 'Strong data storytelling ability'],
        ben: ['Hybrid working flexibility', 'Annual health checkup', 'Performance bonus'],
      },
      {
        title: 'Product Analytics Specialist',
        category: 'Data Analytics',
        exp: '2-4 years',
        minSal: 1100000,
        maxSal: 1800000,
        skills: ['Mixpanel', 'Amplitude', 'SQL', 'A/B Testing', 'Funnel Analysis'],
        desc: 'Analyze user funnels, feature adoption, and retention cohorts to optimize customer journeys.',
        res: ['Track product event telemetry across web and mobile', 'Analyze drop-offs across onboarding and checkout funnels', 'Deliver actionable recommendations to PMs'],
        req: ['2+ years experience with product analytics platforms', 'Solid understanding of statistical hypothesis testing', 'Strong SQL knowledge'],
        ben: ['Health insurance', 'Work from home allowance', 'Paid vacation days'],
      },

      // Artificial Intelligence
      {
        title: 'Principal AI Research Engineer (GenAI & LLMs)',
        category: 'Artificial Intelligence',
        exp: '5-9 years',
        minSal: 3500000,
        maxSal: 6000000,
        skills: ['Generative AI', 'LLMs', 'LangChain', 'LlamaIndex', 'Python', 'Vector DBs'],
        desc: 'Architect next-generation AI agents and enterprise Retrieval-Augmented Generation (RAG) systems.',
        res: ['Build low-latency RAG architectures using vector embeddings', 'Fine-tune open-weight LLMs (Llama 3, Mistral) on enterprise data', 'Implement guardrails, evaluation benchmarks, and toxicity filters'],
        req: ['5+ years in AI/ML with deep exposure to LLMs', 'Experience with vector databases like Pinecone, Milvus, or Qdrant', 'Strong publication record or production GenAI deployments'],
        ben: ['Executive equity package', 'Full medical and life insurance', 'Unlimited AI compute budget'],
      },
      {
        title: 'Computer Vision Engineer',
        category: 'Artificial Intelligence',
        exp: '3-6 years',
        minSal: 2000000,
        maxSal: 3400000,
        skills: ['OpenCV', 'PyTorch', 'YOLO', 'Object Detection', 'TensorRT'],
        desc: 'Develop real-time object detection and segmentation algorithms for automated retail checkout systems.',
        res: ['Train and optimize deep neural networks for edge inference', 'Build automated dataset labeling and validation pipelines', 'Deploy models on NVIDIA Jetson and cloud GPUs'],
        req: ['3+ years in computer vision and deep learning', 'Proficient in Python, C++, and OpenCV', 'Experience optimizing models with TensorRT or ONNX'],
        ben: ['Flexible hours', 'Medical insurance', 'Annual bonus'],
      },

      // Machine Learning
      {
        title: 'Senior MLOps & Machine Learning Engineer',
        category: 'Machine Learning',
        exp: '4-7 years',
        minSal: 2400000,
        maxSal: 4200000,
        skills: ['MLflow', 'Kubeflow', 'Docker', 'AWS SageMaker', 'Python', 'CI/CD for ML'],
        desc: 'Build scalable machine learning pipelines, model registries, and automated retraining workflows.',
        res: ['Design end-to-end ML deployment pipelines from training to serving', 'Monitor model drift and feature store latency', 'Manage GPU clusters and containerized model endpoints'],
        req: ['4+ years in software engineering with 2+ years dedicated MLOps', 'Strong experience with MLflow, Kubeflow, or SageMaker', 'Familiarity with Kubernetes and cloud infrastructure'],
        ben: ['Stock options', 'Comprehensive health coverage', 'Work from home flexibility'],
      },
      {
        title: 'Recommendation Systems ML Engineer',
        category: 'Machine Learning',
        exp: '3-6 years',
        minSal: 2200000,
        maxSal: 3600000,
        skills: ['Collaborative Filtering', 'Deep Learning', 'PyTorch', 'Redis', 'Python'],
        desc: 'Improve content discovery and merchandise cross-sell algorithms for millions of active shoppers.',
        res: ['Develop real-time recommendation and ranking algorithms', 'Build two-tower neural network retrieval models', 'Perform rigorous offline and online A/B evaluations'],
        req: ['3+ years experience building recommendation engines', 'Strong background in linear algebra and deep learning', 'Excellent programming skills in Python'],
        ben: ['Generous bonuses', 'Health insurance', 'Wellness benefits'],
      },

      // Cyber Security
      {
        title: 'Lead Information Security & SOC Engineer',
        category: 'Cyber Security',
        exp: '5-8 years',
        minSal: 2200000,
        maxSal: 3800000,
        skills: ['SIEM', 'Incident Response', 'Threat Hunting', 'Splunk', 'Network Security'],
        desc: 'Defend enterprise infrastructure and customer data against cyber threats, ransomware, and vulnerabilities.',
        res: ['Lead 24/7 Security Operations Center monitoring and incident triage', 'Conduct regular threat hunting and tabletop exercises', 'Maintain compliance with ISO 27001, SOC 2, and GDPR'],
        req: ['5+ years in security operations or incident response', 'Industry certifications like CISSP, CEH, or OSCP', 'Hands-on experience with SIEM platforms'],
        ben: ['Premium health insurance', 'Certification reimbursement', 'Stock options'],
      },
      {
        title: 'Application Security / DevSecOps Engineer',
        category: 'Cyber Security',
        exp: '3-6 years',
        minSal: 1800000,
        maxSal: 3000000,
        skills: ['SAST', 'DAST', 'OWASP Top 10', 'Penetration Testing', 'GitHub Actions'],
        desc: 'Embed automated security scanning and vulnerability remediation directly into CI/CD delivery pipelines.',
        res: ['Perform code security audits and penetration testing', 'Integrate Snyk, SonarQube, and container scanning into pipelines', 'Deliver secure coding workshops for engineering squads'],
        req: ['3+ years in application security', 'Deep knowledge of OWASP Top 10 vulnerabilities', 'Experience triaging Bug Bounty reports'],
        ben: ['Hybrid work model', 'Health insurance', 'Training allowance'],
      },

      // Cloud Computing
      {
        title: 'Senior Cloud Solutions Architect (AWS / Azure)',
        category: 'Cloud Computing',
        exp: '6-10 years',
        minSal: 2800000,
        maxSal: 4800000,
        skills: ['AWS', 'Azure', 'Terraform', 'Well-Architected Framework', 'Cloud Migration'],
        desc: 'Design and guide multi-cloud enterprise architectures focusing on resilience, security, and cost efficiency.',
        res: ['Design cloud foundations using Terraform infrastructure-as-code', 'Architect disaster recovery and high-availability topologies', 'Optimize cloud spend and FinOps governance'],
        req: ['6+ years cloud engineering and architecture', 'AWS Solutions Architect Professional or Azure Solutions Architect Expert', 'Strong consultative and client-facing skills'],
        ben: ['Competitive equity', 'Family health plan', 'Home office allowance'],
      },
      {
        title: 'Cloud Infrastructure Administrator',
        category: 'Cloud Computing',
        exp: '2-5 years',
        minSal: 1200000,
        maxSal: 2000000,
        skills: ['AWS IAM', 'VPC', 'EC2', 'CloudWatch', 'Linux Administration'],
        desc: 'Provision, monitor, and troubleshoot cloud compute, storage, and networking resources.',
        res: ['Manage day-to-day AWS services and access control lists', 'Configure backup retention policies and monitoring alarms', 'Assist engineering teams with environment setup'],
        req: ['2+ years managing AWS or Azure production environments', 'Solid Linux system administration skills', 'Basic scripting knowledge in Bash or Python'],
        ben: ['Medical insurance', 'Shift allowance', 'Upskilling support'],
      },

      // DevOps
      {
        title: 'Staff Site Reliability Engineer (SRE / Kubernetes)',
        category: 'DevOps',
        exp: '5-9 years',
        minSal: 2600000,
        maxSal: 4500000,
        skills: ['Kubernetes', 'Docker', 'Prometheus', 'Grafana', 'Terraform', 'Helm'],
        desc: 'Ensure rock-solid reliability, zero-downtime deployments, and automated failovers for critical services.',
        res: ['Manage production Kubernetes clusters across multiple availability zones', 'Define and track SLOs, SLIs, and error budgets', 'Participate in on-call rotation with blameless postmortems'],
        req: ['5+ years in DevOps/SRE with extensive Kubernetes experience', 'Strong scripting skills in Go or Python', 'Deep understanding of Linux kernel networking'],
        ben: ['On-call allowance', 'Generous equity', 'Comprehensive health insurance'],
      },
      {
        title: 'DevOps Engineer (CI/CD Pipelines)',
        category: 'DevOps',
        exp: '2-5 years',
        minSal: 1300000,
        maxSal: 2200000,
        skills: ['Jenkins', 'GitHub Actions', 'ArgoCD', 'Docker', 'Bash', 'Git'],
        desc: 'Build automated continuous integration and progressive deployment workflows for microservices squads.',
        res: ['Build standardized GitHub Actions workflows for 50+ services', 'Manage GitOps deployments with ArgoCD', 'Improve build times and Docker image caching'],
        req: ['2+ years creating CI/CD pipelines', 'Proficient in Docker and container registries', 'Strong familiarity with Git workflows'],
        ben: ['Remote work flexibility', 'Health insurance', 'Paid certifications'],
      },

      // Digital Marketing
      {
        title: 'Performance Marketing Manager (Paid Media)',
        category: 'Digital Marketing',
        exp: '4-7 years',
        minSal: 1400000,
        maxSal: 2400000,
        skills: ['Google Ads', 'Meta Ads', 'ROAS Optimization', 'Attribution Modeling', 'Analytics'],
        desc: 'Manage high-budget paid media campaigns to drive customer acquisition with high return on ad spend (ROAS).',
        res: ['Plan and execute multi-million rupee monthly digital ad budgets', 'Run creative testing and audience segmentation', 'Optimize customer acquisition cost (CAC) and conversion rates'],
        req: ['4+ years managing paid campaigns in high-growth startups', 'Proven track record of scaling monthly budgets profitably', 'Deep analytical and data-driven mindset'],
        ben: ['Performance incentive bonuses', 'Health insurance', 'Hybrid schedule'],
      },
      {
        title: 'Social Media & Community Growth Specialist',
        category: 'Digital Marketing',
        exp: '2-4 years',
        minSal: 700000,
        maxSal: 1200000,
        skills: ['Social Media Marketing', 'Copywriting', 'Instagram Growth', 'LinkedIn', 'Canva'],
        desc: 'Build and engage an active community of followers across Twitter, LinkedIn, Instagram, and YouTube.',
        res: ['Create and schedule viral organic social content calendars', 'Engage directly with followers and industry influencers', 'Track engagement metrics and brand sentiment'],
        req: ['2+ years managing brand social channels with visible growth', 'Excellent English writing and copywriting skills', 'Passionate about internet culture and trends'],
        ben: ['Flexible hours', 'Phone bill reimbursement', 'Medical cover'],
      },

      // SEO
      {
        title: 'Lead SEO Strategist (Organic Growth)',
        category: 'SEO',
        exp: '4-8 years',
        minSal: 1300000,
        maxSal: 2300000,
        skills: ['Technical SEO', 'Keyword Research', 'Ahrefs', 'Semrush', 'Google Search Console'],
        desc: 'Drive organic search traffic growth to 10M+ monthly visits through programmatic and technical SEO.',
        res: ['Conduct technical SEO site audits and fix crawl errors', 'Formulate keyword cluster strategies for landing pages', 'Collaborate with engineering to automate schema markup'],
        req: ['4+ years in organic search with proven traffic scaling proofs', 'Deep understanding of Google ranking algorithms and Core Updates', 'Proficiency in Ahrefs, Screaming Frog, and GSC'],
        ben: ['Annual performance bonus', 'Health insurance', 'Flexible timings'],
      },
      {
        title: 'SEO Content Specialist',
        category: 'SEO',
        exp: '1-3 years',
        minSal: 550000,
        maxSal: 900000,
        skills: ['On-Page SEO', 'Content Optimization', 'Keyword Research', 'WordPress', 'Google Analytics'],
        desc: 'Optimize on-page articles and product descriptions to rank on page 1 for competitive transactional keywords.',
        res: ['Write and optimize SEO-friendly blog posts and FAQs', 'Update meta titles, descriptions, and internal linking structures', 'Monitor keyword ranking fluctuations weekly'],
        req: ['1+ year experience in on-page SEO writing', 'Familiarity with SurferSEO or Clearscope', 'Strong command of English grammar'],
        ben: ['Work from home', 'Health insurance', 'Paid time off'],
      },

      // Content Writing
      {
        title: 'Senior Technical Writer (Developer Documentation)',
        category: 'Content Writing',
        exp: '3-6 years',
        minSal: 1200000,
        maxSal: 2000000,
        skills: ['Technical Writing', 'API Documentation', 'Markdown', 'GitBook', 'Postman'],
        desc: 'Author comprehensive developer guides, API references, tutorials, and SDK quickstarts for software engineers.',
        res: ['Write clear documentation for RESTful APIs and SDKs', 'Create sample code snippets in JavaScript and Python', 'Review release notes alongside product managers'],
        req: ['3+ years writing technical or developer-focused documentation', 'Ability to read code and understand API responses', 'Experience using Docs-as-code workflows with Git'],
        ben: ['Laptop provided', 'Medical insurance', 'Remote work friendly'],
      },
      {
        title: 'B2B SaaS Content Marketing Writer',
        category: 'Content Writing',
        exp: '2-4 years',
        minSal: 800000,
        maxSal: 1400000,
        skills: ['Copywriting', 'Ebooks', 'Case Studies', 'Storytelling', 'B2B Marketing'],
        desc: 'Produce authoritative whitepapers, client case studies, and thought-leadership articles for enterprise executives.',
        res: ['Interview product leaders and clients for in-depth case studies', 'Draft comprehensive industry reports and guides', 'Collaborate with design team on PDF presentations'],
        req: ['2+ years writing for B2B tech or SaaS companies', 'Portfolio of published long-form articles and guides', 'Strong research and interviewing capabilities'],
        ben: ['Flexible hours', 'Book reading allowance', 'Health coverage'],
      },

      // Business Development
      {
        title: 'Enterprise Business Development Manager',
        category: 'Business Development',
        exp: '4-8 years',
        minSal: 1800000,
        maxSal: 3200000,
        skills: ['B2B Sales', 'Enterprise Accounts', 'Solution Selling', 'Contract Negotiation', 'CRM'],
        desc: 'Drive strategic enterprise partnerships and close high-value annual recurring revenue software contracts.',
        res: ['Identify and prospect C-level decision makers across Fortune 500 accounts', 'Deliver tailored solution presentations and product demonstrations', 'Negotiate master service agreements and commercial terms'],
        req: ['4+ years in enterprise B2B sales or business development', 'Consistent track record of achieving and exceeding revenue quotas', 'Exceptional executive presence and relationship building'],
        ben: ['Uncapped sales commission incentives', 'Executive travel allowance', 'Comprehensive medical insurance'],
      },
      {
        title: 'Strategic Partnerships Associate',
        category: 'Business Development',
        exp: '2-4 years',
        minSal: 1000000,
        maxSal: 1700000,
        skills: ['Partnership Management', 'Market Research', 'Lead Generation', 'Pitch Decks'],
        desc: 'Build strategic alliances and co-marketing integrations with ecosystem technology partners.',
        res: ['Research potential channel and integration partners', 'Structure co-marketing initiatives and referral agreements', 'Track partnership pipeline and joint revenue metrics'],
        req: ['2+ years in business development, alliances, or consulting', 'Strong analytical and presentation skills', 'High initiative and ownership'],
        ben: ['Hybrid work model', 'Health insurance', 'Performance bonus'],
      },

      // Sales & Marketing
      {
        title: 'Regional Sales Manager (West India)',
        category: 'Sales & Marketing',
        exp: '5-9 years',
        minSal: 2000000,
        maxSal: 3500000,
        skills: ['Channel Sales', 'Key Account Management', 'Sales Strategy', 'Team Leadership'],
        desc: 'Lead the regional sales squad in Mumbai and Pune across enterprise distribution networks.',
        res: ['Direct regional sales territory strategy and monthly targets', 'Manage and mentor a squad of 8 account executives', 'Review pipeline health and forecast accuracy in Salesforce'],
        req: ['5+ years in sales leadership with proven quota achievement', 'Strong industry network across Western India markets', 'Inspiring leadership and communication skills'],
        ben: ['Quarterly incentive trips', 'Corporate car allowance', 'Family health plan'],
      },
      {
        title: 'Inside Sales Executive (SaaS Products)',
        category: 'Sales & Marketing',
        exp: '1-3 years',
        minSal: 600000,
        maxSal: 1000000,
        skills: ['Outbound Calling', 'Salesforce', 'Cold Emailing', 'Lead Qualification', 'Demo Delivery'],
        desc: 'Generate, qualify, and convert warm leads into paying software subscriptions for global SMB clients.',
        res: ['Conduct outbound discovery calls and software demos', 'Maintain detailed deal records in CRM', 'Follow up proactively to close deals before month end'],
        req: ['1+ year experience in inside sales or SDR roles', 'Excellent verbal communication and objection handling', 'Target-driven and persistent personality'],
        ben: ['Lucrative monthly incentives', 'Medical cover', 'Fun office environment'],
      },

      // Human Resources
      {
        title: 'Senior Technical Talent Acquisition Specialist',
        category: 'Human Resources',
        exp: '3-6 years',
        minSal: 1200000,
        maxSal: 2000000,
        skills: ['Technical Recruiting', 'LinkedIn Recruiter', 'Candidate Sourcing', 'Offer Negotiation', 'ATS'],
        desc: 'Partner with engineering directors to attract, interview, and hire top-tier software engineers and architects.',
        res: ['Source niche technical candidates through LinkedIn and Github', 'Conduct screening interviews and cultural fit assessments', 'Manage candidate offer negotiation and smooth onboarding journeys'],
        req: ['3+ years in tech recruiting for high-growth tech companies', 'Deep understanding of modern software stacks and engineering levels', 'Strong relationship-building and closing skills'],
        ben: ['Quarterly hiring bonuses', 'Comprehensive health coverage', 'Work from home flexibility'],
      },
      {
        title: 'HR Business Partner (HRBP)',
        category: 'Human Resources',
        exp: '4-8 years',
        minSal: 1600000,
        maxSal: 2600000,
        skills: ['Employee Relations', 'Performance Management', 'Organizational Design', 'Retention'],
        desc: 'Act as trusted strategic advisor to business unit leaders on people strategy, engagement, and talent retention.',
        res: ['Drive annual appraisal cycles and leadership development programs', 'Resolve complex employee relations matters with empathy and fairness', 'Analyze attrition trends and design retention initiatives'],
        req: ['4+ years as an HRBP or People Operations specialist', 'Master’s degree in HR (MBA/MSW) preferred', 'High emotional intelligence and conflict resolution skills'],
        ben: ['Annual performance bonus', 'Health and wellness benefits', 'Flexible work schedule'],
      },

      // Finance & Accounting
      {
        title: 'Senior Financial Analyst (FP&A)',
        category: 'Finance & Accounting',
        exp: '3-6 years',
        minSal: 1500000,
        maxSal: 2500000,
        skills: ['Financial Modeling', 'Budgeting', 'Variance Analysis', 'Advanced Excel', 'ERP'],
        desc: 'Lead financial forecasting, annual corporate budgeting, and profitability analysis for high-growth business units.',
        res: ['Build sophisticated DCF and financial forecast models', 'Perform monthly variance analysis against operating budgets', 'Present financial dashboards and unit economics to the CFO'],
        req: ['CA, CFA, or MBA in Finance from premier institution', '3+ years experience in FP&A or corporate finance', 'Advanced financial modeling in Excel'],
        ben: ['Performance bonus', 'Family healthcare cover', 'Flexible timings'],
      },
      {
        title: 'Chartered Accountant / Tax Compliance Manager',
        category: 'Finance & Accounting',
        exp: '4-7 years',
        minSal: 1600000,
        maxSal: 2800000,
        skills: ['GST Compliance', 'Income Tax', 'Statutory Audit', 'TDS', 'Ind AS'],
        desc: 'Manage direct and indirect corporate taxation, statutory audits, and regulatory filings.',
        res: ['Ensure 100% on-time GST, TDS, and corporate tax return filings', 'Lead statutory audits with Big 4 auditing firms', 'Provide tax optimization advice for corporate restructuring'],
        req: ['Qualified Chartered Accountant (ICAI)', '3+ years post-qualification corporate tax experience', 'In-depth knowledge of Indian tax laws and Ind AS'],
        ben: ['Health insurance', 'Provident fund & gratuity', 'Annual bonus'],
      },

      // Banking
      {
        title: 'Assistant Vice President – Retail Credit & Risk',
        category: 'Banking',
        exp: '6-10 years',
        minSal: 2500000,
        maxSal: 4200000,
        skills: ['Credit Underwriting', 'Risk Modeling', 'Fintech Lending', 'Portfolio Health', 'RBI Compliance'],
        desc: 'Oversee credit underwriting policies, default risk scorecards, and regulatory compliance for retail loan portfolios.',
        res: ['Formulate retail loan underwriting scorecards and credit limits', 'Monitor non-performing assets (NPAs) and early warning signals', 'Liaise with RBI auditors on risk management frameworks'],
        req: ['6+ years in banking credit risk or consumer lending', 'Strong knowledge of credit bureau data and predictive scorecards', 'Master’s in Finance or Economics'],
        ben: ['Banking loan subsidies', 'Executive medical cover', 'Annual profit share'],
      },
      {
        title: 'Wealth Management Relationship Manager',
        category: 'Banking',
        exp: '3-6 years',
        minSal: 1200000,
        maxSal: 2200000,
        skills: ['Portfolio Management', 'Mutual Funds', 'HNIs', 'Financial Planning', 'Advisory'],
        desc: 'Advise High Net-worth Individuals (HNIs) on asset allocation, equity investments, and wealth preservation.',
        res: ['Manage a portfolio of 150+ affluent client relationships', 'Provide personalized financial planning and wealth advisory', 'Meet annual AuM (Assets under Management) growth milestones'],
        req: ['3+ years in wealth management or private banking', 'AMFI / NISM certifications', 'Excellent communication and relationship-building acumen'],
        ben: ['Lucrative incentives on AuM growth', 'Corporate health plan', 'Conveyance allowance'],
      },

      // Customer Support
      {
        title: 'Customer Success Manager (B2B SaaS)',
        category: 'Customer Support',
        exp: '3-6 years',
        minSal: 1200000,
        maxSal: 2000000,
        skills: ['Customer Success', 'Churn Reduction', 'Upselling', 'Onboarding', 'Gainsight'],
        desc: 'Ensure maximum customer satisfaction, platform adoption, and contract renewals across enterprise accounts.',
        res: ['Drive seamless onboarding and user training for new clients', 'Conduct Quarterly Business Reviews (QBRs) with stakeholders', 'Proactively identify upsell opportunities and prevent churn'],
        req: ['3+ years in customer success or account management in tech', 'Empathetic communicator with strong analytical skills', 'Experience using CRM and success platforms'],
        ben: ['Retention bonuses', 'Comprehensive medical insurance', 'Work from home flexibility'],
      },
      {
        title: 'Technical Support Specialist (L2/L3)',
        category: 'Customer Support',
        exp: '1-4 years',
        minSal: 600000,
        maxSal: 1100000,
        skills: ['Troubleshooting', 'SQL', 'Log Analysis', 'REST APIs', 'Zendesk', 'Jira'],
        desc: 'Investigate and resolve complex technical issues, API errors, and data discrepancies reported by clients.',
        res: ['Triage and troubleshoot escalated support tickets', 'Inspect backend server logs and run diagnostic SQL queries', 'Collaborate with engineering squads on bug fixes'],
        req: ['1+ year experience in technical support or QA', 'Basic understanding of databases, APIs, and network protocols', 'Patient and solution-oriented communication'],
        ben: ['Night shift allowance', 'Health insurance', 'Cab facility or travel reimbursement'],
      },

      // Education & Teaching
      {
        title: 'Senior Computer Science Educator / Curriculum Lead',
        category: 'Education & Teaching',
        exp: '3-6 years',
        minSal: 1000000,
        maxSal: 1800000,
        skills: ['Curriculum Design', 'Python', 'Data Structures', 'Mentorship', 'EdTech'],
        desc: 'Design cutting-edge tech curricula and deliver interactive masterclasses to upskill aspiring software developers.',
        res: ['Author comprehensive lesson plans, coding exercises, and projects', 'Deliver live interactive coding webinars and code walkthroughs', 'Review student capstone projects and provide actionable feedback'],
        req: ['B.Tech/M.Tech in CS with strong teaching passion', 'Solid coding proficiency in Python/Java/Web Development', 'Prior experience in EdTech or university teaching'],
        ben: ['Flexible teaching hours', 'Medical insurance', 'Annual education stipend'],
      },
      {
        title: 'Instructional Designer & Content Developer',
        category: 'Education & Teaching',
        exp: '2-5 years',
        minSal: 750000,
        maxSal: 1300000,
        skills: ['Instructional Design', 'Articulate 360', 'LMS', 'Pedagogy', 'Gamification'],
        desc: 'Transform complex technical subjects into engaging, bite-sized digital learning modules and assessments.',
        res: ['Apply adult learning theories (ADDIE, Bloom’s Taxonomy)', 'Create interactive e-learning modules in Articulate Storyline', 'Collaborate with subject matter experts to validate concepts'],
        req: ['2+ years experience in instructional design', 'Hands-on experience with popular LMS platforms', 'Creative mindset for educational gamification'],
        ben: ['Work from home', 'Health cover', 'Generous paid time off'],
      },

      // Healthcare
      {
        title: 'Health Informatics & Medical Data Specialist',
        category: 'Healthcare',
        exp: '3-6 years',
        minSal: 1200000,
        maxSal: 2100000,
        skills: ['EHR Systems', 'HL7/FHIR', 'Medical Data Analysis', 'HIPAA Compliance', 'SQL'],
        desc: 'Bridge medical clinical workflows and health-tech systems to optimize patient electronic health records (EHR).',
        res: ['Configure and maintain electronic medical records interfaces', 'Ensure strict compliance with health data privacy standards', 'Analyze clinical treatment outcomes and operational hospital metrics'],
        req: ['Degree in Health Informatics, Biomedical Engineering, or equivalent', 'Understanding of FHIR/HL7 standards and EHR software', 'Strong data analysis skills'],
        ben: ['Hospital health benefits for family', 'Retirement plan', 'Hybrid work policy'],
      },
      {
        title: 'Biomedical Equipment Specialist',
        category: 'Healthcare',
        exp: '2-5 years',
        minSal: 650000,
        maxSal: 1100000,
        skills: ['Medical Devices', 'Calibration', 'Diagnostics', 'Maintenance', 'ISO 13485'],
        desc: 'Maintain, test, and calibrate critical hospital diagnostic imaging and patient monitoring systems.',
        res: ['Perform scheduled preventive maintenance on critical medical equipment', 'Troubleshoot electronic instrumentation and sensor errors', 'Ensure equipment compliance with medical device regulations'],
        req: ['B.Tech/Diploma in Biomedical or Electronics Engineering', '2+ years hospital or medical device field experience', 'Strong technical and mechanical aptitude'],
        ben: ['Health insurance', 'Field travel allowance', 'Safety gear provided'],
      },

      // Engineering
      {
        title: 'Senior Embedded Firmware Engineer',
        category: 'Engineering',
        exp: '4-7 years',
        minSal: 1500000,
        maxSal: 2600000,
        skills: ['Embedded C', 'RTOS', 'Microcontrollers', 'I2C/SPI', 'Hardware Debugging'],
        desc: 'Develop mission-critical firmware for IoT smart devices and industrial automation controllers.',
        res: ['Write clean, memory-constrained C/C++ firmware for ARM Cortex microcontrollers', 'Design device drivers for sensors and wireless telemetry chips', 'Debug hardware using oscilloscopes and logic analyzers'],
        req: ['4+ years embedded systems programming', 'Strong knowledge of FreeRTOS and bare-metal programming', 'Experience reading hardware schematics'],
        ben: ['Hardware lab stipend', 'Comprehensive medical insurance', 'Annual bonus'],
      },
      {
        title: 'Hardware PCB Design Engineer',
        category: 'Engineering',
        exp: '2-5 years',
        minSal: 900000,
        maxSal: 1600000,
        skills: ['Altium Designer', 'Schematic Capture', 'High-Speed PCB', 'EMC/EMI', 'Prototyping'],
        desc: 'Design high-speed multi-layer printed circuit boards (PCBs) for cutting-edge automotive and consumer electronics.',
        res: ['Capture complex schematics and layout 4-to-8 layer PCBs', 'Perform signal integrity and power distribution calculations', 'Liaise with fabrication vendors for quick prototyping'],
        req: ['2+ years experience in Altium Designer or KiCad', 'Understanding of high-speed routing and EMI reduction techniques', 'Hands-on SMD soldering and testing skills'],
        ben: ['Health insurance', 'Overtime allowances', 'Annual bonus'],
      },

      // Mechanical Engineering
      {
        title: 'Senior Mechanical Design Engineer (CAD/CAE)',
        category: 'Mechanical Engineering',
        exp: '4-8 years',
        minSal: 1200000,
        maxSal: 2200000,
        skills: ['SolidWorks', 'Catia V5', 'ANSYS FEA', 'GD&T', 'Injection Molding'],
        desc: 'Design precision mechanical components, structural enclosures, and thermal dissipation systems for electric vehicles.',
        res: ['Create parametric 3D models and manufacturing drawings', 'Conduct finite element analysis (FEA) and structural stress tests', 'Optimize components for sheet metal and plastic injection molding'],
        req: ['4+ years in mechanical product design using SolidWorks or Catia', 'Strong understanding of GD&T (ASME Y14.5) standards', 'B.Tech/M.Tech in Mechanical Engineering'],
        ben: ['Health insurance', 'Performance bonus', 'Annual team offsite'],
      },
      {
        title: 'Robotics & Automation Systems Engineer',
        category: 'Mechanical Engineering',
        exp: '3-6 years',
        minSal: 1400000,
        maxSal: 2400000,
        skills: ['ROS', 'Industrial Robotics', 'PLC Programming', 'Kinematics', 'Python'],
        desc: 'Program and deploy automated robotic arms and AGVs (Automated Guided Vehicles) for warehouse fulfillment centers.',
        res: ['Develop robot path planning and kinematic algorithms using ROS', 'Program Siemens and Allen Bradley PLCs for assembly lines', 'Test and commission automated robotic cells'],
        req: ['3+ years in robotics and mechatronics systems', 'Proficiency in ROS, Python, or C++', 'Hands-on experience with industrial automation'],
        ben: ['Health coverage', 'Travel allowances for field commissioning', 'Bonus'],
      },

      // Civil Engineering
      {
        title: 'Senior Structural Design Engineer',
        category: 'Civil Engineering',
        exp: '5-9 years',
        minSal: 1300000,
        maxSal: 2300000,
        skills: ['STAAD Pro', 'ETABS', 'AutoCAD', 'RCC Design', 'IS Codes', 'Steel Structures'],
        desc: 'Perform structural calculations and detailing for modern high-rise commercial complexes and infrastructure projects.',
        res: ['Model high-rise buildings and conduct seismic/wind load simulations', 'Prepare detailed reinforcement drawings following Indian IS Standards', 'Review site execution and structural integrity compliance'],
        req: ['5+ years in structural design consultancy', 'M.Tech in Structural Engineering preferred', 'Expertise in ETABS, SAFE, and STAAD Pro'],
        ben: ['Project completion bonuses', 'Health insurance', 'Site allowance'],
      },
      {
        title: 'Civil Project Planning & Site Engineer',
        category: 'Civil Engineering',
        exp: '2-5 years',
        minSal: 700000,
        maxSal: 1200000,
        skills: ['Primavera P6', 'MS Project', 'Site Supervision', 'Quality Control', 'Quantity Survey'],
        desc: 'Supervise daily construction activities, contractor billing, and project milestones on major urban real estate sites.',
        res: ['Track construction progress against master schedules in Primavera P6', 'Enforce rigorous material testing and structural quality checks', 'Verify contractor bills and quantity estimates'],
        req: ['2+ years site supervision or project planning experience', 'Degree in Civil Engineering', 'Strong leadership and vendor coordination abilities'],
        ben: ['Site accommodation/allowance', 'Health insurance', 'Provident fund'],
      },

      // Government Jobs
      {
        title: 'Executive Trainee – Information Systems (PSU)',
        category: 'Government Jobs',
        exp: '0-2 years',
        minSal: 800000,
        maxSal: 1400000,
        skills: ['Database Administration', 'Network Management', 'Cyber Security', 'Public Sector Governance'],
        desc: 'Prestigious public sector enterprise opening for engineering graduates to modernize digital state infrastructure.',
        res: ['Manage enterprise IT systems and secure citizen-facing portals', 'Ensure adherence to government e-governance standards', 'Assist senior officers in technical evaluation of tenders'],
        req: ['Valid GATE score or competitive entrance eligibility', 'Full-time B.Tech/BE in CS/IT with minimum 65% aggregate', 'Indian citizenship with all valid credentials'],
        ben: ['Central government pay scale + Dearness Allowance (DA)', 'Government quarters or HRA', 'Full medical facility for dependents'],
      },
      {
        title: 'Public Sector Project Manager (Smart City Mission)',
        category: 'Government Jobs',
        exp: '3-6 years',
        minSal: 1100000,
        maxSal: 1800000,
        skills: ['E-Governance', 'Public Procurement', 'Tender Evaluation', 'Urban Infrastructure'],
        desc: 'Lead execution of IoT sensor installations, intelligent traffic systems, and city data centers for Municipal Corporation.',
        res: ['Oversee RFP creation and technical bid evaluations', 'Coordinate with multi-agency stakeholders and urban civic bodies', 'Monitor vendor deliverables against milestones'],
        req: ['3+ years in public sector projects or infrastructure consulting', 'Degree in Engineering or Public Administration', 'Knowledge of GFR rules and GeM portal operations'],
        ben: ['Secure employment terms', 'Comprehensive government healthcare', 'Generous leave allowance'],
      },
    ];

    // To hit 100+ jobs, we iterate through companies and template variants
    const jobsToInsert = [];
    let jobCounter = 0;

    for (let c = 0; c < createdCompanies.length; c++) {
      const company = createdCompanies[c];
      const employer = company.employer;

      // Select 5-6 job templates per company
      for (let t = 0; t < 6; t++) {
        const templateIndex = (c * 6 + t) % JOB_TEMPLATES.length;
        const template = JOB_TEMPLATES[templateIndex];
        jobCounter++;

        const city = CITIES[(c + t) % CITIES.length];
        const workMode = WORK_MODES[(c + t) % WORK_MODES.length];
        const jobType = JOB_TYPES[(t) % JOB_TYPES.length];

        jobsToInsert.push({
          title: template.title,
          company: company._id,
          companyName: company.name,
          companyLogo: company.logo,
          employer: employer,
          category: template.category,
          description: `${template.desc}\n\nAt ${company.name}, you will collaborate with cross-functional teams, leverage modern tooling, and contribute directly to products used by millions across India. We champion continuous learning, diversity, and engineering excellence.`,
          requiredSkills: template.skills,
          location: city,
          workMode: workMode,
          jobType: jobType,
          experienceRequired: template.exp,
          minSalary: template.minSal,
          maxSalary: template.maxSal,
          salaryCurrency: 'INR',
          vacancies: (jobCounter % 4) + 1,
          educationQualification: "Bachelor's Degree in relevant discipline or equivalent practical experience",
          deadline: new Date(Date.now() + (15 + (jobCounter % 45)) * 24 * 60 * 60 * 1000),
          responsibilities: template.res,
          requirements: template.req,
          benefits: template.ben,
          status: 'Active',
          approvalStatus: 'Approved',
          isFeatured: jobCounter % 5 === 0, // 20% featured
          viewsCount: 50 + (jobCounter * 17) % 600,
          applicantsCount: 0, // will be updated when apps created
        });
      }
    }

    const createdJobs = await Job.insertMany(jobsToInsert);
    console.log(`✅ Seeded ${createdJobs.length} realistic jobs across all categories.`);

    console.log('📝 Seeding realistic applications with diverse statuses...');
    const APPLICATION_STATUSES = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Rejected',
      'Hired',
    ];

    const applicationsToInsert = [];
    // Distribute applications among job seekers and jobs
    for (let i = 0; i < jobSeekerAccounts.length; i++) {
      const seeker = jobSeekerAccounts[i];
      // Each seeker applies to 3 distinct jobs
      for (let j = 0; j < 3; j++) {
        const jobIndex = (i * 4 + j) % createdJobs.length;
        const job = createdJobs[jobIndex];
        const status = APPLICATION_STATUSES[(i + j) % APPLICATION_STATUSES.length];

        const appData = {
          job: job._id,
          applicant: seeker._id,
          candidate: seeker._id,
          employer: job.employer,
          recruiter: job.employer,
          status: status,
          resumeUrl: seeker.resumeUrl,
          resumeOriginalName: seeker.resumeOriginalName,
          coverLetter: `Dear Hiring Team at ${job.companyName},\n\nI am thrilled to submit my application for the ${job.title} role. With my background in ${seeker.skills.slice(0, 3).join(', ')}, I am confident in my ability to hit the ground running and create immediate value for your engineering team.\n\nThank you for considering my application.\n\nBest regards,\n${seeker.name}`,
          phone: seeker.phone,
          expectedSalary: job.minSalary + 200000,
          noticePeriod: i % 2 === 0 ? '15 Days' : 'Immediate',
          portfolioUrl: `https://github.com/${seeker.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          statusHistory: [
            {
              status: 'Applied',
              note: 'Application submitted online',
              updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            },
            {
              status: status,
              note: `Candidate moved to stage: ${status}`,
              updatedAt: new Date(),
            },
          ],
        };

        if (status === 'Interview Scheduled') {
          appData.interviewDetails = {
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            time: '02:30 PM IST',
            mode: 'Google Meet',
            meetingLink: 'https://meet.google.com/jobnova-tech-round',
            link: 'https://meet.google.com/jobnova-tech-round',
            notes: 'Technical architecture discussion and live problem solving with Engineering Director.',
            status: 'Scheduled',
          };
          appData.recruiterNotes = [
            {
              note: 'Profile matched core requirements with impressive portfolio. Proceeded to Round 1.',
              authorName: 'HR Recruiter',
              createdAt: new Date(),
            },
          ];
        }

        applicationsToInsert.push(appData);

        // Update applicantsCount on Job
        await Job.findByIdAndUpdate(job._id, { $inc: { applicantsCount: 1 } });
      }
    }

    const createdApplications = await Application.insertMany(applicationsToInsert);
    console.log(`✅ Seeded ${createdApplications.length} sample candidate applications.`);

    console.log('📌 Seeding sample Saved Jobs...');
    for (let i = 0; i < 5; i++) {
      const seeker = jobSeekerAccounts[i];
      const targetJobs = [createdJobs[i * 2], createdJobs[i * 2 + 1]];
      for (const tj of targetJobs) {
        await SavedJob.create({ user: seeker._id, job: tj._id });
        await User.findByIdAndUpdate(seeker._id, { $addToSet: { savedJobs: tj._id } });
      }
    }
    console.log('✅ Seeded saved jobs.');

    console.log('🔔 Seeding sample Notifications...');
    // Seed notifications for seekers and employers
    for (let i = 0; i < 10; i++) {
      const seeker = jobSeekerAccounts[i];
      await Notification.create({
        recipient: seeker._id,
        title: 'Application Status Update',
        message: 'Your application for Senior Software Engineer at Infosys has progressed to Shortlisted stage!',
        type: 'application_status',
        link: '/my-applications',
        isRead: false,
      });

      await Notification.create({
        recipient: seeker._id,
        title: 'New Interview Scheduled',
        message: 'An interview has been scheduled for Wednesday at 02:30 PM IST via Google Meet.',
        type: 'interview',
        link: '/my-applications',
        isRead: false,
      });
    }

    for (let i = 0; i < employerAccounts.length; i++) {
      const emp = employerAccounts[i];
      await Notification.create({
        recipient: emp._id,
        title: 'New Applicant Received',
        message: 'Rahul Sharma submitted an application for Senior Software Engineer.',
        type: 'application_received',
        link: '/employer/manage-jobs',
        isRead: false,
      });
    }
    console.log('✅ Seeded sample notifications.');

    console.log('🚩 Seeding sample Job Reports...');
    await Report.create({
      job: createdJobs[0]._id,
      reporter: jobSeekerAccounts[0]._id,
      reason: 'Misleading Job Title or Description',
      details: 'Listing indicates Remote in title, but description specifies On-site only.',
      status: 'Pending',
    });
    console.log('✅ Seeded sample reports.');

    console.log('====================================================');
    console.log('🎉 JobNova Database Seeding Completed Successfully!');
    console.log(`📊 Summary:`);
    console.log(`- Job Categories: ${createdCategories.length}`);
    console.log(`- Companies: ${createdCompanies.length}`);
    console.log(`- Active Jobs: ${createdJobs.length}`);
    console.log(`- Job Seekers: ${jobSeekerAccounts.length}`);
    console.log(`- Employers: ${employerAccounts.length}`);
    console.log(`- Applications: ${createdApplications.length}`);
    console.log(`- Master Admin: admin@jobnova.com / admin123`);
    console.log(`- Sample Employer: hr.infosys@jobnova.com / employer123`);
    console.log(`- Sample Job Seeker: rahul.sharma@example.com / seeker123`);
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder encountered fatal error:', error);
    process.exit(1);
  }
};

seedData();
