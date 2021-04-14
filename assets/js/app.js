// @TODO: YOUR CODE HERE!
const svgWidth = 960;
const svgHeight = 500;

const margin = { top: 20, right: 40, bottom: 60, left: 50 };

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("./assets/data/data.csv").then(data => {
  console.log(data);

  // Create a function to parse date and time
  const parseTime = d3.timeParse("%d-%b-%Y");

  // Format the data
  data.forEach(data => {
    data.date = parseTime(data.date);
    data.dow_index = +data.dow_index;
    data.smurf_sightings = +data.smurf_sightings;
  });

  // Create scaling functions
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);

  const yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.dow_index)])
    .range([height, 0]);

    // Create axis functions
  const bottomAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d-%b-%Y"));
  const leftAxis = d3.axisLeft(yLinearScale1);

  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y1-axis to the left side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    .classed("green", true)
    .call(leftAxis);

    // Step 5: Create Circles
        // ==============================
        const circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.hair_length))
        .attr("cy", d => yLinearScale1(d.num_hits))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", 0.5)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

        // Step 6: Initialize tool tip
        // ==============================
        const toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(d => `${d.rockband}<br>Hair length: ${d.hair_length}<br>Hits: ${d.num_hits}`);

        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("click", function(data) {
          toolTip.show(data, this);
        })
          // onmouseout event
          .on("mouseout", function(data) {
            toolTip.hide(data);
          });

        // Create axes labels
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 40)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("Number of Billboard 100 Hits");

        chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "axisText")
          .text("Hair Metal Band Hair Length (inches)");
}).catch(error => console.log(error));
