// SVG wrapper dimensions are determined by the current 
// width and height of the browser window.
var svgWidth = 1200;
var svgHeight = 660;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// append svg and group
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(povertyData, err) {

    if (err) throw err;
  
    console.log(povertyData);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    povertyData.forEach(function(data) {

        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;

        data.age = +data.age;
        data.smokes = +data.smokes;

        data.income = +data.income;
        data.obesity = +data.obesity;

    });
  
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
                         .domain([(d3.min(povertyData, d => d.poverty)-1),
                                  (d3.max(povertyData, d => d.poverty)+1)])
                         .range([0, width]);

    var yLinearScale = d3.scaleLinear()
                         .domain([0, d3.max(povertyData, d => d.healthcare)+1])
                         .range([height, 0]);


    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "axisColor")
    .call(bottomAxis);

    chartGroup.append("g")
    .attr("class", "axisColor")
    .call(leftAxis);


    // Step 5: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
            return (`<strong>${d.state}</strong><hr>Poverty: ${d.poverty}<br><br>Healthcare: ${d.healthcare}`);
    }); 

    
    // Step 6: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
  
    // Step 7: Create Circles
    // ==============================
    var circlesGroup= chartGroup.selectAll("circle")
                                .data(povertyData)
                                .enter()

    circlesGroup.append("circle")
                .attr("cx", d => xLinearScale(d.poverty))
                .attr("cy", d => yLinearScale(d.healthcare))
                .attr("r", 12)
                .style("fill", "darkviolet")
                .style("stroke", "black")
                .attr("opacity", ".6")
                .on('mouseover', toolTip.show)
                .on('mouseout', toolTip.hide);
    
    // Step 8: Add text to circles
    // ==============================
    circlesGroup.insert("text")
                .text(d => d.abbr)
                .attr("class", "circleText")
                .attr("x", d => (xLinearScale(d.poverty)-6) )
                .attr("y", d => (yLinearScale(d.healthcare)+4) )
                .attr('font-size',10);

    // Step 9: Create axes labels
    // ==============================
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .style("stroke", "violet")
    .text("Healthcare (%)")
    .style("stroke", "violet");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top - 5})`)
    .attr("class", "axisText")
    .style("stroke", "violet")
    .text("Poverty(%)")
    .style("stroke", "violet");

    }).catch(function(error) {
      console.log(error);

});
  
/***********************************************************************************/