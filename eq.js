const width = 1000;
const height = 550;

const margin = {
  top: 60,
  right: 80,
  bottom: 140,
  left: 100
};

let topCountries = [];
let allCountryNames = [];
let yearlyAll = [];


function addLegend(svg, labels, colors) {
  const legend = svg.append("g").attr("transform", "translate(900,60)");
  labels.forEach((label, i) => {
    legend.append("rect").attr("x", 0).attr("y", i * 25).attr("width", 15).attr("height", 15).attr("fill", colors[i]);
    legend.append("text").attr("x", 25).attr("y", i * 25 + 12).attr("fill", "white").style("font-size","11px").text(label);
  });
}

function addBottomLegend(svg, labels, colors){
    const itemsPerRow = 5;
    const legend = svg.append("g").attr("transform",`translate(${margin.left},${height - 75})`);
    labels.forEach((label,i)=>{
        const row = Math.floor(i / itemsPerRow);
        const col = i % itemsPerRow;
        const xPos = col * 170;
        const yPos = row * 22;
        legend.append("rect").attr("x", xPos).attr("y", yPos).attr("width", 14).attr("height", 14).attr("fill", colors[i]);
        legend.append("text").attr("x", xPos + 22).attr("y", yPos + 12).attr("fill", "white").style("font-size","10px").text(label);});
}


function showChart(id) {
  document.querySelectorAll(".chart").forEach(chart => chart.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "grouped") {
    d3.select("#groupedBar").selectAll("*").remove();
    if (typeof window.drawGroupedBar === 'function') window.drawGroupedBar(); else console.warn('Grouped not ready');
  }

  if (id === "stacked") {
    d3.select("#stackedBar").selectAll("*").remove();
    if (typeof window.drawStackedBar === 'function') window.drawStackedBar(); else console.warn('Stacked not ready');
  }

  if (id === "area") {
    d3.select("#stackedArea").selectAll("*").remove();
    if (typeof window.drawAreaChart === 'function') window.drawAreaChart(); else console.warn('Area not ready');
  }

  if (id === "stream") {
    d3.select("#streamgraph").selectAll("*").remove();
    if (typeof window.drawStreamgraph === 'function') window.drawStreamgraph(); else console.warn('Stream not ready');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.buttons button').forEach(b => b.disabled = true);
});



d3.csv("earthquake_dataset.csv").then(function (data) {
  data = data.filter(d => d["Date"]);

  data.forEach(d => {
    d["Earthquake Magnitude"] = +d["Earthquake Magnitude"] || 0;
    const parts = d["Date"].split(/[-\/]/);
    d.year = +parts[2];
  });

  
  const recentYears = [ 2021, 2022, 2023, 2024];
  
  
  const countryCounts = d3.rollups(
    data.filter(d => recentYears.includes(d.year) ),
    v => {
      const obj = {}; recentYears.forEach(y => { obj['y' + y] = v.filter(d => d.year === y).length; });
      return obj;
    },
    d => d.Country
  );

  topCountries = countryCounts.map(([country, values]) => {
    const entry = { Country: country }; let total = 0;
    recentYears.forEach(y => { const val = values['y' + y] || 0; entry[String(y)] = val; total += val; });
    entry.total = total; return entry;
  }).sort((a, b) => b.total - a.total).slice(0, 15);

  const topCountryNames = topCountries.map(d => d.Country);

 
  // all countries yearly (for per-country views)
  allCountryNames = Array.from(new Set(data.map(d => d.Country)));
  const countryColors = d3.scaleOrdinal()
    .domain(topCountryNames)
    .range([

        
        "#e63946",
        "#f4a261",
        "#e9c46a",
        "#2a9d8f",
        "#06d6a0",

        "#118ab2",
        "#4361ee",
        "#a8a8a8",
        "#8338ec",
        "#ff006e",

        "#ff5100",
        "#ffbe0b",
        "#8ecae6",
        "#219ebc",
        "#90be6d",

    ]);
 const baseColors = ["#ff4444", "#00bfff", "#32cd32", "#8a2be2"];
  yearlyAll = d3.rollups(
    data.filter(d => allCountryNames.includes(d.Country) && d["year"]!== 2025),
    v => v.length,
    d => d.year,
    d => d.Country
  ).map(([year, countries]) => {
    let obj = { year: +year }; countries.forEach(([country, count]) => { obj[country] = count; });
    allCountryNames.forEach(country => { if (!obj[country]) obj[country] = 0; }); return obj;
  }).sort((a, b) => a.year - b.year);

 

 
  function drawGroupedBar() {
    const svg = d3.select("#groupedBar");
    const years = recentYears.map(String);
    const x0 = d3.scaleBand().domain(topCountries.map(d => d.Country)).range([margin.left, width - margin.right]).padding(0.2);
    const x1 = d3.scaleBand().domain(years).range([0, x0.bandwidth()]).padding(0.05);
    const y = d3.scaleLinear().domain([0, d3.max(topCountries, d => Math.max(...recentYears.map(y => d[String(y)] || 0)))]).nice().range([height - margin.bottom, margin.top]);
    const color = d3.scaleOrdinal().domain(years).range(baseColors.slice(0, years.length));
    svg.append("g").selectAll("g").data(topCountries).join("g").attr("transform", d => `translate(${x0(d.Country)},0)`).selectAll("rect").data(d => recentYears.map(y => ({ key: String(y), value: d[String(y)] }))).join("rect").attr("x", d => x1(d.key)).attr("y", height - margin.bottom).attr("width", x1.bandwidth()).attr("height", 0).attr("fill", d => color(d.key)).transition().duration(1200).ease(d3.easeBounceOut).attr("y", d => y(d.value)).attr("height", d => height - margin.bottom - y(d.value));
    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x0)).selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
    svg.append("text").attr("x", width / 2).attr("y", 30).attr("text-anchor", "middle").attr("fill", "white").style("font-size", "22px").text("Earthquake Count Per Country (recent years)");
    addLegend(svg, years, baseColors);
  }

  function drawStackedBar() {
    const svg = d3.select("#stackedBar");
    const stackData = topCountries.map(d => { const obj = { country: d.Country }; let total = 0; recentYears.forEach(y => { const val = d[String(y)] || 0; obj['y' + y] = val; total += val; }); obj.total = total; return obj; }).sort((a, b) => b.total - a.total);
    const keys = recentYears.map(y => 'y' + y);
    const stackedSeries = d3.stack().keys(keys)(stackData);
    const x = d3.scaleBand().domain(stackData.map(d => d.country)).range([margin.left, width - margin.right]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(stackData, d => keys.reduce((s, k) => s + (d[k] || 0), 0))]).nice().range([height - margin.bottom, margin.top]);
    const colors = d3.scaleOrdinal().domain(keys).range(baseColors);

    svg.append("g").selectAll("g").data(stackedSeries).join("g").attr("fill", d => colors(d.key)).selectAll("rect").data(d => d).join("rect").attr("x", d => x(d.data.country)).attr("y", height - margin.bottom).attr("height", 0).attr("width", x.bandwidth()).transition().duration(1200).ease(d3.easeCubicOut).attr("y", d => y(d[1])).attr("height", d => y(d[0]) - y(d[1]));

    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x)).selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
    svg.append("text").attr("x", width / 2).attr("y", 30).attr("text-anchor", "middle").attr("fill", "white").style("font-size", "22px").text("Stacked Earthquake Count Per Country");
    addLegend(svg, recentYears.map(String), baseColors);
  }

  function drawAreaChart() {
    const svg = d3.select("#stackedArea");
     const keys =
        topCountries.map(d => d.Country);
    const stacked = d3.stack().keys(keys)(yearlyAll);
    const x = d3.scaleLinear().domain(d3.extent(yearlyAll, d => d.year)).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([0, d3.max(yearlyAll, d => d3.sum(keys, k => d[k]))]).nice().range([height - margin.bottom, margin.top]);
    const color = countryColors;
    const area = d3.area().x(d => x(d.data.year)).y0(d => y(d[0])).y1(d => y(d[1]));
    svg.selectAll("path").data(stacked).join("path").attr("fill", d => color(d.key)).attr("opacity", 0).attr("d", area).transition().duration(1500).attr("opacity", 0.8);
    addBottomLegend(svg,keys,keys.map(k => countryColors(k)));
    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
    svg.append("text").attr("x", width / 2).attr("y", 30).attr("text-anchor", "middle").attr("fill", "white").style("font-size", "22px").text("Stacked Area Chart - Earthquake Trends by Country");
  }

  function drawStreamgraph() {
    const svg = d3.select("#streamgraph");
     const keys =
        topCountries.map(d => d.Country);
    const stack = d3.stack().keys(keys).offset(d3.stackOffsetWiggle);
    const layers = stack(yearlyAll);
    const x = d3.scaleLinear().domain(d3.extent(yearlyAll, d => d.year)).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([d3.min(layers, layer => d3.min(layer, d => d[0])), d3.max(layers, layer => d3.max(layer, d => d[1]))]).range([height - margin.bottom, margin.top]);
    const color = countryColors;
    const area = d3.area().x(d => x(d.data.year)).y0(d => y(d[0])).y1(d => y(d[1])).curve(d3.curveBasis);
    svg.selectAll("path").data(layers).join("path").attr("d", area).attr("opacity", 0).attr("fill", d => color(d.key)).transition().duration(1500).attr("opacity", 0.8);
    addBottomLegend(svg,keys,keys.map(k => countryColors(k)));
    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
    svg.append("text").attr("x", width / 2).attr("y", 30).attr("text-anchor", "middle").attr("fill", "white").style("font-size", "22px").text("Streamgraph - Earthquake Flow by Country");
  }

  // expose and enable
  window.drawGroupedBar = drawGroupedBar;
  window.drawStackedBar = drawStackedBar;
  window.drawAreaChart = drawAreaChart;
  window.drawStreamgraph = drawStreamgraph;

  document.querySelectorAll('.buttons button').forEach(b => b.disabled = false);


  drawGroupedBar();

}).catch(err => { console.error('CSV load error', err); document.querySelectorAll('.buttons button').forEach(b => b.disabled = false); });
