var d3 = require("d3");

var margin = {top: 20, right: 20, bottom: 70, left: 40};
var width = 600 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.timeParse("%Y-%m");

var x = d3.scaleBand().rangeRound([0, width], .05);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x)
    .tickFormat(d3.timeFormat("%Y-%m"));

var yAxis = d3.axisLeft(y)
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://gist.githubusercontent.com/d3noob/8952219/raw/d45ad0a7caf9c499d1a1e975b3760c90f5321072/bar-data.csv", function(error, data) {
	console.log(error);
	
    data.forEach(function(d) {
        d.date = parseDate(d.date);
		console.log(d.date);
        d.value = +d.value;
		console.log(d.value);
    });
	
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });
});