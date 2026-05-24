# Earthquake Data Visualization 🌍

An interactive, web-based dashboard built with **D3.js v7** to explore and analyze global seismic patterns. This project visualizes earthquake frequency, intensity, and distribution across two distinct timeframes using modern data visualization techniques.

## 🚀 Overview

This project provides a multi-layered perspective on seismic data:
* **Deep Dive (2021–2024):** High-resolution comparison of earthquake counts in top 15 countries.
* **Long-term Trends (2015–2024):** A decade-long analysis of seismic "flow" using continuous area-based visualizations.

## 📊 Visualization Modules

### 1. Count of Earthquakes in Top 15 Countries (2021 – 2024)

Focuses on comparing the frequency of earthquakes recorded in the top 15 most earthquake-prone countries during recent years.

* **Grouped Bar Chart:** Enables direct side-by-side comparison of earthquake counts among the top 15 countries across different years (e.g., comparing the number of earthquakes in Japan during 2022 vs. 2023).

* **Stacked Bar Chart:** Illustrates the total yearly earthquake activity for the top 15 countries while highlighting each country’s contribution to the overall count.


### 2. Longitudinal Analysis (2015 – 2024)
Focuses on the "rhythm" and surges of global activity over a 10-year span.
* **Stacked Area Chart:** Visualizes the cumulative trend of earthquake counts, making it easy to identify years with peak global activity.
* **Streamgraph:** An organic, centered visualization that emphasizes the "bursts" and ebbs of data, perfect for identifying sudden seismic sequences or aftershock periods.

## 🛠️ Built With

* **[D3.js v7](https://d3js.org/):** Data binding, SVG generation, and animation.
* **JavaScript (ES6+):** Data processing and logic.
* **HTML5/CSS3:** Dashboard structure and responsive styling.
* **[KAGGLE Data](https://www.kaggle.com/datasets/gauravkumar2525/global-earthquake-dataset-2015-2025):** Source for global seismic records.


## 📈 Key Insights
- **Comparative Scaling:** The Grouped Bar chart highlights magnitude volatility year-over-year.
- **Volume Breakdown:** Stacked charts reveal the ratio of minor vs. major events.
- **Organic Trends:** The Streamgraph visualizes the "flow" of seismic energy across the decade.

---
*Created for Seismic-stream Project.*