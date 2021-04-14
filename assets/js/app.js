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
// create chart group to bind the svg to the page
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("./assets/data/data.csv").then(data => {
  console.log(data);

  // Format the data
  // Data id for state starts at 1.
  //Data.id skips 3,7,14,43,52 and ends at 56
  data.forEach(data => {
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.income= +data.income;
    data.incomeMoe= +data.incomeMoe;
    data.healthcare= +data.healthcare;
    data.healthcareLow= +data.healthcareLow;
    data.healthcareHigh= +data.healthcareHigh;
    data.obesity= +data.obesity;
    data.obesityLow= +data.obesityLow;
    data.obesityHigh= +data.obesityHigh;
    data.smokes= +data.smokes;
    data.smokesLow= +data.smokesLow;
    data.smokesHigh= +data.smokesHigh;
  });

  // Create scaling functions
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([0, width]);

  const yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcareLow)])
    .range([height, 0]);

    // Create axis functions
  const bottomAxis = d3.axisBottom(xScale);
  const leftAxis = d3.axisLeft(yLinearScale1);

  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y1-axis to the left side of the display
  chartGroup.append("g")
    .call(leftAxis);

    // Step 5: Create Circles
        // ==============================
        const circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yLinearScale1(d.healthcareLow))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", 0.5)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

        // Step 6: Initialize tool tip
        // ==============================
        const toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, 60])
          .html(d => `<br>Poverty: ${d.poverty}<br>Healthcare Low: ${d.healthcareLow}`);

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
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("% Missing Healthcare");

        chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "axisText")
          .text("% Poverty");
}).catch(error => console.log(error));
