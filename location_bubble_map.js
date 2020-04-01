// settings
const svgWidth = 1000
const svgHeight = 750
const margin = {top: 10, bottom: 10, left: 100, right: 100}
const textboxSettings = {width: 300, height: 100, x: 0, y: 0}

// add svg to page
const svg = d3.select(".canvas")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// move svg to the middle of the page 
const svgElement = document.getElementsByTagName("svg")[0];

    svgElement.style.border = "1px solid black";
    svgElement.style.position = "relative";
    svgElement.style.left = "50%";
    svgElement.style.transform = "translate(-50%, 0%)";

// add graph and create margin around graph
const graph = svg.append('g')
    .attr("width", svgWidth - margin.left - margin.right)
    .attr("height", svgHeight - margin.top - margin.bottom)
    .attr('transform', `translate(${margin.left}, ${margin.top})`); 

const textboxGroup = svg.append("g")
    
const textbox = textboxGroup.append("rect")
    .attr("x", textboxSettings.x)
    .attr("y", textboxSettings.y)
    .attr("width", textboxSettings.width)
    .attr("height", textboxSettings.height)
    .attr("fill", "#ffd280")
    .attr("opacity", 0)

// slider
var selectedColumn = "20200330"
var year = selectedColumn.substring(0, 4)
var month = selectedColumn.substring(4, 6)
var day = selectedColumn.substring(6, 8)
console.log(new Date(`${year}-${month}-${day}`))


function colsForSlider(inputData){
    var columns = inputData.columns
    columns.splice(0, 5)
    return columns

}

// interactivity mouseover
const handleMouseOver = (d, i, n) => {

    d3.select(n[i])
        .attr("fill", "orange")
        .attr("r", 8);

    textbox.attr("opacity", 1);

    textboxGroup.append("text")
        .attr("class", "textbox")
        .attr("x", textboxSettings.x + 5)
        .attr("y", textboxSettings.y + 25)
        .attr("text-anchor", "start")
        .append("tspan")
            .attr("class", "label")
            .text("Gemeente: ")
            .append("tspan")
                .attr("class", "text")
                .text(`${d.Gemeentenaam}`)


        
}
    
const handleMouseOut = (d, i, n) => {
    d3.select(n[i])
        .attr("fill", "blue")
        .attr("r", 4)

    textbox.attr("opacity", 0);
    
    d3.selectAll(".textbox").remove()
};
    
const data = d3.csv("Corona_NL_in_time.csv").then(function(data){
    
    y = d3.scaleLinear()
        .range([svgHeight - margin.top - margin.bottom, 0])
        .domain([50.5, 53.5])

    x = d3.scaleLinear()
    .range([0, svgWidth - margin.left - margin.right])
    .domain([3.258137, 7.134989])

    const circles = graph.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("r", 4)
                .attr("fill", "blue")
                .attr("cx", d => x(d.Lon))
                .attr("cy", d => y(d.Lat))
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);


    const relevantCols = colsForSlider(data)
    console.log(relevantCols)

    const slider = textboxGroup.append("div")
        .attr("id", "slider")
        .attr("x", textboxSettings.x + 20)
        .attr("y", textboxSettings.y + textboxSettings.height)
 
    });




