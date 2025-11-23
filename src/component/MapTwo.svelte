<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import * as topojson from "topojson-client";
  import { base } from "$app/paths";

  let container;

  onMount(() => {drawMapTwo();});

  function drawMapTwo() {
    const mapMargin = { top: 0, left: 0, right: 0, bottom: 0 };

    const mapHeight = 500;
    const mapWidth = 800;

    const mapChartHeight = mapHeight - mapMargin.top - mapMargin.bottom;
    const mapChartWidth = mapWidth - mapMargin.left - mapMargin.right;

    const mapSvg = d3
      .select(container)
      .append("svg")
      .attr("height", mapHeight)
      .attr("width", mapWidth)
      .append("g")
      .attr("transform", `translate(${mapMargin.left},${mapMargin.top})`);

    const mapColorScale = d3.scaleOrdinal().range(["#F5F5DC"]);

    // Color scale for school types
    const schoolColorScale = d3
      .scaleOrdinal()
      .domain(["Public", "Private"])
      .range(["#FF7F50", "#6495ED"]);

    const sizeScale = d3.scaleLinear().domain([14000, 42000]).range([3, 8]);

    const mapProjection = d3.geoAlbersUsa();
    const mapPath = d3.geoPath().projection(mapProjection);


    Promise.all([
    d3.json(`${base}/data/us_states.topojson`),
    d3.json(`${base}/data/school_coor.json`)
    ])
      .then(([mapJson, schoolData]) => {
        ready(mapJson, schoolData);
      })
      .catch((err) => console.log("Failed on", err));

    function ready(json, schoolData) {
      const mapStates = topojson.feature(json, json.objects.us_states);

      mapProjection.fitSize([mapChartWidth, mapChartHeight], mapStates);

      // Draw states
      mapSvg
        .selectAll(".state")
        .data(mapStates.features)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("d", mapPath)
        .attr("stroke", "white")
        .attr("fill", (d) => mapColorScale(d.properties.region));

      // State labels
      mapSvg
        .selectAll(".state-label")
        .data(mapStates.features)
        .enter()
        .append("text")
        .attr("class", "state-label")
        .text((d) => d.properties.postal)
        .attr("transform", (d) => {
          const coords = mapProjection(d3.geoCentroid(d));
          return coords ? `translate(${coords})` : null;
        })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", 10);

      // Function to parse amount strings (handles ranges like "$24,200–$31,800")
      function parseAmount(amountStr) {
        const cleanStr = amountStr.replace(/\$|,/g, "");
        const firstAmount = cleanStr.split("–")[0].split("-")[0];
        return parseFloat(firstAmount);
      }

      // Add school points
      mapSvg
        .selectAll(".school")
        .data(schoolData)
        .enter()
        .append("circle")
        .attr("class", "school")
        .attr("cx", (d) => {
          const coords = mapProjection([d.Longitude, d.Latitude]);
          return coords ? coords[0] : null;
        })
        .attr("cy", (d) => {
          const coords = mapProjection([d.Longitude, d.Latitude]);
          return coords ? coords[1] : null;
        })
        .attr("r", (d) => sizeScale(parseAmount(d.Amount))) // size by stipend
        .attr("fill", (d) => schoolColorScale(d.Type)) // color by type
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.8)
        .on("mouseover", function (event, d) {
          d3.select(this).attr("opacity", 1).attr("stroke-width", 2);

          // Ensure a single tooltip exists
          let tooltip = d3.select("body").select(".tooltip");
          if (tooltip.empty()) {
            tooltip = d3
              .select("body")
              .append("div")
              .attr("class", "tooltip");
          }

          tooltip
            .html(
              `<strong>${d.Institution}</strong><br/>Stipend: ${d.Amount}`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px")
            .style("opacity", 1);
        })
        .on("mousemove", function (event) {
          d3
            .select(".tooltip")
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).attr("opacity", 0.8).attr("stroke-width", 0.5);
          d3.select(".tooltip").style("opacity", 0);
        });

      // Legend for school type
      const legend = mapSvg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(10, 20)`);

      const legendData = [
        { type: "Public", color: "#FF7F50" },
        { type: "Private", color: "#6495ED" }
      ];

      const items = legend
        .selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      items
        .append("circle")
        .attr("r", 5)
        .attr("fill", (d) => d.color)
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);

      items
        .append("text")
        .attr("x", 12)
        .attr("y", 4)
        .text((d) => d.type)
        .attr("font-size", 12)
        .attr("fill", "black");
    }
  }
</script>

<div bind:this={container} class="map-container"></div>

<style>
  .map-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease-out;
  }
</style>
