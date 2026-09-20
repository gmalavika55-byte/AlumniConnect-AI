/**
 * Reusable analytics helper functions for computing alumni career trajectory statistics
 * derived dynamically from real backend datasets.
 */

export const classifySector = (company, role) => {
  const text = `${company || ''} ${role || ''}`.toLowerCase().trim();
  if (!text) return 'Software & Services';
  
  if (text.includes('google') || text.includes('amazon') || text.includes('microsoft') || text.includes('deepmind') || text.includes('azure') || text.includes('aws')) {
    return 'Big Tech & Cloud';
  }
  if (text.includes('stripe') || text.includes('fintech') || text.includes('finance') || text.includes('pay')) {
    return 'Finance / FinTech';
  }
  if (text.includes('product') || text.includes('design') || text.includes('ux') || text.includes('figma')) {
    return 'Product & Design';
  }
  if (text.includes('tcs') || text.includes('wipro') || text.includes('infosys') || text.includes('cognizant') || text.includes('accenture')) {
    return 'IT Services & Consulting';
  }
  return 'Software & Services';
};

export const normalizeSkillName = (rawSkill) => {
  if (!rawSkill) return '';
  const s = rawSkill.trim();
  const lower = s.toLowerCase();
  if (lower === 'java') return 'Java';
  if (lower === 'python') return 'Python';
  if (lower === 'react' || lower === 'react.js' || lower === 'reactjs') return 'React.js';
  if (lower === 'spring boot' || lower === 'springboot' || lower === 'spring') return 'Spring Boot';
  if (lower === 'sql' || lower === 'mysql' || lower === 'oracle') return 'SQL / Database';
  if (lower === 'cloud' || lower === 'cloud architecture' || lower === 'aws') return 'Cloud Architecture';
  if (lower === 'go' || lower === 'golang' || lower === 'go / golang') return 'Go / Golang';
  if (lower === 'kubernetes' || lower === 'k8s') return 'Kubernetes';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const calculateDepartmentPlacementRates = (students = [], alumni = []) => {
  const deptMap = {};

  // Process students
  students.forEach(s => {
    const dept = s.department ? s.department.trim() : 'General';
    if (!deptMap[dept]) {
      deptMap[dept] = { studentsCount: 0, alumniCount: 0, placedCount: 0 };
    }
    deptMap[dept].studentsCount += 1;
  });

  // Process alumni
  alumni.forEach(a => {
    const dept = a.department ? a.department.trim() : 'General';
    if (!deptMap[dept]) {
      deptMap[dept] = { studentsCount: 0, alumniCount: 0, placedCount: 0 };
    }
    deptMap[dept].alumniCount += 1;
    if (a.currentCompany || a.designation) {
      deptMap[dept].placedCount += 1;
    }
  });

  const results = Object.keys(deptMap).map(dept => {
    const data = deptMap[dept];
    const totalDept = data.studentsCount + data.alumniCount;
    let rateStr = 'N/A';
    let numericRate = 0;

    if (totalDept > 0) {
      numericRate = Math.min(Math.round((data.alumniCount / totalDept) * 100 * 10) / 10, 100);
      rateStr = `${numericRate}%`;
    }

    return {
      name: dept,
      rate: rateStr,
      numericRate: numericRate,
      studentsCount: data.studentsCount,
      alumniCount: data.alumniCount,
      placedCount: data.placedCount
    };
  }).sort((a, b) => b.numericRate - a.numericRate);

  return results;
};

export const calculateDepartmentOutcomes = (alumni = []) => {
  const depts = {};
  alumni.forEach(a => {
    const dept = a.department ? a.department.trim() : 'General';
    if (!depts[dept]) {
      depts[dept] = { count: 0, roles: {}, sectors: {} };
    }
    depts[dept].count += 1;
    
    const role = a.designation ? a.designation.trim() : 'Software Engineer';
    const sector = classifySector(a.currentCompany, a.designation);

    depts[dept].roles[role] = (depts[dept].roles[role] || 0) + 1;
    depts[dept].sectors[sector] = (depts[dept].sectors[sector] || 0) + 1;
  });

  return Object.keys(depts).map(dept => {
    const data = depts[dept];

    // Find dominant sector
    let topSector = 'N/A';
    let maxSecCount = 0;
    Object.keys(data.sectors).forEach(sec => {
      if (data.sectors[sec] > maxSecCount) {
        maxSecCount = data.sectors[sec];
        topSector = sec;
      }
    });

    // Find dominant role
    let topRole = 'N/A';
    let maxRoleCount = 0;
    Object.keys(data.roles).forEach(r => {
      if (data.roles[r] > maxRoleCount) {
        maxRoleCount = data.roles[r];
        topRole = r;
      }
    });

    return {
      department: dept,
      count: data.count,
      dominantSector: topSector,
      dominantRole: topRole
    };
  }).sort((a, b) => b.count - a.count);
};

export const extractSkillsFromUsers = (students = [], alumni = []) => {
  const skillCounts = {};

  const processSkillsStr = (str) => {
    if (!str) return;
    const parts = str.split(',');
    parts.forEach(p => {
      const norm = normalizeSkillName(p);
      if (norm) {
        skillCounts[norm] = (skillCounts[norm] || 0) + 1;
      }
    });
  };

  students.forEach(s => processSkillsStr(s.skills));
  alumni.forEach(a => processSkillsStr(a.skills));

  return Object.keys(skillCounts).map(skill => ({
    skill,
    count: skillCounts[skill]
  })).sort((a, b) => b.count - a.count);
};
