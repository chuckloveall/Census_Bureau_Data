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
    .domain([d3.min(data, d => d.poverty) * 0.8, d3.max(data, d => d.poverty)* 1.2 ])
    .range([0, width])
    .nice();

  const yLinearScale1 = d3.scaleLinear()
    .domain([d3.min(data, d => d.healthcareLow)* 0.8, d3.max(data, d => d.healthcareLow)* 1.2 ])
    .range([height, 0])
    .nice();

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
        // add state abbreviation to circle
        const textGroup=chartGroup
        .selectAll("#jazz")
        .data(data)
        .join("text")
        .attr("dx", d => xScale(d.poverty)+ 10)
        .attr("dy",d => yLinearScale1(d.healthcareLow) + 5 )
        .attr('text-anchor', 'end')
        .text(d => d.abbr);


        // Step 6: Initialize tool tip
        // ==============================
        const toolTip = d3.tip()
          .attr("class", "d3-tip")
          .offset([80, 60])
          .html(d => `Poverty %: ${d.poverty}<br>Lack Healthcare %: ${d.healthcareLow}`);

        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("mouseenter", function(data) {
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
