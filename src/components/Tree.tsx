import React, {useEffect, useRef, useState} from "react";
import {hierarchy, HierarchyNode, linkHorizontal, select, tree} from 'd3';
import useResizeObserver from '../hooks/useResizeObserver';
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
    const dimensions = useResizeObserver(wrapperRef);
    const [treeData, setTreeData] = useState(data);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    const diagonal = linkHorizontal()
        .x((d: any) => d.y ? d.y : 0)
        .y((d: any) => d.x ? d.x : 0);

    useEffect(() => {
        if (wrapperRef.current && treeData) {
            const root = hierarchy(treeData);
            const {width} = dimensions || wrapperRef.current.getBoundingClientRect();
            let height = root.descendants().length * 20;
            root.descendants().forEach((d:CustomNode, i) => {
                // @ts-ignore
                d.id = i;
                d._children = d.children;
            });


            const svgElement = wrapperRef.current.querySelector('svg');
            if (svgElement) {
                // SVG element already exists in DOM, no need to append a new one
               svgElement.remove();
            }

            const svg = select(wrapperRef.current)
                .append('svg')
                .attr(
                    "viewBox",
                    `0 -100 ${width} ${height + 100}`
                )
                // .attr(
                //     "viewBox",
                //     `-200 -100 ${width + 250} ${height + 100}`
                // )
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

            const createLevelHeaders = (root: any) => {
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

                backgroundGroup
                    .selectAll('rect')
                    .data([{
                        x: 0,
                        y: -100,
                        width: levelWidth,
                        height: height + 100,
                        fill: 'white',
                        opacity: 1
                        },
                        {
                            x: levelWidth,
                            y: -100,
                            width: levelWidth,
                            height: height + 100,
                            fill: '#52B87F',
                            opacity: 0.1
                        },
                        {
                            x: levelWidth * 2,
                            y: -100,
                            width: levelWidth,
                            height: height + 100,
                            fill: '#EEEEEE',
                            opacity: 0.5
                        },
                        {
                            x: levelWidth * 3,
                            y: -100,
                            width: levelWidth,
                            height: height + 100,
                            fill: '#EEEEEE',
                            opacity: 0.25
                        }
                    ])
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

            const update = (source: any) => {
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

                height = nodes.length * 20;

                const treeLayout = tree().size([height, width]);
                treeLayout(root);

                const transition = svg
                    .transition()
                    .duration(duration)
                    .tween(
                        "resize",
                        // TODO - next line might not be needed
                        // @ts-ignore
                        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
                    );

                createLevelBackgrounds(root)

                // maintain persistent equal width for all levels
                nodes.forEach(function(d:any) { d.y = d.depth * width/ 4; });

                // adjusting levels locations
                nodes.forEach(function(d:any) {
                    if (d.depth === 0) d.y += width/4;
                    if (d.depth === 1) d.y += width / 4;
                    if (d.depth === 2) d.y += width / 8;
                });

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
                        setShowContextMenu(false);
                    })
                    .on("contextmenu", (event) => {
                        event.preventDefault(); // prevent default context menu from showing up
                        setShowContextMenu(true);
                        setContextMenuPosition({ x: event.pageX + 5, y: event.pageY - 45 });
                    });

                nodeEnter
                    .append("circle")
                    .attr("r", 4)
                    .attr("fill", (d:any) => (d._children ? "#555" : "#999"))
                    .attr("stroke-width", 10);

                nodeEnter
                    .append("text")
                    .attr("dy", "0.31em")
                    .attr("x", (d:any) => (d._children || d.depth === 1 ? -6 : 6))
                    .attr("text-anchor", (d:any) => (d._children || d.depth === 1 ? "end" : "start"))
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

    function handleContextMenu(event: any) {
        event.preventDefault(); // prevent default context menu from showing up
        setShowContextMenu(true);
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
    }

    function handleContextMenuClose() {
        setShowContextMenu(false);
    }
    return(
        <div ref={wrapperRef} style={{position:'relative', height: '100%', width:'100%'}}>
            {showContextMenu && (
                <div style={{ position: "absolute", left: contextMenuPosition.x, top: contextMenuPosition.y, display:'flex', flexDirection: 'row', gap:10, padding: 10, borderRadius: 5, backgroundColor: 'white' }}>
                    <img src={trash} />
                    <img src={add}/>
                    <img src={exchange}/>
                    <img src={edit}/>
                </div>
            )}
        </div>
    )
}

export default Tree;

