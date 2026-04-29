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
  const laborComp = calculateAnnualLabor(hourlyRate, manualHours * (1 - competitorPercent / 100), ips);
  const incidentNoInfoblox = events * incidentCost;
  const incidentInfoblox = incidentNoInfoblox * infobloxPreset.incidentFactor;
  const incidentComp = incidentNoInfoblox * competitorPreset.incidentFactor;
  const totalNoInfoblox = laborNoInfoblox + incidentNoInfoblox;
  const totalInfoblox = laborInfoblox + incidentInfoblox;
  const totalComp = laborComp + incidentComp;
  const savingsInfoblox = totalNoInfoblox - totalInfoblox;
  const savingsPct = totalNoInfoblox > 0 ? Math.round((savingsInfoblox / totalNoInfoblox) * 100) : 0;
  const savingsVsComp = totalComp - totalInfoblox;
  const savingsVsCompPct = totalComp > 0 ? Math.round((savingsVsComp / totalComp) * 100) : 0;
  const showComp = compareCompetitor.checked;
  const compName = competitorName.value;
  const productName = infobloxProduct.value;

  // ── Color palette ──────────────────────────────────────────────
  const NAVY      = '0A1F44';
  const TEAL      = '00A896';
  const TEAL_DARK = '028090';
  const WHITE     = 'FFFFFF';
  const LIGHT_BG  = 'F4F7FA';
  const MUTED     = '6B7A99';
  const DARK_TXT  = '1A2B4A';
  const ACCENT    = 'F0A500';
  const RED_BG    = 'FFF0EE';
  const RED_COL   = 'C0392B';
  const GREEN_BG  = 'E8F9F7';
  const PURPLE    = '7B6CF6';
  const PURPLE_BG = 'F0EEFF';

  const makeShadow = () => ({ type: 'outer', color: '000000', blur: 10, offset: 2, angle: 135, opacity: 0.09 });

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  // ════════════════════════════════════════════════════════════════
  // SLIDE 1 — Title
  // ════════════════════════════════════════════════════════════════
  const s1 = pptx.addSlide();
  s1.background = { color: NAVY };

  // Left teal accent bar
  s1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: 5.625, fill: { color: TEAL }, line: { color: TEAL } });

  // Decorative circles top-right
  s1.addShape(pptx.shapes.OVAL, { x: 8.2, y: -0.8, w: 2.8, h: 2.8, fill: { color: TEAL_DARK, transparency: 75 }, line: { color: TEAL_DARK, transparency: 60 } });
  s1.addShape(pptx.shapes.OVAL, { x: 8.7, y: -0.3, w: 1.8, h: 1.8, fill: { color: TEAL, transparency: 60 }, line: { color: TEAL, transparency: 50 } });

  // Decorative circle bottom-left
  s1.addShape(pptx.shapes.OVAL, { x: 0.4, y: 4.3, w: 2.2, h: 2.2, fill: { color: TEAL_DARK, transparency: 80 }, line: { color: TEAL_DARK, transparency: 70 } });

  s1.addText('INFOBLOX VALUE ANALYSIS', { x: 0.6, y: 1.4, w: 8.8, h: 1.0, fontSize: 38, bold: true, color: WHITE, fontFace: 'Calibri', charSpacing: 2, margin: 0 });
  s1.addText('Business Value Comparison: Infoblox vs. Manual vs. Competitors', { x: 0.6, y: 2.5, w: 8.0, h: 0.55, fontSize: 16, color: TEAL, fontFace: 'Calibri', italic: true, margin: 0 });

  s1.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 3.15, w: 6.0, h: 0.04, fill: { color: TEAL, transparency: 40 }, line: { color: TEAL, transparency: 40 } });

  s1.addText([
    { text: 'Product: ', options: { bold: true, color: 'A0B8D0' } },
    { text: productName + '   ', options: { color: WHITE } },
    { text: `Generated: ${new Date().toLocaleDateString()}`, options: { color: MUTED } }
  ], { x: 0.6, y: 3.35, w: 9.0, h: 0.35, fontSize: 11, fontFace: 'Calibri', margin: 0 });

  s1.addText('© ' + new Date().getFullYear() + '  |  Confidential', { x: 0.6, y: 5.1, w: 4, h: 0.3, fontSize: 9, color: MUTED, fontFace: 'Calibri', margin: 0 });

  // ════════════════════════════════════════════════════════════════
  // SLIDE 2 — Product & Solution Description
  // ════════════════════════════════════════════════════════════════
  const s2 = pptx.addSlide();
  s2.background = { color: LIGHT_BG };

  s2.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: NAVY }, line: { color: NAVY } });
  s2.addText('PRODUCT & SOLUTION OVERVIEW', { x: 0.4, y: 0, w: 9.2, h: 1.05, fontSize: 22, bold: true, color: WHITE, fontFace: 'Calibri', valign: 'middle', charSpacing: 1, margin: 0 });

  // Left card — What is this product?
  const productDescriptions = {
    'Infoblox DDI': [
      'DNS, DHCP & IPAM (DDI) — the core network services that keep IP infrastructure running.',
      'Automates IP address management, reduces manual errors, and speeds up network provisioning.',
      'Provides intelligent DNS security with threat intelligence to block malicious activity.',
      'Replaces fragmented spreadsheets with a single authoritative DDI platform.',
      'Proven to cut DNS/IPAM labor by up to 85% and reduce network incidents at scale.'
    ],
    'Infoblox IPAM': [
      'Intelligent IP Address Management with real-time visibility and automated allocation.',
      'Eliminates spreadsheet chaos by centralising all IP records in a single source of truth.',
      'Provides network discovery, audit trails, and policy-based IP assignment.',
      'Scales to millions of IP objects across complex multi-site environments.',
      'Reduces provisioning time from days to minutes with automation workflows.'
    ],
    'BloxOne DDI': [
      'Cloud-first SaaS DDI platform built for hybrid and multi-cloud environments.',
      'Global DNS resolution with built-in security and threat intelligence.',
      'Cloud-native IPAM with zero on-prem infrastructure overhead.',
      '90% faster deployment compared to traditional on-prem DDI solutions.',
      'Centralised visibility across on-prem, private cloud, and public cloud networks.'
    ],
    'Custom': [
      'Custom Infoblox configuration tailored to your specific network requirements.',
      'Manually defined admin hours and incident reduction factors.',
      'Flexible model inputs allow precise calibration to your environment.',
      'Useful for POC scenarios, staged rollouts, or bespoke licensing agreements.'
    ]
  };
  const ddiItems = productDescriptions[productName] || productDescriptions['Custom'];

  s2.addShape(pptx.shapes.RECTANGLE, { x: 0.3, y: 1.25, w: 4.45, h: 3.7, fill: { color: WHITE }, shadow: makeShadow() });
  s2.addShape(pptx.shapes.RECTANGLE, { x: 0.3, y: 1.25, w: 0.07, h: 3.7, fill: { color: TEAL }, line: { color: TEAL } });
  s2.addText(`What is ${productName}?`, { x: 0.5, y: 1.43, w: 4.1, h: 0.35, fontSize: 14, bold: true, color: DARK_TXT, fontFace: 'Calibri', margin: 0 });
  s2.addText(
    ddiItems.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < ddiItems.length - 1, paraSpaceAfter: 3 } })),
    { x: 0.5, y: 1.85, w: 4.1, h: 3.0, fontSize: 11, color: DARK_TXT, fontFace: 'Calibri' }
  );

  // Right card — Product Editions
  const editions = [
    { name: 'Infoblox DDI',    desc: 'On-prem DNS/DHCP/IPAM with full lifecycle management' },
    { name: 'Infoblox IPAM',   desc: 'Standalone IP address management & real-time visibility' },
    { name: 'BloxOne DDI',     desc: 'Cloud-first SaaS DDI for hybrid environments' },
    { name: 'Custom',          desc: 'Flexible inputs to model any deployment scenario' }
  ];
  s2.addShape(pptx.shapes.RECTANGLE, { x: 5.25, y: 1.25, w: 4.45, h: 3.7, fill: { color: WHITE }, shadow: makeShadow() });
  s2.addShape(pptx.shapes.RECTANGLE, { x: 5.25, y: 1.25, w: 0.07, h: 3.7, fill: { color: ACCENT }, line: { color: ACCENT } });
  s2.addText('Product Editions & Key Features', { x: 5.45, y: 1.43, w: 4.1, h: 0.35, fontSize: 14, bold: true, color: DARK_TXT, fontFace: 'Calibri', margin: 0 });
  let ey = 1.85;
  editions.forEach(e => {
    const isActive = e.name === productName;
    s2.addText(e.name + (isActive ? ' ✓' : ''), { x: 5.45, y: ey, w: 4.1, h: 0.25, fontSize: 12, bold: true, color: isActive ? TEAL_DARK : DARK_TXT, fontFace: 'Calibri', margin: 0 });
    s2.addText(e.desc, { x: 5.45, y: ey + 0.25, w: 4.1, h: 0.28, fontSize: 10, color: MUTED, fontFace: 'Calibri', margin: 0 });
    ey += 0.7;
  });

  if (showComp) {
    s2.addText(`Competitor in scope: ${compName}  (${competitorPercent}% efficiency vs manual)`, {
      x: 0.3, y: 5.05, w: 9.4, h: 0.3,
      fontSize: 10.5, color: ACCENT, fontFace: 'Calibri', bold: true, margin: 0
    });
  }

  s2.addText('Source: Infoblox Value Model', { x: 0.3, y: 5.35, w: 9.4, h: 0.22, fontSize: 8.5, color: MUTED, fontFace: 'Calibri', align: 'right', margin: 0 });

  // ════════════════════════════════════════════════════════════════
  // SLIDE 3 — Comparison Output
  // ════════════════════════════════════════════════════════════════
  const s3 = pptx.addSlide();
  s3.background = { color: LIGHT_BG };

  s3.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: TEAL_DARK }, line: { color: TEAL_DARK } });
  s3.addText('COMPARISON OUTPUT  —  Based on User Selection', { x: 0.4, y: 0, w: 9.2, h: 1.05, fontSize: 21, bold: true, color: WHITE, fontFace: 'Calibri', valign: 'middle', charSpacing: 1, margin: 0 });
  s3.addText('Results reflect calculations from the Infoblox Value Model based on your inputs.', { x: 0.4, y: 1.1, w: 9.2, h: 0.28, fontSize: 10, color: MUTED, fontFace: 'Calibri', italic: true, margin: 0 });

  // KPI cards
  const kpis = [
    { label: 'Without Infoblox', val: formatMoney(totalNoInfoblox), delta: '', color: RED_COL, bg: RED_BG },
    { label: `With ${productName}`, val: formatMoney(totalInfoblox), delta: `↓ ${savingsPct}% savings`, color: TEAL_DARK, bg: GREEN_BG }
  ];
  if (showComp) kpis.push({ label: compName, val: formatMoney(totalComp), delta: `↓ ${savingsVsCompPct}% vs no Infoblox`, color: PURPLE, bg: PURPLE_BG });

  const kpiW = showComp ? 3.0 : 4.5;
  const kpiGap = showComp ? 0.5 : 0.5;
  const kpiStartX = showComp ? 0.25 : 0.5;

  kpis.forEach((k, i) => {
    const kx = kpiStartX + i * (kpiW + kpiGap);
    s3.addShape(pptx.shapes.RECTANGLE, { x: kx, y: 1.5, w: kpiW, h: 1.6, fill: { color: k.bg }, shadow: makeShadow() });
    s3.addShape(pptx.shapes.RECTANGLE, { x: kx, y: 1.5, w: kpiW, h: 0.07, fill: { color: k.color }, line: { color: k.color } });
    s3.addText(k.label, { x: kx + 0.12, y: 1.62, w: kpiW - 0.2, h: 0.27, fontSize: 11, bold: true, color: k.color, fontFace: 'Calibri', margin: 0 });
    s3.addText(k.val, { x: kx + 0.12, y: 1.91, w: kpiW - 0.2, h: 0.55, fontSize: showComp ? 22 : 26, bold: true, color: DARK_TXT, fontFace: 'Calibri', margin: 0 });
    if (k.delta) s3.addText(k.delta, { x: kx + 0.12, y: 2.48, w: kpiW - 0.2, h: 0.26, fontSize: 10, color: k.color, bold: true, fontFace: 'Calibri', margin: 0 });
  });

  // Breakdown table
  const colHeaders = [
    { text: 'Category', options: { bold: true, color: WHITE, fill: { color: NAVY } } },
    { text: 'Without Infoblox', options: { bold: true, color: WHITE, fill: { color: NAVY } } },
    { text: `With ${productName}`, options: { bold: true, color: WHITE, fill: { color: NAVY } } }
  ];
  if (showComp) colHeaders.push({ text: compName, options: { bold: true, color: WHITE, fill: { color: NAVY } } });

  const tableRows = [
    colHeaders,
    ['DNS/IPAM Labor Cost', formatMoney(laborNoInfoblox), formatMoney(laborInfoblox), ...(showComp ? [formatMoney(laborComp)] : [])],
    ['Incident Cost', formatMoney(incidentNoInfoblox), formatMoney(incidentInfoblox), ...(showComp ? [formatMoney(incidentComp)] : [])],
    [
      { text: 'Total Annual Cost', options: { bold: true } },
      { text: formatMoney(totalNoInfoblox), options: { bold: true } },
      { text: formatMoney(totalInfoblox), options: { bold: true, color: TEAL_DARK } },
      ...(showComp ? [{ text: formatMoney(totalComp), options: { bold: true } }] : [])
    ],
    [
      { text: 'Savings vs No Infoblox', options: { bold: true } },
      { text: '—', options: {} },
      { text: `${formatMoney(savingsInfoblox)} (${savingsPct}%)`, options: { bold: true, color: TEAL_DARK } },
      ...(showComp ? [{ text: `${formatMoney(totalNoInfoblox - totalComp)} (${Math.round(((totalNoInfoblox - totalComp) / totalNoInfoblox) * 100)}%)`, options: {} }] : [])
    ]
  ];
  if (showComp) {
    tableRows.push([
      { text: `Savings vs ${compName}`, options: { bold: true } },
      { text: '—', options: {} },
      { text: `${formatMoney(savingsVsComp)} (${savingsVsCompPct}%)`, options: { bold: true, color: TEAL_DARK } },
      { text: '—', options: {} }
    ]);
  }

  const colW = showComp ? [2.5, 2.3, 2.3, 2.3] : [3.2, 3.2, 3.1];
  s3.addTable(tableRows, {
    x: 0.25, y: 3.22, w: 9.5, fontFace: 'Calibri', fontSize: 11,
    border: { pt: 0.5, color: 'D0D8E8' }, rowH: 0.36, align: 'center',
    fill: { color: WHITE }, color: DARK_TXT, colW
  });

  s3.addText('* All values calculated from your inputs using the Infoblox Value Model.', {
    x: 0.25, y: 5.35, w: 9.5, h: 0.2, fontSize: 8.5, color: MUTED, fontFace: 'Calibri', italic: true, margin: 0
  });

  // ════════════════════════════════════════════════════════════════
  // SLIDE 4 — Assumptions
  // ════════════════════════════════════════════════════════════════
  const s4 = pptx.addSlide();
  s4.background = { color: NAVY };

  s4.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 1.05, fill: { color: TEAL }, line: { color: TEAL } });
  s4.addText('MODEL ASSUMPTIONS', { x: 0.4, y: 0, w: 9.2, h: 1.05, fontSize: 24, bold: true, color: WHITE, fontFace: 'Calibri', valign: 'middle', charSpacing: 2, margin: 0 });

  const assumptionCards = [
    { title: 'Managed IP Addresses', body: `${ips.toLocaleString()} IPs — directly drives labor and overhead calculations.` },
    { title: 'Incidents per Year', body: `${events} incidents — estimated DNS/DHCP/IPAM-related events annually.` },
    { title: 'Avg. Cost per Incident', body: `${formatMoney(incidentCost)} — downtime, IT remediation, and opportunity cost combined.` },
    { title: 'IT Hourly Rate', body: `${formatMoney(hourlyRate)}/hr — fully-loaded cost of IT staff managing network infrastructure.` },
    { title: 'Manual Admin Hours / Year', body: `${manualHours} hrs per IP — time spent without automation or DDI platform.` },
    { title: 'Infoblox Admin Hours / Year', body: `${infobloxHours} hrs per IP — reduced overhead with ${productName} deployed.` }
  ];

  const cardW = 4.4, rowH = 1.0, startY = 1.2, gap = 0.1;
  assumptionCards.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const ax = 0.3 + col * (cardW + 0.6);
    const ay = startY + row * (rowH + gap);
    s4.addShape(pptx.shapes.RECTANGLE, { x: ax, y: ay, w: cardW, h: rowH, fill: { color: '132040' }, shadow: makeShadow() });
    s4.addShape(pptx.shapes.RECTANGLE, { x: ax, y: ay, w: 0.07, h: rowH, fill: { color: TEAL }, line: { color: TEAL } });
    s4.addText(a.title, { x: ax + 0.18, y: ay + 0.08, w: cardW - 0.28, h: 0.25, fontSize: 11, bold: true, color: TEAL, fontFace: 'Calibri', margin: 0 });
    s4.addText(a.body, { x: ax + 0.18, y: ay + 0.36, w: cardW - 0.28, h: 0.52, fontSize: 10, color: 'C5D0E0', fontFace: 'Calibri', margin: 0 });
  });

  // Competitor table (only if enabled)
  if (showComp) {
    s4.addText('Competitor Efficiency Benchmarks', { x: 0.3, y: 4.35, w: 9.4, h: 0.28, fontSize: 11, bold: true, color: TEAL, fontFace: 'Calibri', margin: 0 });
    const compTableData = [
      [
        { text: 'Competitor', options: { bold: true, color: NAVY, fill: { color: TEAL } } },
        { text: 'Efficiency vs Manual', options: { bold: true, color: NAVY, fill: { color: TEAL } } },
        { text: 'Incident Factor', options: { bold: true, color: NAVY, fill: { color: TEAL } } },
        { text: 'Source', options: { bold: true, color: NAVY, fill: { color: TEAL } } }
      ],
      ...Object.entries(competitorPresets)
        .filter(([k]) => k !== 'Custom')
        .map(([k, v]) => {
          const isActive = k === compName;
          return [
            { text: k + (isActive ? ' ✓' : ''), options: { bold: isActive, color: isActive ? TEAL : 'C5D0E0' } },
            { text: v.efficiency + '%', options: { color: 'C5D0E0' } },
            { text: String(v.incidentFactor), options: { color: 'C5D0E0' } },
            { text: v.source, options: { color: MUTED } }
          ];
        })
    ];
    s4.addTable(compTableData, {
      x: 0.3, y: 4.68, w: 9.4, fontFace: 'Calibri', fontSize: 9,
      border: { pt: 0.5, color: '1E3A5F' }, rowH: 0.18,
      align: 'center', fill: { color: '0E2035' }, color: 'C5D0E0'
    });
  } else {
    s4.addText(`Competitor comparison not enabled for this export.`, {
      x: 0.3, y: 4.38, w: 9.4, h: 0.3, fontSize: 10.5, color: MUTED, fontFace: 'Calibri', italic: true, margin: 0
    });
  }

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