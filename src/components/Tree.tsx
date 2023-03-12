import React, {useEffect, useRef, useState} from "react";
import {hierarchy, linkHorizontal, map, max, min, scaleOrdinal, select, tree, treemap} from 'd3';
import useResizeObserver from '../hooks/useResizeObserver';

const Tree = ({data} : {data: any}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dimensions = useResizeObserver(wrapperRef);
    const [treeData, setTreeData] = useState(data);
    useEffect(() => {
        if (wrapperRef.current && treeData) {
            const root = hierarchy(treeData);
            const {width} = dimensions || wrapperRef.current.getBoundingClientRect();
            const height = root.descendants().length * 5;
            const treeLayout = tree().size([height * 2, width]);
            const diagonal = linkHorizontal().x((d: any) => d.y).y((d: any) => d.x);

            root.descendants().forEach((d, i) => {
                // @ts-ignore
                d.id = i;
                // @ts-ignore
                d._children = d.children;
            });

            treeLayout(root);

            const svgElement = wrapperRef.current.querySelector('svg');
            if (svgElement) {
                // SVG element already exists in DOM, no need to append a new one
                return;
            }

            const svg = select(wrapperRef.current)
                .append('svg')
                .attr(
                    "viewBox",
                    `-200 -100 ${width + 250} ${height * 2 + 100}`
                )
                .classed("svg-content-responsive", true)

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

            const createLevelHeaders = (root:any) => {
                const levels = root.height + 1;
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
                        .attr("stroke-width", "2px");

                    svg
                        .append("title")
                        .text(`Level ${i + 1}`)
                        .attr("x", i * levelWidth + levelWidth / 2)
                        .attr("y", 20);
                }
            };

            createLevelHeaders(root);

            const createLevelBackgrounds = (root:any) => {
                const levels = root.height + 1;
                const levelWidth = width / levels;
                const backgroundGroup = svg.insert("g", ":first-child");

                backgroundGroup
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", -100)
                    .attr("width", levelWidth)
                    .attr("height", height * 2 + 100)
                    .attr("fill", "white")
                    .lower();

                backgroundGroup
                    .append("rect")
                    .attr("x", levelWidth)
                    .attr("y", -100)
                    .attr("width", levelWidth)
                    .attr("height", height * 2 + 100)
                    .attr("fill", "#52B87F")
                    .attr('opacity', 0.1)
                    .lower();

                backgroundGroup
                    .append("rect")
                    .attr("x", levelWidth * 2)
                    .attr("y", -100)
                    .attr("width", levelWidth)
                    .attr("height", height * 2 + 100)
                    .attr("fill", "#EEEEEE")
                    .attr('opacity', 0.5)
                    .lower();

                backgroundGroup
                    .append("rect")
                    .attr("x", levelWidth * 3)
                    .attr("y", -100)
                    .attr("width", levelWidth)
                    .attr("height", height * 2 + 100)
                    .attr("fill", "#EEEEEE")
                    .attr('opacity', 0.25)
                    .lower();
            };

            createLevelBackgrounds(root)
            createLevelHeaders(root);

            const update = (source:any) => {
                const duration = 500;
                const nodes = root.descendants().reverse();
                const links = root.links();
                // Compute the new tree layout.
                let left:any = root;
                let right:any = root;
                root.eachBefore((node:any) => {
                    if (node.x < left.x) left = node;
                    if (node.x > right.x) right = node;
                });

                treeLayout(root);

                const transition = svg
                    .transition()
                    .duration(duration)
                    .tween(
                        "resize",
                        // @ts-ignore
                        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
                    );

                nodes.forEach(function(d:any) { d.y = d.depth * width/ 4; });
                // Update the nodes…
                const node = gNode.selectAll("g").data(nodes, (d:any) => d.id);

                // Enter any new nodes at the parent's previous position.
                const nodeEnter = node
                    .enter()
                    .append("g")
                    .attr("transform", (d) => `translate(${source.y0 || 0},${source.x0 || 0})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0)
                    .on("click", (event, d:any) => {
                        d.children = d.children ? null : d._children;
                        update(d);
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
                    .attr("text-anchor", (d:any) => (d._children ? "end" : "start"))
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
                    .attr("d", (d) => {
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
                    .attr("d", (d) => {
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
    } ,[treeData, dimensions])


    return(
        <div ref={wrapperRef} style={{height: '100%', width:'100%', position: "relative"}}/>
    )
}

export default Tree;

