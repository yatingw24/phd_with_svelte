<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { base } from "$app/paths"; 

  let container;

  onMount(() => {
    drawMultiline();
  });

  function drawMultiline() {
    const margin = { top: 20, right: 200, bottom: 80, left: 60 };
    const width = 850;
    const height = 500;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${margin.top})`
      );

    // Scales
    const xPositionScale = d3.scalePoint().range([0, chartWidth]);
    const yPositionScale = d3.scaleLinear().range([chartHeight, 0]);
    const colorScale = d3
      .scaleOrdinal()
      .domain(["Business", "STEM", "Social Science", "Humanities"])
      .range(["#7fb3d3", "#2c3e50", "#b19cd9", "#FFB6C1"]);

    const line = d3
      .line()
      .x((d) => xPositionScale(d["Academic Year"]))
      .y((d) => yPositionScale(d.median_pay));

    d3.json(`${base}/data/linechart.json`)
      .then(ready)
      .catch((error) => {
        console.log("Failed with", error);
      });

    function ready(datapoints) {
      // Convert pay to numbers
      datapoints.forEach((d) => {
        d.median_pay = +d.median_pay;
      });

      // Update scales
      const years = [...new Set(datapoints.map((d) => d["Academic Year"]))].sort();
      const maxPay = d3.max(datapoints, (d) => d.median_pay);

      xPositionScale.domain(years);
      yPositionScale.domain([20000, maxPay + 2000]);

      // Group rows by field
      const grouped = d3.groups(datapoints, (d) => d.Field);

      // Draw lines
      svg
        .selectAll(".field-line")
        .data(grouped)
        .enter()
        .append("path")
        .attr("class", "field-line")
        .attr("stroke", (group) => colorScale(group[0]))
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("d", (group) => line(group[1]));

      // Add dots for each data point
      svg
        .selectAll(".field-dot")
        .data(datapoints)
        .enter()
        .append("circle")
        .attr("class", (d) => `dot-${d.Field.replace(/\s+/g, "-")}`)
        .attr("cx", (d) => xPositionScale(d["Academic Year"]))
        .attr("cy", (d) => yPositionScale(d.median_pay))
        .attr("r", 3.5)
        .attr("fill", (d) => colorScale(d.Field));

      // Draw axes
      const yAxisGenerator = d3
        .axisLeft(yPositionScale)
        .tickFormat((d) => `${d3.format(",")(d)}`)
        .ticks(6);

      const yAxis = svg
        .append("g")
        .attr("class", "axis y-axis")
        .call(yAxisGenerator);

      const xAxisGenerator = d3.axisBottom(xPositionScale);
      const xAxis = svg
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxisGenerator);

      xAxis
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)");

      xAxis
        .append("text")
        .attr("x", chartWidth / 2)
        .attr("y", margin.bottom - 10)
        .attr("fill", "black")
        .style("font-size", "12px")
        .text("Academic Year");

      yAxis.selectAll("text").style("text-anchor", "end");

      yAxis
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + 10)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Median Pay ($)");

      // Annotation (text + curvy arrow)
      const annotationX = chartWidth - 20;
      const annotationY = chartHeight - 20;

      const targetX =
        (xPositionScale("2019-2020") + xPositionScale("2020-2021")) / 2;
      const targetY = yPositionScale(25000);

      const annotationGroup = svg
        .append("g")
        .attr("class", "annotation-group");

      const textStartX = annotationX - 180;
      const annotationText = annotationGroup
        .append("text")
        .attr("x", textStartX)
        .attr("y", annotationY - 30)
        .attr("font-size", "11px")
        .style("text-anchor", "start");

      annotationText
        .append("tspan")
        .attr("x", textStartX)
        .attr("dy", "0")
        .text("The pandemic also hurt PhD students");

      annotationText
        .append("tspan")
        .attr("x", textStartX)
        .attr("dy", "12")
        .text("in Humanities and Social Sciences");

      annotationText
        .append("tspan")
        .attr("x", textStartX)
        .attr("dy", "12")
        .text("the most.");

      // Arrowhead marker
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 5 10")
        .attr("refX", 5)
        .attr("refY", 0)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#666");

      const curveEndX = textStartX - 10;
      const curveEndY = annotationY - 30;

      const controlX = (targetX + curveEndX) / 2;
      const controlY = (targetY + curveEndY) / 2 + 20;

      const curvePath = `M ${targetX} ${targetY} Q ${controlX} ${controlY} ${curveEndX} ${curveEndY}`;

      annotationGroup
        .append("path")
        .attr("d", curvePath)
        .attr("stroke", "#666")
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("marker-end", "url(#arrowhead)");

      // Legend
      const legend = svg
        .append("g")
        .attr("transform", `translate(${chartWidth + 50}, 50)`);

      const legendOrder = ["Business", "STEM", "Humanities", "Social Science"];

      legendOrder.forEach((fieldName, i) => {
        const legendItem = legend
          .append("g")
          .attr("transform", `translate(0, ${i * 20})`);

        legendItem
          .append("circle")
          .attr("r", 6)
          .attr("fill", colorScale(fieldName));

        legendItem
          .append("text")
          .attr("x", 15)
          .attr("y", 0)
          .attr("dy", "0.35em")
          .attr("font-size", "12px")
          .text(fieldName);
      });
    }
  }
</script>

<div bind:this={container} class="chart-wrapper"></div>

<style>
  .chart-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
