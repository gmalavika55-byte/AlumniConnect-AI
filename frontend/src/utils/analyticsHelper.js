/**
 * Reusable analytics helper functions for computing alumni career trajectory statistics
 * derived dynamically from mockAlumni dataset.
 */

export const classifySector = (role, company) => {
  const text = `${role} ${company}`.toLowerCase();
  if (text.includes('ai') || text.includes('research') || text.includes('deepmind')) {
    return 'AI & Advanced Research';
  }
  if (text.includes('stripe') || text.includes('fintech') || text.includes('finance')) {
    return 'Finance / FinTech';
  }
  if (text.includes('product') || text.includes('figma') || text.includes('design') || text.includes('ux')) {
    return 'Product & Design';
  }
  if (text.includes('microsoft') || text.includes('azure') || text.includes('cloud') || text.includes('systems') || text.includes('software') || text.includes('engineer')) {
    return 'IT / Software';
  }
  return 'Other';
};

export const calculateAlumniOverview = (alumni = []) => {
  const total = alumni.length;
  const uniqueCompanies = new Set(alumni.map(a => a.company)).size;
  const uniqueRoles = new Set(alumni.map(a => a.role)).size;
  const uniqueDepts = new Set(alumni.map(a => a.department)).size;

  return {
    total,
    uniqueCompanies,
    uniqueRoles,
    uniqueDepts
  };
};

export const calculateSectorDistribution = (alumni = []) => {
  const total = alumni.length;
  const counts = {};
  alumni.forEach(a => {
    const sector = classifySector(a.role, a.company);
    counts[sector] = (counts[sector] || 0) + 1;
  });

  return Object.keys(counts).map(sector => ({
    sector,
    count: counts[sector],
    percentage: total > 0 ? ((counts[sector] / total) * 100).toFixed(1) : '0.0'
  })).sort((a, b) => b.count - a.count);
};

export const calculateRoleDistribution = (alumni = []) => {
  const total = alumni.length;
  const counts = {};
  alumni.forEach(a => {
    counts[a.role] = (counts[a.role] || 0) + 1;
  });

  return Object.keys(counts).map(role => ({
    role,
    count: counts[role],
    percentage: total > 0 ? ((counts[role] / total) * 100).toFixed(1) : '0.0'
  })).sort((a, b) => b.count - a.count);
};

export const calculateTopCompanies = (alumni = []) => {
  const counts = {};
  alumni.forEach(a => {
    counts[a.company] = (counts[a.company] || 0) + 1;
  });

  return Object.keys(counts).map(company => ({
    company,
    count: counts[company]
  })).sort((a, b) => b.count - a.count);
};

export const calculateBatchTrends = (alumni = []) => {
  // Returns career outcome profiles grouped by batch (year of graduation)
  const trends = [...alumni].sort((a, b) => Number(a.batch) - Number(b.batch));
  return trends.map(a => ({
    batch: a.batch,
    company: a.company,
    role: a.role,
    sector: classifySector(a.role, a.company)
  }));
};

export const calculateDepartmentOutcomes = (alumni = []) => {
  const depts = {};
  alumni.forEach(a => {
    const dept = a.department;
    if (!depts[dept]) {
      depts[dept] = { count: 0, roles: [], companies: [], sectors: [] };
    }
    depts[dept].count += 1;
    depts[dept].roles.push(a.role);
    depts[dept].companies.push(a.company);
    depts[dept].sectors.push(classifySector(a.role, a.company));
  });

  return Object.keys(depts).map(dept => ({
    department: dept,
    count: depts[dept].count,
    dominantSector: depts[dept].sectors[0], // first mapped sector
    dominantRole: depts[dept].roles[0]     // first mapped role
  }));
};

export const calculateSkillDistribution = (alumni = []) => {
  const counts = {};
  alumni.forEach(a => {
    if (Array.isArray(a.skills)) {
      a.skills.forEach(skill => {
        counts[skill] = (counts[skill] || 0) + 1;
      });
    }
  });

  return Object.keys(counts).map(skill => ({
    skill,
    count: counts[skill]
  })).sort((a, b) => b.count - a.count);
};

export const calculateLocationDistribution = (alumni = []) => {
  const counts = {};
  alumni.forEach(a => {
    counts[a.location] = (counts[a.location] || 0) + 1;
  });

  return Object.keys(counts).map(location => ({
    location,
    count: counts[location]
  })).sort((a, b) => b.count - a.count);
};
