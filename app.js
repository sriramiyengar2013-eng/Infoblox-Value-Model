const managedIps = document.getElementById('managedIps');
const incidentsPerYear = document.getElementById('incidentsPerYear');
const avgIncidentCost = document.getElementById('avgIncidentCost');
const itHourlyRate = document.getElementById('itHourlyRate');
const manualHoursPerIp = document.getElementById('manualHoursPerIp');
const infobloxHoursPerIp = document.getElementById('infobloxHoursPerIp');
const competitorEfficiency = document.getElementById('competitorEfficiency');
const competitorName = document.getElementById('competitorName');
const compareCompetitor = document.getElementById('compareCompetitor');
const infobloxProduct = document.getElementById('infobloxProduct');
const infobloxProductLabel = document.getElementById('infobloxProductLabel');
const infobloxProductInfo = document.getElementById('infobloxProductInfo');
const updatePrompt = document.getElementById('updatePrompt');
const generatePpt = document.getElementById('generatePpt');
const productTooltip = document.getElementById('productTooltip');

const valueWithout = document.getElementById('valueWithout');
const valueWith = document.getElementById('valueWith');
const valueCompetitor = document.getElementById('valueCompetitor');
const competitorLabel = document.getElementById('competitorLabel');
const competitorHeader = document.getElementById('competitorHeader');
const laborWithout = document.getElementById('laborWithout');
const laborWith = document.getElementById('laborWith');
const laborCompetitor = document.getElementById('laborCompetitor');
const incidentWithout = document.getElementById('incidentWithout');
const incidentWith = document.getElementById('incidentWith');
const incidentCompetitor = document.getElementById('incidentCompetitor');
const totalWithout = document.getElementById('totalWithout');
const totalWith = document.getElementById('totalWith');
const totalCompetitor = document.getElementById('totalCompetitor');
const savingsWith = document.getElementById('savingsWith');
const savingsCompetitor = document.getElementById('savingsCompetitor');
const competitorSource = document.getElementById('competitorSource');

const competitorOnlyNodes = document.querySelectorAll('.competitor-only');

const infobloxProducts = {
  'Infoblox DDI': {
    hours: 0.15,
    incidentFactor: 0.55,
    note: 'Standard Infoblox DDI assumptions are active.',
    tooltip: 'Infoblox DDI is the standard enterprise DDI offering with strong DNS security and reliable IPAM automation.'
  },
  'Infoblox IPAM': {
    hours: 0.15,
    incidentFactor: 0.55,
    note: 'Standard Infoblox IPAM assumptions are active.',
    tooltip: 'Infoblox IPAM focuses on intelligent IP address management and network discovery, automating IP allocation and ensuring policy compliance.'
  },
  'BloxOne DDI': {
    hours: 0.14,
    incidentFactor: 0.52,
    note: 'Cloud-first BloxOne DDI assumptions are active.',
    tooltip: 'BloxOne DDI is optimized for cloud-first DDI, with lower operational overhead and faster incident reduction.'
  },
  Custom: {
    hours: parseFloat(infobloxHoursPerIp.value) || 0.15,
    incidentFactor: 0.55,
    note: 'Manual Infoblox settings are active.',
    tooltip: 'Custom mode lets you override Infoblox assumptions manually for your own product or deployment.'
  }
};

const competitorPresets = {
  BlueCat: {
    efficiency: 74,
    incidentFactor: 0.72,
    source: 'PeerSpot & ControlD',
    description: 'Strong automation and market momentum, competitive pricing'
  },
  EfficientIP: {
    efficiency: 70,
    incidentFactor: 0.75,
    source: 'PeerSpot benchmark',
    description: 'High IPAM focus with improved incident control'
  },
  'Cisco DDI': {
    efficiency: 66,
    incidentFactor: 0.80,
    source: 'Industry comparison data',
    description: 'Broad enterprise platform with moderate manual overhead'
  },
  SolarWinds: {
    efficiency: 62,
    incidentFactor: 0.85,
    source: 'SourceForge profile',
    description: 'Cost-conscious IPAM offering with more manual operations'
  },
  'Men&Mice': {
    efficiency: 70,
    incidentFactor: 0.78,
    source: 'Peer review averages',
    description: 'Flexible deployment with solid automation for hybrid environments'
  },
  'BT Diamond IP': {
    efficiency: 64,
    incidentFactor: 0.82,
    source: 'Market positioning',
    description: 'Service-provider-grade solution with higher integration effort'
  },
  Custom: {
    efficiency: parseFloat(competitorEfficiency.value) || 70,
    incidentFactor: 0.78,
    source: 'Custom competitor',
    description: 'Use your own competitor assumptions'
  }
};

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function calculateAnnualLabor(costRate, hoursPerIp, ips) {
  return costRate * hoursPerIp * ips;
}

function loadPptxGenJS() {
  if (typeof PptxGenJS !== 'undefined') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.10.0/dist/pptxgen.bundle.js';
    script.async = false;
    script.onload = () => resolve();
    script.onerror = (event) => {
      console.error('PptxGenJS load error', event);
      reject(new Error('Failed to load PptxGenJS library.'));
    };
    document.head.appendChild(script);
  });
}

function updateInfobloxProductPreset() {
  const preset = infobloxProducts[infobloxProduct.value] || infobloxProducts.Custom;
  if (infobloxProduct.value !== 'Custom') {
    infobloxHoursPerIp.value = preset.hours;
  }
  infobloxProductInfo.textContent = preset.note;
  productTooltip.textContent = preset.tooltip;
  infobloxProductLabel.textContent = `With ${infobloxProduct.value}`;
}

function setCompetitorMode(enabled) {
  competitorOnlyNodes.forEach((node) => node.classList.toggle('hidden', !enabled));
}

function updateCompetitorPreset() {
  const preset = competitorPresets[competitorName.value] || competitorPresets.Custom;
  if (competitorName.value !== 'Custom') {
    competitorEfficiency.value = preset.efficiency;
  }
  competitorLabel.textContent = competitorName.value;
  competitorHeader.textContent = competitorName.value;
  competitorSource.textContent = `${preset.source}: ${preset.description}`;
}

function updateResults() {
  const ips = parseFloat(managedIps.value) || 0;
  const events = parseFloat(incidentsPerYear.value) || 0;
  const incidentCost = parseFloat(avgIncidentCost.value) || 0;
  const hourlyRate = parseFloat(itHourlyRate.value) || 0;
  const manualHours = parseFloat(manualHoursPerIp.value) || 0;
  const infobloxHours = parseFloat(infobloxHoursPerIp.value) || 0;
  const competitorPercent = parseFloat(competitorEfficiency.value) || 0;
  const competitorPreset = competitorPresets[competitorName.value] || competitorPresets.Custom;
  const infobloxPreset = infobloxProducts[infobloxProduct.value] || infobloxProducts.Custom;

  const laborNoInfoblox = calculateAnnualLabor(hourlyRate, manualHours, ips);
  const laborInfoblox = calculateAnnualLabor(hourlyRate, infobloxHours, ips);
  const laborCompetitor = calculateAnnualLabor(hourlyRate, manualHours * (1 - competitorPercent / 100), ips);

  const incidentNoInfoblox = events * incidentCost;
  const incidentInfoblox = incidentNoInfoblox * infobloxPreset.incidentFactor;
  const incidentCompetitor = incidentNoInfoblox * competitorPreset.incidentFactor;

  const totalNoInfoblox = laborNoInfoblox + incidentNoInfoblox;
  const totalInfoblox = laborInfoblox + incidentInfoblox;
  const totalCompetitor = laborCompetitor + incidentCompetitor;

  const savingsInfoblox = totalNoInfoblox - totalInfoblox;
  const savingsVsCompetitor = totalCompetitor - totalInfoblox;

  laborWithout.textContent = formatMoney(laborNoInfoblox);
  laborWith.textContent = formatMoney(laborInfoblox);
  laborCompetitor.textContent = formatMoney(laborCompetitor);

  incidentWithout.textContent = formatMoney(incidentNoInfoblox);
  incidentWith.textContent = formatMoney(incidentInfoblox);
  incidentCompetitor.textContent = formatMoney(incidentCompetitor);

  totalWithout.textContent = formatMoney(totalNoInfoblox);
  totalWith.textContent = formatMoney(totalInfoblox);
  totalCompetitor.textContent = formatMoney(totalCompetitor);

  valueWithout.textContent = formatMoney(totalNoInfoblox);
  valueWith.textContent = formatMoney(totalInfoblox);
  valueCompetitor.textContent = formatMoney(totalCompetitor);

  savingsWith.textContent = `${formatMoney(savingsInfoblox)} savings vs no Infoblox`;
  savingsCompetitor.textContent = `${formatMoney(savingsVsCompetitor)} savings vs ${competitorName.value}`;
}

async function generatePowerPoint() {
  try {
    await loadPptxGenJS();
  } catch (error) {
    alert('PowerPoint export failed: unable to load the PPTX library. Please check your internet connection and try again.');
    console.error('PowerPoint export load error:', error);
    return;
  }

  if (typeof PptxGenJS === 'undefined') {
    alert('PowerPoint export is unavailable because the PPTX library could not be loaded.');
    return;
  }

  const ips = parseFloat(managedIps.value) || 0;
  const events = parseFloat(incidentsPerYear.value) || 0;
  const incidentCost = parseFloat(avgIncidentCost.value) || 0;
  const hourlyRate = parseFloat(itHourlyRate.value) || 0;
  const manualHours = parseFloat(manualHoursPerIp.value) || 0;
  const infobloxHours = parseFloat(infobloxHoursPerIp.value) || 0;
  const competitorPercent = parseFloat(competitorEfficiency.value) || 0;
  const competitorPreset = competitorPresets[competitorName.value] || competitorPresets.Custom;
  const infobloxPreset = infobloxProducts[infobloxProduct.value] || infobloxProducts.Custom;

  const laborNoInfoblox = calculateAnnualLabor(hourlyRate, manualHours, ips);
  const laborInfoblox = calculateAnnualLabor(hourlyRate, infobloxHours, ips);
  const laborCompetitor = calculateAnnualLabor(hourlyRate, manualHours * (1 - competitorPercent / 100), ips);

  const incidentNoInfoblox = events * incidentCost;
  const incidentInfoblox = incidentNoInfoblox * infobloxPreset.incidentFactor;
  const incidentCompetitor = incidentNoInfoblox * competitorPreset.incidentFactor;

  const totalNoInfoblox = laborNoInfoblox + incidentNoInfoblox;
  const totalInfoblox = laborInfoblox + incidentInfoblox;
  const totalCompetitor = laborCompetitor + incidentCompetitor;

  const savingsInfoblox = totalNoInfoblox - totalInfoblox;
  const savingsVsCompetitor = totalCompetitor - totalInfoblox;

  const pptx = new PptxGenJS();
  pptx.author = 'Infoblox Value Model';
  pptx.company = 'Infoblox';
  pptx.layout = 'LAYOUT_WIDE';

  const titleSlide = pptx.addSlide();
  titleSlide.addText('Infoblox Value Analysis', {
    x: 0.5,
    y: 1.0,
    w: '90%',
    fontSize: 42,
    bold: true,
    color: '003366',
    align: 'center'
  });
  titleSlide.addText('Business Value Comparison Tool', {
    x: 0.5,
    y: 2.2,
    w: '90%',
    fontSize: 20,
    color: '333333',
    align: 'center'
  });
  titleSlide.addText(`Product: ${infobloxProduct.value}`, {
    x: 0.5,
    y: 3.4,
    w: '90%',
    fontSize: 16,
    color: '555555',
    align: 'center'
  });
  titleSlide.addText(`Generated: ${new Date().toLocaleDateString()}`, {
    x: 0.5,
    y: 4.2,
    w: '90%',
    fontSize: 12,
    color: '777777',
    align: 'center'
  });

  const descriptionSlide = pptx.addSlide();
  descriptionSlide.addText('Product / Solution Description', {
    x: 0.5,
    y: 0.5,
    w: '90%',
    fontSize: 28,
    bold: true,
    color: '003366'
  });

  let productDescription = '';
  switch (infobloxProduct.value) {
    case 'Infoblox DDI':
      productDescription =
        'Infoblox DDI provides integrated DNS, DHCP, and IPAM management with automation, security, and visibility to reduce manual effort and incidents.';
      break;
    case 'Infoblox IPAM':
      productDescription =
        'Infoblox IPAM delivers advanced address management, discovery, automation, and policy enforcement for reliable enterprise networks.';
      break;
    case 'BloxOne DDI':
      productDescription =
        'BloxOne DDI is a cloud-native DDI solution offering scalable DNS, DHCP, and IPAM with rapid deployment and simplified operations.';
      break;
    default:
      productDescription =
        'Custom Infoblox configuration tailored to your deployment using user-provided assumptions.';
  }

  descriptionSlide.addText(productDescription, {
    x: 0.5,
    y: 1.3,
    w: '90%',
    fontSize: 16,
    color: '333333',
    lineSpacing: 20
  });
  descriptionSlide.addText(
    [
      `Selected product: ${infobloxProduct.value}`,
      `Infoblox admin hours per IP: ${infobloxHours}`,
      `Infoblox incident factor: ${infobloxPreset.incidentFactor}`
    ].join('\n'),
    {
      x: 0.5,
      y: 3.8,
      w: '90%',
      fontSize: 14,
      color: '333333',
      lineSpacing: 18
    }
  );

  if (compareCompetitor.checked) {
    descriptionSlide.addText(`Competitor Comparison: ${competitorName.value}`, {
      x: 0.5,
      y: 5.5,
      w: '90%',
      fontSize: 16,
      bold: true,
      color: 'AA5500'
    });
    descriptionSlide.addText(
      `Competitor efficiency: ${competitorPercent}%\nCompetitor incident factor: ${competitorPreset.incidentFactor}`,
      {
        x: 0.5,
        y: 6.2,
        w: '90%',
        fontSize: 14,
        color: '555555',
        lineSpacing: 18
      }
    );
  }

  const resultsSlide = pptx.addSlide();
  resultsSlide.addText('Output Summary', {
    x: 0.5,
    y: 0.5,
    w: '90%',
    fontSize: 28,
    bold: true,
    color: '003366'
  });

  const resultsTable = [
    ['Category', 'Without Infoblox', 'With Infoblox'].concat(compareCompetitor.checked ? [competitorName.value] : []),
    ['Labor Cost', formatMoney(laborNoInfoblox), formatMoney(laborInfoblox)].concat(compareCompetitor.checked ? [formatMoney(laborCompetitor)] : []),
    ['Incident Cost', formatMoney(incidentNoInfoblox), formatMoney(incidentInfoblox)].concat(compareCompetitor.checked ? [formatMoney(incidentCompetitor)] : []),
    ['Total Annual Cost', formatMoney(totalNoInfoblox), formatMoney(totalInfoblox)].concat(compareCompetitor.checked ? [formatMoney(totalCompetitor)] : [])
  ];

  resultsSlide.addTable(resultsTable, {
    x: 0.5,
    y: 1.2,
    w: '90%',
    colW: compareCompetitor.checked ? [2.5, 2.0, 2.0, 2.0] : [3.0, 3.0, 3.0],
    fontSize: 12,
    color: '333333',
    border: { pt: 1, color: 'CCCCCC' }
  });

  resultsSlide.addText(`Annual Savings vs No Infoblox: ${formatMoney(savingsInfoblox)}`, {
    x: 0.5,
    y: 4.8,
    w: '90%',
    fontSize: 16,
    bold: true,
    color: '007700'
  });
  if (compareCompetitor.checked) {
    resultsSlide.addText(`Annual Savings vs ${competitorName.value}: ${formatMoney(savingsVsCompetitor)}`, {
      x: 0.5,
      y: 5.4,
      w: '90%',
      fontSize: 16,
      bold: true,
      color: 'AA5500'
    });
  }

  const assumptionsSlide = pptx.addSlide();
  assumptionsSlide.addText('Assumptions', {
    x: 0.5,
    y: 0.5,
    w: '90%',
    fontSize: 28,
    bold: true,
    color: '003366'
  });

  const assumptions = [
    `Managed IP Addresses: ${ips.toLocaleString()}`,
    `Incidents per year: ${events}`,
    `Average incident cost: ${formatMoney(incidentCost)}`,
    `IT hourly rate: ${formatMoney(hourlyRate)}`,
    `Manual hours per IP per year: ${manualHours}`,
    `Infoblox hours per IP per year: ${infobloxHours}`,
    `Infoblox incident factor: ${infobloxPreset.incidentFactor}`
  ];

  if (compareCompetitor.checked) {
    assumptions.push(`Competitor efficiency: ${competitorPercent}%`);
    assumptions.push(`Competitor incident factor: ${competitorPreset.incidentFactor}`);
  }

  assumptionsSlide.addText(assumptions.join('\n'), {
    x: 0.5,
    y: 1.2,
    w: '90%',
    fontSize: 14,
    color: '333333',
    lineSpacing: 18
  });
  assumptionsSlide.addText(
    'Note: Values are conservative estimates and should be validated for your environment.',
    { x: 0.5, y: 5.8, w: '90%', fontSize: 12, color: '666666', italic: true }
  );

  await pptx.writeFile({ fileName: 'Infoblox-Value-Analysis.pptx' });
}

function promptForValues() {
  const fields = [
    { id: 'managedIps', label: 'Managed IP Addresses', min: 1 },
    { id: 'incidentsPerYear', label: 'Incidents per year', min: 0 },
    { id: 'avgIncidentCost', label: 'Average cost per incident ($)', min: 0 },
    { id: 'itHourlyRate', label: 'IT hourly rate ($)', min: 0 },
    { id: 'manualHoursPerIp', label: 'Manual admin hours per year', min: 0 },
    { id: 'infobloxHoursPerIp', label: 'Infoblox admin hours per year', min: 0 },
    { id: 'competitorEfficiency', label: 'Competitor efficiency vs manual (%)', min: 0, max: 100 }
  ];

  fields.forEach((field) => {
    const element = document.getElementById(field.id);
    const currentValue = element.value;
    const promptValue = window.prompt(`${field.label}:`, currentValue);
    if (promptValue !== null && promptValue.trim() !== '') {
      const numeric = parseFloat(promptValue);
      if (!Number.isNaN(numeric)) {
        element.value = numeric;
      }
    }
  });

  updateCompetitorPreset();
  updateResults();
}

managedIps.addEventListener('input', updateResults);
incidentsPerYear.addEventListener('input', updateResults);
avgIncidentCost.addEventListener('input', updateResults);
itHourlyRate.addEventListener('input', updateResults);
manualHoursPerIp.addEventListener('input', updateResults);
infobloxHoursPerIp.addEventListener('input', updateResults);
competitorEfficiency.addEventListener('input', updateResults);
competitorName.addEventListener('change', () => {
  updateCompetitorPreset();
  updateResults();
});
compareCompetitor.addEventListener('change', () => {
  setCompetitorMode(compareCompetitor.checked);
  updateResults();
});
infobloxProduct.addEventListener('change', () => {
  updateInfobloxProductPreset();
  updateResults();
});
updatePrompt.addEventListener('click', promptForValues);
generatePpt.addEventListener('click', generatePowerPoint);

updateInfobloxProductPreset();
setCompetitorMode(compareCompetitor.checked);
updateCompetitorPreset();
updateResults();
