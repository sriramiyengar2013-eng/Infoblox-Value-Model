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
  'Infoblox DDI': { hours: 0.15, incidentFactor: 0.55, note: 'Standard Infoblox DDI assumptions are active.', tooltip: 'Infoblox DDI is the standard enterprise DDI offering with strong DNS security and reliable IPAM automation.' },
  'Infoblox IPAM': { hours: 0.15, incidentFactor: 0.55, note: 'Standard Infoblox IPAM assumptions are active.', tooltip: 'Infoblox IPAM focuses on address management and automation for complex enterprise networks.' },
  'BloxOne DDI': { hours: 0.14, incidentFactor: 0.52, note: 'Cloud-first BloxOne DDI assumptions are active.', tooltip: 'BloxOne DDI is optimized for cloud-first DDI, with lower operational overhead and faster incident reduction.' },
  'Custom': { hours: parseFloat(infobloxHoursPerIp.value), incidentFactor: 0.55, note: 'Manual Infoblox settings are active.', tooltip: 'Custom mode lets you override Infoblox assumptions manually for your own product or deployment.' }
};

const competitorPresets = {
  'BlueCat': { efficiency: 74, incidentFactor: 0.72, source: 'PeerSpot & ControlD', description: 'Strong automation and market momentum, competitive pricing' },
  'EfficientIP': { efficiency: 70, incidentFactor: 0.75, source: 'PeerSpot benchmark', description: 'High IPAM focus with improved incident control' },
  'Cisco DDI': { efficiency: 66, incidentFactor: 0.80, source: 'Industry comparison data', description: 'Broad enterprise platform with moderate manual overhead' },
  'SolarWinds': { efficiency: 62, incidentFactor: 0.85, source: 'SourceForge profile', description: 'Cost-conscious IPAM offering with more manual operations' },
  'Men&Mice': { efficiency: 70, incidentFactor: 0.78, source: 'Peer review averages', description: 'Flexible deployment with solid automation for hybrid environments' },
  'BT Diamond IP': { efficiency: 64, incidentFactor: 0.82, source: 'Market positioning', description: 'Service-provider-grade solution with higher integration effort' },
  Custom: { efficiency: parseFloat(competitorEfficiency.value), incidentFactor: 0.78, source: 'Custom competitor', description: 'Use your own competitor assumptions' }
};

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function calculateAnnualLabor(costRate, hoursPerIp, ips) {
  return costRate * hoursPerIp * ips;
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
  const preset = competitorPresets[competitorName.value];
  if (preset && competitorName.value !== 'Custom') {
    competitorEfficiency.value = preset.efficiency;
  }
  competitorLabel.textContent = competitorName.value;
  competitorHeader.textContent = competitorName.value;
  competitorSource.textContent = preset
    ? `${preset.source}: ${preset.description}`
    : 'Custom competitor; adjust efficiency manually.';
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

function generatePowerPoint() {
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

  // Slide 1: Title Slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText('Infoblox Value Analysis', { x: 1.0, y: 1.5, fontSize: 44, bold: true, color: '0066CC', align: 'center' });
  titleSlide.addText('Business Value Comparison Tool', { x: 1.0, y: 2.8, fontSize: 24, color: '666666', align: 'center' });
  titleSlide.addText(`Generated: ${new Date().toLocaleDateString()}`, { x: 1.0, y: 3.8, fontSize: 14, color: '999999', align: 'center' });

  // Slide 2: Product/Solution Description
  const productSlide = pptx.addSlide();
  productSlide.addText('Infoblox Solution Overview', { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: '0066CC' });

  let productDescription = '';
  switch(infobloxProduct.value) {
    case 'Infoblox DDI':
      productDescription = 'Infoblox DDI (DNS, DHCP, IPAM) provides comprehensive network infrastructure management with automated IP address management, secure DNS services, and DHCP automation. It reduces manual administration by 85% and minimizes network incidents through intelligent automation and security features.';
      break;
    case 'Infoblox IPAM':
      productDescription = 'Infoblox IPAM focuses on intelligent IP address management and network discovery. It automates IP allocation, provides real-time visibility into IP usage, and ensures compliance with network policies.';
      break;
    case 'BloxOne DDI':
      productDescription = 'BloxOne DDI is Infoblox\'s cloud-first DDI solution, offering global DNS resolution, secure DHCP, and cloud-native IPAM. It provides 90% faster deployment and 95% reduction in operational overhead for modern cloud environments.';
      break;
    default:
      productDescription = 'Custom Infoblox configuration tailored to specific network requirements and operational needs.';
  }

  productSlide.addText(productDescription, { x: 0.5, y: 1.2, fontSize: 16, color: '333333', w: '90%', h: 3.0 });

  if (compareCompetitor.checked) {
    productSlide.addText(`Competitor Comparison: ${competitorName.value}`, { x: 0.5, y: 4.5, fontSize: 18, bold: true, color: 'CC6600' });
    productSlide.addText(`Efficiency: ${competitorPercent}% vs manual operations`, { x: 0.5, y: 5.2, fontSize: 14, color: '666666' });
  }

  // Slide 3: Results/Output
  const resultsSlide = pptx.addSlide();
  resultsSlide.addText('Value Analysis Results', { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: '0066CC' });

  const resultsTable = [
    ['Category', 'Without Infoblox', 'With Infoblox', compareCompetitor.checked ? competitorName.value : ''],
    ['DNS/IPAM Labor Cost', formatMoney(laborNoInfoblox), formatMoney(laborInfoblox), compareCompetitor.checked ? formatMoney(laborCompetitor) : ''],
    ['Incident Cost', formatMoney(incidentNoInfoblox), formatMoney(incidentInfoblox), compareCompetitor.checked ? formatMoney(incidentCompetitor) : ''],
    ['Total Annual Cost', formatMoney(totalNoInfoblox), formatMoney(totalInfoblox), compareCompetitor.checked ? formatMoney(totalCompetitor) : '']
  ];

  resultsSlide.addTable(resultsTable, { x: 0.5, y: 1.2, w: 9.0, colW: compareCompetitor.checked ? [2.5, 2.0, 2.0, 2.5] : [3.0, 3.0, 3.0], fontSize: 12, color: '333333' });

  // Savings summary
  resultsSlide.addText(`Annual Savings vs No Infoblox: ${formatMoney(savingsInfoblox)}`, { x: 0.5, y: 4.0, fontSize: 16, bold: true, color: '009900' });
  if (compareCompetitor.checked) {
    resultsSlide.addText(`Annual Savings vs ${competitorName.value}: ${formatMoney(savingsVsCompetitor)}`, { x: 0.5, y: 4.5, fontSize: 16, bold: true, color: 'CC6600' });
  }

  // Slide 4: Assumptions
  const assumptionsSlide = pptx.addSlide();
  assumptionsSlide.addText('Key Assumptions', { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: '0066CC' });

  const assumptions = [
    `Managed IP Addresses: ${ips.toLocaleString()}`,
    `Annual Network Incidents: ${events}`,
    `Average Cost per Incident: ${formatMoney(incidentCost)}`,
    `IT Hourly Rate: ${formatMoney(hourlyRate)}`,
    `Manual Admin Hours per IP per Year: ${manualHours}`,
    `Infoblox Admin Hours per IP per Year: ${infobloxHours}`,
    `Infoblox Incident Reduction Factor: ${(1 - infobloxPreset.incidentFactor).toFixed(1)}x`
  ];

  if (compareCompetitor.checked) {
    assumptions.push(`Competitor Efficiency vs Manual: ${competitorPercent}%`);
    assumptions.push(`Competitor Incident Reduction Factor: ${(1 - competitorPreset.incidentFactor).toFixed(1)}x`);
  }

  assumptionsSlide.addText(assumptions.map(text => ({ text, options: { fontSize: 14, bullet: true, color: '333333' } })), { x: 0.5, y: 1.2, w: '90%', h: 5.0 });

  assumptionsSlide.addText('Note: All calculations are based on conservative industry averages and may vary by specific implementation.', { x: 0.5, y: 6.5, fontSize: 12, color: '666666', italic: true });

  pptx.writeFile({ fileName: 'Infoblox-Value-Analysis.pptx' });
}

function promptForValues() {
  const fields = [
    { id: 'managedIps', label: 'Managed IP Addresses', min: 100, step: 1 },
    { id: 'incidentsPerYear', label: 'Incidents per year', min: 0, step: 1 },
    { id: 'avgIncidentCost', label: 'Average cost per incident ($)', min: 0, step: 1000 },
    { id: 'itHourlyRate', label: 'IT hourly rate ($)', min: 20, step: 1 },
    { id: 'manualHoursPerIp', label: 'Manual admin hours per year', min: 0, step: 0.1 },
    { id: 'infobloxHoursPerIp', label: 'Infoblox admin hours per year', min: 0, step: 0.05 },
    { id: 'competitorEfficiency', label: 'Competitor efficiency vs manual (%)', min: 10, max: 100, step: 5 }
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
