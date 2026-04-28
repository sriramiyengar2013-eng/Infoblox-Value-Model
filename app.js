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

  :root {
  color-scheme: dark;
  color: #e8edf5;
  background: #06111f;
  font-family: Inter, system-ui, sans-serif;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-height: 100vh;
  background: radial-gradient(circle at top left, #1b3c6a 0%, #06111f 45%, #050b15 100%);
}
.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px;
}
header {
  margin-bottom: 24px;
}
h1,
h2,
h3 {
  margin: 0;
}
h1 {
  font-size: 2.3rem;
  margin-bottom: 8px;
}
p {
  margin: 0;
  line-height: 1.6;
  color: #c7d1e3;
}
.panel {
  background: rgba(15, 29, 54, 0.95);
  border: 1px solid rgba(99, 144, 255, 0.12);
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 20px;
}
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  margin-bottom: 14px;
}
.field-row label {
  font-weight: 600;
  color: #d0d9ec;
}
.field-row input,
.field-row select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(126, 160, 239, 0.2);
  border-radius: 12px;
  background: #0d1b34;
  color: #e8edf5;
}
.buttons {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
}
button {
  border: none;
  cursor: pointer;
  padding: 12px 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4a7fff, #2161e0);
  color: white;
  font-weight: 700;
}
button:hover {
  opacity: 0.96;
}
.hidden {
  display: none !important;
}
.tooltip-wrapper {
  position: relative;
}
.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-left: 8px;
  border-radius: 50%;
  background: #4a7fff;
  color: white;
  font-size: 0.8rem;
  cursor: help;
}
.tooltip-box {
  position: absolute;
  top: 110%;
  left: 0;
  width: 280px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(10, 20, 38, 0.98);
  border: 1px solid rgba(126, 160, 239, 0.18);
  color: #e8edf5;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
  z-index: 20;
}
.tooltip-wrapper:hover .tooltip-box {
  display: block;
}
.source-text {
  margin: 0;
  color: #a1b0d8;
  line-height: 1.5;
}
.results .result-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}
.result-card {
  background: rgba(10, 20, 38, 0.85);
  border: 1px solid rgba(76, 155, 255, 0.15);
  border-radius: 16px;
  padding: 18px;
}
.result-card h3 {
  font-size: 1rem;
  margin-bottom: 12px;
  color: #a8b4d4;
}
.result-card p {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(116, 148, 190, 0.12);
}
th {
  color: #9fb7dd;
  font-weight: 700;
}
td {
  color: #e2e9f4;
}
.competitor-presets table th,
.competitor-presets table td {
  padding: 10px 8px;
}
tbody tr:last-child td,
tbody tr:last-child th {
  border-bottom: none;
}
@media (max-width: 760px) {
  .field-row {
    grid-template-columns: 1fr;
  }
  .results .result-summary {
    grid-template-columns: 1fr;
  }
}