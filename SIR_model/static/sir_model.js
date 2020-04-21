// Define variables
var infectionRate = 0.2
var removalRate = 0.1
var tMax = 365

// d3 line path generators
let lineSus = d3.line()
.x(function(d) { return x(d.Days); })
.y(function(d) { return y(d.Susceptible); });

// define the 2nd line
let lineInf = d3.line()
.x(function(d) { return x(d.Days); })
.y(function(d) { return y(d.Infected); });

let lineRem = d3.line()
.x(function(d) { return x(d.Days); })
.y(function(d) { return y(d.Removed); });


function plotGraph(){
        
    let pathSus = graph.append("path")
        .data([graphData])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", lineSus);

    let pathInf = graph.append("path")
        .data([graphData])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", lineInf);

    let pathRem = graph.append("path")
        .data([graphData])
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("stroke-width", 2)
        .attr("d", lineRem)
};

function createDict(){
    return {valInfectionRate: infectionRate, valRemovalRate: removalRate, valTMax: tMax}
}

function sendDataFlask(dict){
    data = JSON.stringify(dict)    
    // ajax the JSON to the server
        $.post("getvars", data , function(){
    
        });
        // stop link reloading the page
     event.preventDefault(); 
    
     console.log(data)
}
const margin = { top: 40, right: 20, bottom: 50, left: 100 };

// create grid
const grid = d3.select(".canvas");

grid.append("div")
    .attr("class", "row")
    .attr("id", "title-row");

grid.append("div")
    .attr("class", "row")
    .attr("id", "param-row");

grid.append("div")
    .attr("class", "row")
    .attr("id", "interactive-row")

// parameter text
const paramContainer = d3.select("#param-row")
    .append("div")
    .attr("class", "col s5 offset-s7");

paramContainer.append("p")
    .attr("id", "infection-rate")
    .text(`Infection Rate: ${infectionRate}`);

paramContainer.append("p")
    .attr("id", "removal-rate")
    .text(`Removal Rate: ${removalRate}`);

paramContainer.append("p")
    .attr("id", "maximum-time")
    .text(`Maximum time: ${tMax} days`);

paramContainer.append("p")
    .attr("id", "R-zero")
    .html(`R<sub>0</sub>: ${infectionRate/removalRate}`)


const sliderContainer = grid.select("#interactive-row")
    .append("div")
    .attr("class", "col s5 offset-s1");

sliderContainer.append("div")
    .attr("class", "slider-container")
    .attr("id", "infection-rate-slider")
    .append("h4")
    .text("Infection Rate")

sliderContainer.append("div")
    .attr("class", "slider-container")
    .attr("id", "removal-rate-slider")
    .append("h4")
    .text("Removal Rate");

sliderContainer.append("div")
    .attr("class", "slider-container")
    .attr("id", "t-max-slider")
    .append("h4")
    .text("Maximum time");

graphContainer = grid.select("#interactive-row")
    .append("div")
    .attr("class", "col s6")
    .attr("id", "graph-container");

svgGraph = graphContainer.append("svg");

graph = svgGraph.append("g")
.attr("class", "graph")
.attr('transform', `translate(${margin.left}, ${margin.top})`);

// scales and axes
const x = d3.scaleLinear()    
    .range([0, 450])
    .domain([0, tMax]); // x-axis scale

const xAxisGroup = graph.append("g")
    .attr("class", "x-axis")
    .attr('transform', 'translate(0, 500)');
    
const xAxis = d3.axisBottom(x)
.ticks(10);

xAxisGroup.call(xAxis);

const y = d3.scaleLinear()
    .range([500, 0])
    .domain([0, population]); // y-axis scale

const yAxisGroup = graph.append("g")
.attr("class", "y-axis");

const yAxis = d3.axisLeft(y)
.ticks(10);

yAxisGroup.call(yAxis);


// create sliders
let sliderInfectionRate = d3.sliderBottom()
    .min(0)
    .max(50)
    .width(300)
    .ticks(10)
    .step(0.01)
    .default(infectionRate)
    .on('onchange', val => {
      d3.select('p#infection-rate').text(`Infection Rate: ${val}`);
      d3.select("p#R-zero").html(`R<sub>0</sub>: ${val/removalRate}`)
      infectionRate = val;
      let dict = createDict()
      sendDataFlask(dict)
    });

let sliderInfectionRateGroup = d3
.select('div#infection-rate-slider')
.append('svg')
.attr('width', 500)
.attr('height', 100)
.append('g')
.attr('transform', 'translate(15, 15)');

let sliderRemovalRate = d3.sliderBottom()
    .min(0)
    .max(50)
    .width(300)
    .ticks(10)
    .step(0.01)
    .default(removalRate)
    .on('onchange', val => {
      d3.select('p#removal-rate').text(`Removal Rate: ${val}`);
      d3.select("p#R-zero").html(`R<sub>0</sub>: ${infectionRate/val}`);
    });

let sliderRemovalRateGroup = d3
.select('div#removal-rate-slider')
.append('svg')
.attr('width', 500)
.attr('height', 100)
.append('g')
.attr('transform', 'translate(15,15)');

let sliderTMax = d3.sliderBottom()
    .min(0)
    .max(10*365)
    .width(300)
    .ticks(10)
    .step(1)
    .default(tMax)
    .on('onchange', val => {
      d3.select('p#maximum-time').text(`Maximum time: ${val} days`);
      x.domain([0, val])
      xAxisGroup.call(xAxis);
    
    });

let sliderTMaxGroup = d3
.select('div#t-max-slider')
.append('svg')
.attr('width', 500)
.attr('height', 100)
.append('g')
.attr('transform', 'translate(15,15)');

sliderInfectionRateGroup.call(sliderInfectionRate);
sliderRemovalRateGroup.call(sliderRemovalRate);
sliderTMaxGroup.call(sliderTMax);


plotGraph()




