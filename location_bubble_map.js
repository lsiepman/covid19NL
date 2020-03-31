// settings
const graphWidth = 550
const graphHeight = 850
const margin = 50

// add svg to page
const svg = d3.select(".canvas")
    .append("svg")
    .attr("height", graphHeight)
    .attr("width", graphWidth);

// add graph and create margin around graph
const graph = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`); 

    
const data = d3.csv("Corona_NL_in_time.csv").then(function(data){
    
    y = d3.scaleLinear()
        .range([graphHeight - margin, 0])
        .domain([53.588047, 50.671552])

    x = d3.scaleLinear()
    .range([graphWidth - margin, 0])
    .domain([3.258137, 7.134989])

    const circles = graph.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
                .attr("r", 4)
                .attr("fill", "blue")
                .attr("cx", d => x(d.Lon))
                .attr("cy", d => y(d.Lat));
    });




