import edit from "../assets/edit.svg";
import {select} from "d3";
import trash from "../assets/trash.svg";
import trashClicked from "../assets/trash-clicked.svg";
import add from "../assets/add.svg";
import exchange from "../assets/exchange.svg";

interface ISVGElement {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    opacity: number;
}

export const createLinkElement = (svg:any) => {
    return svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1);
}

export const createNodeElement = (svg:any) => {
    return svg
        .append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");
}

export const createLevelHeaders = (root: any, svg:any, width:number) => {
    const levels: number = root.height + 1;
    const levelWidth = width / levels;
    const headerGroup = svg.append("g");

    for (let i = 0; i < levels; i++) {
        headerGroup
            .append("text")
            .attr("x", i * levelWidth + levelWidth / 2)
            .attr("y", -50)
            .attr("fill", 'black')
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text(`Level ${i + 1}`);

        headerGroup
            .append("line")
            .attr("x1", i * levelWidth + 20)
            .attr("y1", -30)
            .attr("x2", (i + 1) * levelWidth - 20)
            .attr("y2", -30)
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        svg
            .append("title")
            .text(`Level ${i + 1}`)
            .attr("x", i * levelWidth + levelWidth / 2)
            .attr("y", 20);
    }
};

export const createLevelBackgrounds = (root: any, svg:any, width:number, height: number) => {
    let backgroundGroup: any = svg.select('#background-group');
    const levels = root.height + 1;
    const levelWidth = width / levels;

    if (backgroundGroup.empty()) {
        // create the background group if it doesn't exist
        backgroundGroup = svg.insert("g", ":first-child")
            .attr('id', 'background-group');
    }

    const data = [];
    for (let i = 0; i < levels; i++) {
        data.push(
            {
                x: levelWidth * i,
                y: -100,
                width: levelWidth - 10,
                height: height + 100,
                fill: 'green',
                opacity: 0.05
            }
        )
    }

    backgroundGroup
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d: ISVGElement) =>  d.x)
        .attr('y', (d:ISVGElement) => d.y)
        .attr('width', (d:ISVGElement) => d.width)
        .attr('height', (d:ISVGElement) => d.height)
        .attr('fill', (d:ISVGElement) => d.fill)
        .attr('opacity', (d:ISVGElement) => d.opacity)
        .lower();
};

export const createDeleteGroup = (svg:any, handleClickAction:any) => {
    const group = svg
        .append('g')
        .attr('id', 'delete-group')
        .attr('opacity', 0)
        .attr('transform', 'translate(-200,-200)');


    group.append('rect')
        .attr('width', 200)
        .attr('height', 170)
        .attr('rx', 5) // Add a border radius of 5 pixels
        .attr('fill', 'white')
        .style('filter', 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.2))') // Add a box shadow

    group.append('text')
        .attr('x', 10)
        .attr('y', 30)
        .attr('text-anchor', 'start')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text('Delete Item');
    group.append('text')
        .attr('x', 10)
        .attr('y', 60)
        .attr('text-anchor', 'start')
        .attr('font-size', '16px')
        .text('Are you sure you want');
    group.append('text')
        .attr('x', 10)
        .attr('y', 85)
        .attr('text-anchor', 'start')
        .attr('font-size', '16px')
        .text('to delete this item?');

    const buttons = group.append('g')
        .attr('transform', 'translate(0, 110)');

    buttons.append('rect')
        .attr('id', 'cancel-delete-button')
        .attr('x', 10)
        .attr('y', 0)
        .attr('width', 85)
        .attr('height', 50)
        .attr('rx', 5)
        .attr('fill', '#4C84FF1A')
        .attr("cursor", "pointer")
        .attr("pointer-events", "all")
        .on('click', () => {
            select('#delete-group').attr("opacity", 0);
            select('#icon-group').attr("opacity", 0);
            select('#trash-icon')
                .attr('href', trash)
        });

    buttons.append('text')
        .attr('id', 'cancel-delete-button-text')
        .attr('x', 55)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle')
        .attr("fill", '#4C84FF')
        .text('CANCEL')
        .attr("cursor", "pointer")
        .attr("pointer-events", "all")
        .on('click', () => {
            select('#delete-group').attr("opacity", 0);
            select('#icon-group').attr("opacity", 0);
            select('#trash-icon')
                .attr('href', trash)
        });
    buttons.append('rect')
        .attr('id', 'delete-button')
        .attr('x', 105)
        .attr('y', 0)
        .attr('width', 85)
        .attr('height', 50)
        .attr('rx', 5)
        .attr('fill', '#EB3568')
        .attr("cursor", "pointer")
        .attr("pointer-events", "all")
        .on('click', handleClickAction)

    buttons.append('text')
        .attr('id', 'delete-button-text')
        .attr('x', 150)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'white')
        .text('DELETE')
        .attr("cursor", "pointer")
        .attr("pointer-events", "all")
        .on('click', handleClickAction)

    return group;
}

export const createMenu = (svg:any) => {
    const iconGroup = svg.append('g').attr('id', 'icon-group')
    iconGroup.attr('opacity', 0).attr('transform', 'translate(-200,-200)');

    iconGroup.append('rect')
        .attr('width', 200)
        .attr('height', 50)
        .attr('rx', 5) // Add a border radius of 5 pixels
        .attr('fill', 'white')
        .style('filter', 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.2))') // Add a box shadow
    iconGroup.append('image')
        .attr('id', 'trash-icon')
        .attr('href', trash)
        .attr('x', 10)
        .attr('y', 10)
        .attr('width', 30)
        .attr('height', 30)
        .attr('fill', 'red')
        .attr("cursor", "pointer")
        .attr("pointer-events", "all")
        .on('click' , () => {
            select('#trash-icon')
                .attr('href', trashClicked)
            select('#delete-group').attr('opacity', 1)
        })
    iconGroup.append('image')
        .attr('href', add)
        .attr('x', 60)
        .attr('y', 10)
        .attr('width', 30)
        .attr('height', 30)
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");
    iconGroup.append('image')
        .attr('href', exchange)
        .attr('x', 110)
        .attr('y', 10)
        .attr('width', 30)
        .attr('height', 30)
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");
    iconGroup.append('image')
        .attr('href', edit)
        .attr('x', 160)
        .attr('y', 10)
        .attr('width', 30)
        .attr('height', 30)
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    return iconGroup;
}

// const changeName = svg.append("g");
// changeName.append('rect')
//     .attr('x', 200)
//     .attr('width', 200)
//     .attr('height', 50)
//     .attr('rx', 5) // Add a border radius of 5 pixels
//     .attr('fill', 'white')
//     .style('filter', 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.2))') // Add a box shadow
// changeName.append('image')
//     .attr('href', edit)
//     .attr('x', 360)
//     .attr('y', 10)
//     .attr('width', 30)
//     .attr('height', 30)
// let text = '';
//
// const foreignObject = changeName.append("foreignObject")
//     .attr("x", 210)
//     .attr("y", 0)
//     .attr('width', 150)
//     .attr('height', 50)
//     .attr('rx', 5) // Add a border radius of 5 pixels
//     .attr('fill', 'white')
//
// foreignObject.append("xhtml:input")
//     .style("width", "100%")
//     .style("height", "100%")
//     .style("font-size", "20px")
//     .style("outline", 'none')
//     .style("border", "none")
//     // eslint-disable-next-line no-restricted-globals
//     .on("click", function(event, d) {
//         event.stopPropagation();
//         // @ts-ignore
//         select(this).node().focus(); // Focus on the input field
//     })
//     .on("input", function(d) {
//         // handle input changes here
//         text = select(this).property("value");
//         console.log(text)
//     });
//
// foreignObject.append("xhtml:img")
//     .attr("src", "path/image.jpg")
//     .style("width", "100%")
//     .style("height", "50%");
