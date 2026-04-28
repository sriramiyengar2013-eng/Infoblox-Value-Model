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

  // SLIDE 1: Title
  const slide1 = pptx.addSlide();
  slide1.background = { color: '002c5f' };
  slide1.addText('Infoblox Value Analysis', { x: 0.5, y: 1.2, w: '90%', fontSize: 48, bold: true, color: 'ffffff', align: 'center' });
  slide1.addText('Comparison and savings model for network operations', { x: 0.5, y: 2.5, w: '90%', fontSize: 20, color: 'dbe9ff', align: 'center' });
  slide1.addText(`Product: ${infobloxProduct.value}`, { x: 0.5, y: 3.8, w: '90%', fontSize: 16, color: 'ffffff', align: 'center' });
  slide1.addText(`Generated: ${new Date().toLocaleDateString()}`, { x: 0.5, y: 4.6, w: '90%', fontSize: 12, color: 'cbd5e8', align: 'center' });

  // SLIDE 2: Product Description
  const slide2 = pptx.addSlide();
  slide2.addText('Product / Solution Description', { x: 0.5, y: 0.4, w: '90%', fontSize: 32, bold: true, color: '003366' });

  let productDescription = '';
  switch (infobloxProduct.value) {
    case 'Infoblox DDI':
      productDescription = 'Infoblox DDI provides integrated DNS, DHCP, and IPAM management with automation, security, and visibility to reduce manual effort and incidents.';
      break;
    case 'Infoblox IPAM':
      productDescription = 'Infoblox IPAM delivers advanced address management, discovery, automation, and policy enforcement for reliable enterprise networks.';
      break;
    case 'BloxOne DDI':
      productDescription = 'BloxOne DDI is a cloud-native DDI solution offering scalable DNS, DHCP, and IPAM with rapid deployment and simplified operations.';
      break;
    default:
      productDescription = 'Custom Infoblox configuration tailored to your deployment using user-provided assumptions.';
  }

  slide2.addText(productDescription, { x: 0.5, y: 1.3, w: '90%', fontSize: 16, color: '333333', lineSpacing: 22 });
  slide2.addText([
    `• Selected product: ${infobloxProduct.value}`,
    `• Infoblox admin hours per IP: ${infobloxHours}`,
    `• Infoblox incident factor: ${infobloxPreset.incidentFactor}`
  ].join('\n'), { x: 0.5, y: 3.6, w: '90%', fontSize: 14, color: '333333', lineSpacing: 20 });

  if (compareCompetitor.checked) {
    slide2.addText(`Competitor Comparison: ${competitorName.value}`, { x: 0.5, y: 5.6, w: '90%', fontSize: 16, bold: true, color: 'AA5500' });
    slide2.addText(`• Efficiency: ${competitorPercent}%\n• Incident factor: ${competitorPreset.incidentFactor}`, { x: 0.5, y: 6.3, w: '90%', fontSize: 14, color: '333333', lineSpacing: 20 });
  }

  // SLIDE 3: Output Summary
  const slide3 = pptx.addSlide();
  slide3.addText('Output Summary', { x: 0.5, y: 0.4, w: '90%', fontSize: 32, bold: true, color: '003366' });

  const tableData = [
    ['Category', 'Without Infoblox', 'With Infoblox'].concat(compareCompetitor.checked ? [competitorName.value] : []),
    ['Labor Cost', formatMoney(laborNoInfoblox), formatMoney(laborInfoblox)].concat(compareCompetitor.checked ? [formatMoney(laborCompetitor)] : []),
    ['Incident Cost', formatMoney(incidentNoInfoblox), formatMoney(incidentInfoblox)].concat(compareCompetitor.checked ? [formatMoney(incidentCompetitor)] : []),
    ['Total Annual Cost', formatMoney(totalNoInfoblox), formatMoney(totalInfoblox)].concat(compareCompetitor.checked ? [formatMoney(totalCompetitor)] : [])
  ];

  slide3.addTable(tableData, {
    x: 0.5, y: 1.3, w: '90%',
    colW: compareCompetitor.checked ? [2.4, 2.1, 2.1, 2.0] : [3.0, 3.0, 3.0],
    fontSize: 12, color: '333333',
    border: { pt: 1, color: 'CCCCCC' }
  });

  slide3.addText(`Annual savings vs no Infoblox: ${formatMoney(savingsInfoblox)}`, { x: 0.5, y: 5.0, w: '90%', fontSize: 16, bold: true, color: '007700' });
  if (compareCompetitor.checked) {
    slide3.addText(`Annual savings vs ${competitorName.value}: ${formatMoney(savingsVsCompetitor)}`, { x: 0.5, y: 5.7, w: '90%', fontSize: 16, bold: true, color: 'AA5500' });
  }

  // SLIDE 4: Assumptions
  const slide4 = pptx.addSlide();
  slide4.addText('Assumptions', { x: 0.5, y: 0.4, w: '90%', fontSize: 32, bold: true, color: '003366' });

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

  slide4.addText(assumptions.join('\n'), { x: 0.5, y: 1.3, w: '90%', fontSize: 14, color: '333333', lineSpacing: 20 });
  slide4.addText('Note: Values are conservative estimates and should be validated for your environment.', { x: 0.5, y: 5.9, w: '90%', fontSize: 11, color: '666666', italic: true });

  await pptx.writeFile({ fileName: 'Infoblox-Value-Analysis.pptx' });
}