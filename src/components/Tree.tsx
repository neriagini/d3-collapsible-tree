import React, {useEffect, useRef, useState} from "react";
import {hierarchy, HierarchyNode, linkHorizontal, select, tree} from 'd3';
import trash from '../assets/trash.svg';

import {
    createActionFrame,
    createLevelBackgrounds,
    createLevelHeaders,
    createLinkElement, createMenu,
    createNodeElement
} from "../elements/elements";

interface CustomNode extends HierarchyNode<any> {
    _children?: CustomNode[];
    deleted?: boolean;
    id?: string;
}

const diagonal = linkHorizontal()
    .x((d: any) => d.y ? d.y : 0)
    .y((d: any) => d.x ? d.x : 0);

const duration = 500;

const Tree = ({data} : {data: any}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [treeData, setTreeData] = useState(data);

    useEffect(() => {
        if (wrapperRef.current && treeData) {

            // INITIALIZATIONS
            let selected:any;
            const root = hierarchy(treeData);
            let width = (root.height + 1) * 400;
            let height =  wrapperRef.current.clientHeight
            root.descendants().forEach((d:CustomNode, i) => {
                // @ts-ignore
                d.id = i;
                d._children = d.children;
                d.deleted = false;
            });
            const svgElement = wrapperRef.current.querySelector('svg');
            if (svgElement) {
                svgElement.remove();
            }
            const svg = select(wrapperRef.current).append('svg')

            // HANDLES
            const handleDeleteAction = () => {
                selected.children = null;
                selected._children = null;
                selected.deleted = true;
                update(root)
                svg.select('#menu')
                    .attr("opacity", 0)
                    .attr('transform', 'translate(-200,-200)');
                svg.select('#action-frame')
                    .attr("opacity", 0)
                    .attr('transform', 'translate(-200,-200)');
                menu.select('#trash-icon')
                    .attr('href', trash)
            }

            // SVG ELEMENTS CREATION
            createLevelHeaders(root, svg, width);
            const gLink = createLinkElement(svg);
            const gNode =createNodeElement(svg);
            const actionFrame = createActionFrame(svg);
            const menu = createMenu(svg, handleDeleteAction);

            // MAIN UPDATE FUNCTION
            const update = (source: any) => {
                let nodes = root.descendants().filter((node:CustomNode) => !node.deleted)
                nodes.forEach((node:any) => {
                    if (node.parent && node.parent.children) {
                        node.parent.children = node.parent.children.filter((child:any) => !child.deleted);
                    }
                });
                let links = root.links().filter((link:any) => !link.target.deleted);

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

                createLevelBackgrounds(root, svg, width, height)

                svg
                    .attr('height', height)
                    .attr("viewBox", `0 -100 ${width} ${height + 350}`)
                    .classed("svg-content-responsive", true)

                const transition = svg
                    .transition()
                    .duration(duration)
                    .tween(
                        "resize",
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
                    .on("click", (event:any, d:any) => {
                        selected = d;
                        d.children = d.children ? null : d._children;
                        update(d);
                    })
                    .on("contextmenu", (event:any, d:any) => {
                        event.preventDefault(); // prevent default context menu from showing up
                        selected = d;
                        menu
                            .attr('opacity', 1)
                            .attr('transform', () => {
                            const {x,y} = event
                            // @ts-ignore
                            const ctm = svg.node().getScreenCTM();
                            if (ctm) {
                                const newX = (x - ctm.e) / ctm.a;
                                const newY = (y - ctm.f) / ctm.d;
                                return `translate(${newX + 10}, ${newY - 60})`;
                            }
                        });
                        actionFrame
                            .attr('opacity', 0)
                            .attr('transform', () => {
                                const {x,y} = event
                                const ctm = svg.node()?.getScreenCTM();
                                if (ctm) {
                                    const newX = (x - ctm.e) / ctm.a;
                                    const newY = (y - ctm.f) / ctm.d;
                                    return `translate(${newX + 10}, ${newY})`;
                                }
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

                // Update the links
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

    return <div ref={wrapperRef} style={{position:'relative', height: '100%', width:'100%'}}/>
}

export default Tree;

