/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    2.8 - Activity: Your first visualization!
 */
var margin = { left: 100, right: 10, top: 10, bottom: 150 };
var width = 600 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var flag = true;

var t = d3.transition().duration(750);

var g = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")");

var yAxisGroup = g.append("g")
    .attr("class", "y-axis");


// X Scale
var x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.5)
    .paddingOuter(0.8);

// Y Scale
var y = d3.scaleLinear()
    .range([height, 0]);

//X Label

g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 80)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");


// Y Label

var yLabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue");



d3.json("data/revenues.json").then(function(data) {
    //console.log(data);
    // Clean data
    data.forEach(function(d) {
        d.revenue = +d.revenue;
        d.profit = +d.profit
    });


    d3.interval(function() {
        var newData = flag ? data : data.slice(1);
        update(newData)
        flag = !flag
    }, 1000);
    // Run the vis for the first time
    update(data);
});


function update(data) {

    var value = flag ? "revenue" : "profit";

    x.domain(data.map(function(d) { return d.month }));

    y.domain([0, d3.max(data, function(d) { return d[value] })]);

    // X Axis
    var xAxisCall = d3.axisBottom(x);

    xAxisGroup.transition(t).call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");


    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d) {
            return d + " $";
        });

    yAxisGroup.transition(t).call(yAxisCall);

    // Bars
    // Join new data with old elements

    var rects = g.selectAll("circle")
        .data(data, function(d) {
            return d.month;
        });

    // EXIT old elements not present in new data

    rects.exit().
    attr("fill", "red")
        .transition(t)
        .attr("cy", y(0))
        .attr("height", 0)
        .remove();

    //Update old elements present in new data

    /* rects
         .transition(t)
         .attr("y", function(d) {
             return y(d[value]);
         })
         .attr("x", function(d) {
             return x(d.month);
         })
         .attr("height", function(d) {
             return height - y(d[value]);
         })
         .attr("width", x.bandwidth);*/

    //ENTER new elements present in new data
    rects.enter()
        .append("circle")
        .attr("fill", "grey")
        .attr("cy", y(0))
        .attr("cx", function(d) {
            return x(d.month) + x.bandwidth() / 2;
        })
        .attr("r", 5)
        //AND UPDATE old elements present in new data.
        .merge(rects)
        .transition(t)
        .attr("cx", function(d) {
            return x(d.month) + x.bandwidth() / 2
        })
        .attr("cy", function(d) {
            return y(d[value]);
        });

    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);
}