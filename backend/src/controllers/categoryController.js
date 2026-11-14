const Category = require('../models/Category');
const Job = require('../models/Job');

// 30 Standard Categories list from prompt specification
const PRESET_CATEGORIES = [
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

// @desc    Get all categories with active job count
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find().sort({ name: 1 });

    // If categories table is empty, auto-seed the preset 30
    if (categories.length === 0) {
      categories = await Category.insertMany(PRESET_CATEGORIES);
    }

    // Dynamic job counts calculation
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Job.countDocuments({
          category: cat.name,
          status: { $in: ['Active', 'active'] },
          approvalStatus: { $in: ['Approved', 'approved'] },
        });
        const obj = cat.toObject();
        obj.jobCount = count;
        return obj;
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, icon, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      icon: icon || 'Briefcase',
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  PRESET_CATEGORIES,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

