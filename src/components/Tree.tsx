import React, {useEffect, useRef, useState} from "react";
import {hierarchy, HierarchyNode, linkHorizontal, select, tree} from 'd3';
import edit from '../assets/edit.svg';
import trash from '../assets/trash.svg';
import add from '../assets/add.svg';
import exchange from '../assets/exchange.svg';

interface CustomNode extends HierarchyNode<any> {
    _children?: CustomNode[];
}

interface ISVGElement {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    opacity: number;
}

const Tree = ({data} : {data: any}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [treeData, setTreeData] = useState(data);

    const diagonal = linkHorizontal()
        .x((d: any) => d.y ? d.y : 0)
        .y((d: any) => d.x ? d.x : 0);

    useEffect(() => {

        if (wrapperRef.current && treeData) {
            const root = hierarchy(treeData);
            let width = (root.height + 1) * 400;
            let height =  wrapperRef.current.clientHeight - 100
            root.descendants().forEach((d:CustomNode, i) => {
                // @ts-ignore
                d.id = i;
                d._children = d.children;
                // @ts-ignore
                d.deleted = false;
            });

            let selected:any;

            const svgElement = wrapperRef.current.querySelector('svg');
            if (svgElement) {
                // SVG element already exists in DOM, no need to append a new one
               svgElement.remove();
            }

            const svg = select(wrapperRef.current).append('svg')

            const gLink = svg
                .append("g")
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1);

            const gNode = svg
                .append("g")
                .attr("cursor", "pointer")
                .attr("pointer-events", "all");


            const createLevelHeaders = (root: any) => {
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

            const createLevelBackgrounds = (root: any) => {
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

            createLevelHeaders(root);

            const changeName = svg.append("g");

            changeName.append('rect')
                .attr('x', 200)
                .attr('width', 200)
                .attr('height', 50)
                .attr('rx', 5) // Add a border radius of 5 pixels
                .attr('fill', 'white')
                .style('filter', 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.2))') // Add a box shadow

            changeName.append('image')
                .attr('href', edit)
                .attr('x', 360)
                .attr('y', 10)
                .attr('width', 30)
                .attr('height', 30)

            let text = '';

            const foreignObject = changeName.append("foreignObject")
                .attr("x", 210)
                .attr("y", 0)
                .attr('width', 150)
                .attr('height', 50)
                .attr('rx', 5) // Add a border radius of 5 pixels
                .attr('fill', 'white')

            foreignObject.append("xhtml:input")
                .style("width", "100%")
                .style("height", "100%")
                .style("font-size", "20px")
                .style("outline", 'none')
                .style("border", "none")
                // eslint-disable-next-line no-restricted-globals
                .on("click", function(event, d) {
                    event.stopPropagation();
                    // @ts-ignore
                    select(this).node().focus(); // Focus on the input field
                })
                .on("input", function(d) {
                    // handle input changes here
                    text = select(this).property("value");
                    console.log(text)
                });

            foreignObject.append("xhtml:img")
                .attr("src", "path/image.jpg")
                .style("width", "100%")
                .style("height", "50%");

            const deleteGroup = svg.append('g')
            deleteGroup.attr('opacity', 0);
            deleteGroup.append('rect')
                .attr('width', 200)
                .attr('height', 170)
                .attr('rx', 5) // Add a border radius of 5 pixels
                .attr('fill', 'white')
                .style('filter', 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.2))') // Add a box shadow
            deleteGroup.append('text')
                .attr('x', 10)
                .attr('y', 30)
                .attr('text-anchor', 'start')
                .attr('font-size', '16px')
                .attr('font-weight', 'bold')
                .text('Delete Item');
            deleteGroup.append('text')
                .attr('x', 10)
                .attr('y', 60)
                .attr('text-anchor', 'start')
                .attr('font-size', '16px')
                .text('Are you sure you want');
            deleteGroup.append('text')
                .attr('x', 10)
                .attr('y', 85)
                .attr('text-anchor', 'start')
                .attr('font-size', '16px')
                .text('to delete this item?');
            // Create a group for the buttons
            const buttonGroup = deleteGroup.append('g')
                .attr('transform', 'translate(0, 110)');

            buttonGroup.append('rect')
                .attr('x', 10)
                .attr('y', 0)
                .attr('width', 85)
                .attr('height', 50)
                .attr('rx', 5)
                .attr('fill', '#4C84FF1A')
                .on('click', () => {
                    // Handle cancel button click
                });

            buttonGroup.append('text')
                .attr('x', 55)
                .attr('y', 25)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 'bold')
                .attr('alignment-baseline', 'middle')
                .attr("fill", '#4C84FF')
                .text('CANCEL');

            buttonGroup.append('rect')
                .attr('x', 105)
                .attr('y', 0)
                .attr('width', 85)
                .attr('height', 50)
                .attr('rx', 5)
                .attr('fill', '#EB3568')
                .attr("cursor", "pointer")
                .attr("pointer-events", "all")
                .on('click', () => {
                    selected.children = null;
                    selected._children = null;
                    selected.deleted = true;
                    update(root)
                    deleteGroup.attr("opacity", 0);
                    iconGroup.attr("opacity", 0);
                });

            buttonGroup.append('text')
                .attr('x', 150)
                .attr('y', 25)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 'bold')
                .attr('alignment-baseline', 'middle')
                .attr('fill', 'white')
                .text('DELETE')
                .attr("cursor", "pointer")
                .attr("pointer-events", "all")
                .on('click', () => {
                    selected.children = null;
                    selected._children = null;
                    selected.deleted = true;
                    update(root)
                    deleteGroup.attr("opacity", 0);
                    iconGroup.attr("opacity", 0);
                });



            const iconGroup = svg.append('g')
            iconGroup.attr('opacity', 0);
            iconGroup.append('rect')
                .attr('width', 200)
                .attr('height', 50)
                .attr('rx', 5) // Add a border radius of 5 pixels
                .attr('fill', 'white')
                .style('filter', 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.2))') // Add a box shadow
            iconGroup.append('image')
                .attr('href', trash)
                .attr('x', 10)
                .attr('y', 10)
                .attr('width', 30)
                .attr('height', 30)
                .attr("cursor", "pointer")
                .attr("pointer-events", "all")
                .on('click' , () => {
                    deleteGroup.attr('opacity', 1)
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


            const update = (source: any) => {
                const duration = 500;
                // @ts-ignore
                let nodes = root.descendants().filter(node => !node.deleted)

                nodes.forEach((node:any) => {
                    if (node.parent && node.parent.children) {
                        node.parent.children = node.parent.children.filter((child:any) => !child.deleted);
                    }
                });


                // @ts-ignore
                let links = root.links().filter(link => !link.target.deleted);

                // Compute the new tree layout.
                let left:any = root;
                let right:any = root;
                root.eachBefore((node: any ) => {
                    if (node.x < left.x) left = node;
                    if (node.x > right.x) right = node;
                });

                height = Math.max(nodes.length * 10 + 100,wrapperRef.current ? wrapperRef.current.clientHeight: 0);
                // height = nodes.length * 20 + 100;

                const treeLayout = tree().size([height, width]);
                treeLayout(root);
                createLevelBackgrounds(root)

                svg
                    .attr('height', height)
                    .attr("viewBox", `0 -100 ${width} ${height + 100}`)
                    .classed("svg-content-responsive", true)

                const transition = svg
                    .transition()
                    .duration(duration)
                    .tween(
                        "resize",
                        // TODO - next line might not be needed
                        // @ts-ignore
                        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
                    );

                // maintain persistent equal width for all levels
                nodes.forEach(function(d:any) { d.y = d.depth * width/ (root.height + 1); });
                // adjusting levels locations
                nodes.forEach(function(d:any) {
                    // if (d.depth === 0) d.y += width/(root.height + 1) - 50
                    if (d.depth !== root.height) d.y += 200

                });

                // Update the nodes…
                const node = gNode.selectAll("g").data(nodes, (d:any) => d.id);

                // Enter any new nodes at the parent's previous position.
                const nodeEnter = node
                    .enter()
                    .append("g")
                    .attr("transform", () => `translate(${source.y0 || 0},${source.x0 || 0})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0)
                    .on("click", (event, d:any) => {
                        selected = d;
                        d.children = d.children ? null : d._children;
                        update(d);
                    })
                    .on("contextmenu", (event, d:any) => {
                        event.preventDefault(); // prevent default context menu from showing up
                        selected = d;
                        iconGroup
                            .attr('opacity', 1)
                            .attr('transform', () => {
                            const {x,y} = event
                            // @ts-ignore
                            const ctm = svg.node().getScreenCTM();
                            // @ts-ignore
                            const newX = (x - ctm.e) / ctm.a;
                            // @ts-ignore
                            const newY = (y - ctm.f) / ctm.d;
                            return `translate(${newX + 10}, ${newY - 60})`;
                        });
                        deleteGroup
                            .attr('opacity', 0)
                            .attr('transform', () => {
                                const {x,y} = event
                                // @ts-ignore
                                const ctm = svg.node().getScreenCTM();
                                // @ts-ignore
                                const newX = (x - ctm.e) / ctm.a;
                                // @ts-ignore
                                const newY = (y - ctm.f) / ctm.d;
                                return `translate(${newX + 10}, ${newY})`;
                            });
                        update(root)
                    });

                nodeEnter
                    .append("circle")
                    .attr("r", 4)
                    .attr("fill", (d:any) => (d._children ? "#555" : "#999"))
                    .attr("stroke-width", 10);

                nodeEnter
                    .append("text")
                    .attr("dy", "0.31em")
                    .attr("x", (d:any) => (d._children ? -6 : 6))
                    .attr("text-anchor", (d:any) => (d._children  ? "end" : "start"))
                    .text((d:any) => d.data.name)
                    .clone(true)
                    .lower()
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-width", 3)
                    .attr("stroke", "white");

                // Transition nodes to their new position.
                node
                    .merge(nodeEnter as any)
                    .transition(transition as any)
                    .attr("transform", (d:any) => `translate(${d.y || 0},${d.x || 0})`)
                    .attr("fill-opacity", 1)
                    .attr("stroke-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                node
                    .exit()
                    .transition(transition as any)
                    .remove()
                    .attr("transform", () => `translate(${source.y || 0},${source.x || 0})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0);

                // Update the links…
                const link = gLink.selectAll("path").data(links, (d:any) => d.target.id);

                // Enter any new links at the parent's previous position.
                const linkEnter = link
                    .enter()
                    .append("path")
                    .attr("d", () => {
                        const o = { x: source.x0, y: source.y0 };
                        return diagonal({ source: o, target: o } as any);
                    });

                // Transition links to their new position.
                link.merge(linkEnter as any).transition(transition as any).attr("d", diagonal as any);

                // Transition exiting nodes to the parent's new position.
                link
                    .exit()
                    .transition(transition as any)
                    .remove()
                    .attr("d", () => {
                        const o = { x: source.x, y: source.y };
                        return diagonal({ source: o, target: o } as any);
                    });

                // Stash the old positions for transition.
                root.eachBefore((d:any) => {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }
            update(root);
        }
    } ,[treeData])

    return(
        <div ref={wrapperRef} style={{position:'relative', height: '100%', width:'100%'}}/>
    )
}

export default Tree;

