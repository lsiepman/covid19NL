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
        .attr("id", "graph-line")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", lineSus);

    let pathInf = graph.append("path")
        .data([graphData])
        .attr("class", "line")
        .attr("id", "graph-line")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", lineInf);

    let pathRem = graph.append("path")
        .data([graphData])
        .attr("fill", "none")
        .attr("id", "graph-line")
        .attr("stroke", "gray")
        .attr("stroke-width", 2)
        .attr("d", lineRem)
};

function removeGraph(){
    graph.selectAll("#graph-line")
        .remove()
}

function createDict(){
    return {valInfectionRate: infectionRate, valRemovalRate: removalRate, valTMax: tMax}
}

function sendDataFlask(dict){
    data = JSON.stringify(dict)    
    // ajax the JSON to the server
    $.ajax({
    url: 'getvars',
    type: 'POST',
    data: data,
    success: function(response) {
    graphData = JSON.parse(response)
    removeGraph()
    plotGraph()
    },
    error: function() {
    alert('There was a problem with the request.');
    }
    });
        // stop link reloading the page
    event.preventDefault(); 
    
}

const margin = { top: 40, right: 20, bottom: 50, left: 100 };

// create grid
const grid = d3.select(".canvas");

grid.append("div")
    .attr("class", "row")
    .attr("id", "title-row");

grid.append("div")
    .attr("class", "row")
    .attr("id", "interactive-row")

const sliderContainer = grid.select("#interactive-row")
    .append("div")
    .attr("class", "col s5 offset-s1");

// explantaion text
const title = d3.select('#title-row')
    .append("div")
    .attr("class", "col s5 offset-s1")    

title.append("h3")
    .text("SIR model")

title.append("p")
    .text("Visualisation of 'Flatten the curve'")

const explanation = d3.select("#title-row")
    .append("div")
    .attr("class", "col s5 offset-s1");

explanation.append("h5")
    .text("Explanation");

explanation.append("p")
    .attr("id", "sus-people")
    .text("Number of susceptible people");

explanation.append("p")
    .attr("id", "inf-people")
    .text("Number of infected people");

explanation.append("p")
    .attr("id", "rem-people")
    .text("Number of removed (immune/dead) people");

// slider locations
infectionRateSlider = sliderContainer.append("div")
    .attr("class", "slider-container")
    .attr("id", "infection-rate-slider");
    
infectionRateSlider.append("h5")
    .text("Infection Rate");

infectionRateSlider.append("p")
    .text("Can be decreased by good hygiene and social distancing.");

removalRateSlider = sliderContainer.append("div")
    .attr("class", "slider-container")
    .attr("id", "removal-rate-slider");

removalRateSlider.append("h5")
    .text("Removal Rate");

removalRateSlider.append("p")
    .text("Can be increased by medical treatment.");

timeSlider = sliderContainer.append("div")
    .attr("class", "slider-container")
    .attr("id", "t-max-slider");
    
timeSlider.append("h5")
    .text("Maximum time");

timeSlider.append("p")
    .text("Time in days.")


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

// axis labels
svgGraph.append("text")
    .attr("transform", "translate(300, 575)")
    .text("Time (days)");

svgGraph.append("text")
    .attr("transform", 'translate(40, 350)rotate(-90)')
    .text("Number of people")
    
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
    .max(0.5)
    .width(300)
    .ticks(5)
    .step(0.01)
    .default(infectionRate)
    .on('onchange', val => {
    infectionRate = val;
    let dict = createDict();
    sendDataFlask(dict);
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
    .max(0.3)
    .width(300)
    .ticks(5)
    .step(0.01)
    .default(removalRate)
    .on('onchange', val => {
    removalRate = val;
    let dict = createDict();
    sendDataFlask(dict);
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
    .max(3*365)
    .width(300)
    .ticks(10)
    .step(1)
    .default(tMax)
    .on('onchange', val => {
    x.domain([0, val])
    xAxisGroup.call(xAxis);
    tMax = val;
    let dict = createDict();
    sendDataFlask(dict);
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