// This other script can also be used to create the project, this one uses the fetch method

const VideoGameSalesData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';


fetch(VideoGameSalesData).then((n) => n.json()).then((n) => {
    
    const data = n;
    const proyectName = data.name;

    const w = 1200;
    const h = w/2;
    const pad = w/8

    const colors = d3.scaleOrdinal(d3.schemeCategory10)

    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .attr('class', 'tooltip')
        .style('visibility', 'hidden')

    const subtitle = d3.select('#description')
        .append('text')
        .text(`${proyectName}`)
        .attr('style', 'font-size: 25px')

    const svg = d3.select('#main')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .attr('class', 'main_svg')

    const treemap = d3.treemap()
        .size([w, h])
        .padding(1)

    const root = d3.hierarchy(data)
        .sum(d => d.value)

    treemap(root);

    const cell = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

    const tile = cell.append('rect')
        .attr('class', 'tile')
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', (d) => colors(d.data.category))
        .attr('stroke', '#fff')
        .on('mouseover', (e, d) => {
            tooltip.transition()
            .duration(500)
            .style('opacity', 0.8)
            .style('visibility', 'visible')
            .attr('data-name', d.data.name)
            .attr('data-category', d.data.category)
            .attr('data-value', d.data.value)
            tooltip.html(`<strong>Game:</strong> ${d.data.name} <br>
            <strong>Console:</strong> ${d.data.category} <br> <strong>Value:</strong> ${d.data.value}`)
        })
        .on('mousemove', (e, d) => {
            tooltip.style('top', (event.pageY-80)+'px')
            .style('left', (event.pageX+20) + 'px')
            tooltip.attr('data-value', d.data.value)
        })
        .on('mouseout', (e, d) => {
            tooltip.transition()
            .duration(500)
            .style('opacity', 0.8)
            .style('visibility', 'hidden')
        })

        cell.append('text')
            .selectAll('tspan')
            .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
            .enter()
            .append('tspan')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .attr('x', 4)
            .attr('y', (d, i) => 15 + i * 12)
            .text(d => d)

        const elements = root.leaves().map(n => n.data.category)
        .filter((n, i, e) => e.indexOf(n) === i)

        // Legend
        const legendRectangle = 15;
        const w_legend = (legendRectangle + 50) * elements.length;;
        const h_legend = 100;

        const legend = d3.select('#secondContainer')
            .append('svg')
            .attr('id', 'legend')
            .attr('class', 'legend')
            .attr('width', w_legend)
            .attr('height', h_legend)

        legend.selectAll('rect')
            .data(elements)
            .enter()
            .append('rect')
            .attr('class', 'legend-item')
            .attr('fill', d => colors(d))
            .attr('y', legendRectangle/2)
            .attr('x', (d, i) => i * (legendRectangle + 50) + 10)
            .attr('width', legendRectangle)
            .attr('height', legendRectangle)

        legend.append('g')
            .selectAll('text')
            .data(elements)
            .enter()
            .append('text')
            .attr('fill', 'black')
            .attr('y', legendRectangle*3)
            .attr('x', (d, i) => i*(legendRectangle+50) + 8)
            .text(d => d)
})