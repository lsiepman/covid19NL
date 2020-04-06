// settings
const svgWidth = 1000
const svgHeight = 700
const margin = {top: 10, bottom: 10, left: 100, right: 100}
const textboxSettings = {width: 320, height: 100, x: 0, y: 0}


// add create grid
const grid = d3.select(".canvas");

grid.append("div")
    .attr("class", "row")
        .append("div")
        .attr("class", "col s8 offset-s2")
            .attr("id", "title");

grid.append("div")
    .attr("class", "row")
      .attr("id", "data-row");

// title
const title = d3.select("#title")
    .append("h3")
        .text("COVID-19 cases in the Netherlands.")

// slider
const slider = d3.select("#data-row")
    .append("div")
        .attr("class", "col s2")
        .attr("id", "slider")
        .append("h5")
            .text("Select date")

// map
const svg = d3.select("#data-row")
    .append("div")
        .attr("class", "col s10")
        .attr("id", "map")
        .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

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
        .domain([50.7, 53.5])

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

    var sliderVertical = d3
        .sliderLeft()
        .min(0)
        .max(5)
        .height(svgHeight - margin.bottom - margin.top - 100)
        .ticks(5)
        .default(2);

   var gVertical = d3
        .select('div#slider')
        .append('svg')
        .attr('width', 100)
        .attr('height', svgHeight - margin.bottom - margin.top - 50)
        .append('g')
        .attr('transform', 'translate(80,30)');

    gVertical.call(sliderVertical);





});

    // const slider = textboxGroup.append("div")
    //     .attr("id", "slider")
    //     .attr("x", textboxSettings.x + 20)
    //     .attr("y", textboxSettings.y + textboxSettings.height)
        
    // const sliderVertical = d3.sliderLeft()
    //     .min(0)
    //     .max(10)
    //     .height(300)
    //     .tickFormat(d3.format('.2%'))
    //     .ticks(10)
    //     .default(5)
    //     .on('onchange', val => {
    //         d3.select('p#value-vertical').text(d3.format('.2%')(val));
    //       });
        
    // const gVertical = d3.select('div#slider')
    // .append('svg')
    // .attr('width', 100)
    // .attr('height', 400)
    // .append('g')
    // .attr('transform', 'translate(60,30)');

    // gVertical.call(sliderVertical);

//     const divsSlider = textboxGroup.append("div")
//         .attr("class", "row align-items-center")
//         .attr("x", textboxSettings.x + 20)
//         .attr("y", textboxSettings.y + textboxSettings.height)
//         .append("div")
//             .attr("id", "slider-vertical")
//     })

//     // Vertical
//     var sliderVertical = d3
//         .sliderLeft()
//         .min(0)
//         .max(5)
//         .height(300)
//         .tickFormat(d3.format('.2%'))
//         .ticks(5)
//         .default(2);
        

// var gVertical = d3
//     .select('div#slider-vertical')
//     .append('svg')
//     .attr('width', 100)
//     .attr('height', 400)
//     .append('g')
//     // .attr('transform', 'translate(80,30)');

// gVertical.call(sliderVertical);

// d3.select('p#value-vertical').text(d3.format('.2%')(sliderVertical.value()));
 





