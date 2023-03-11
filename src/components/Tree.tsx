import React, {useEffect, useRef, useState} from "react";
import {hierarchy, linkHorizontal, select, tree} from 'd3';
import useResizeObserver from '../hooks/useResizeObserver';

const Tree = ({data} : {data: any}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dimensions = useResizeObserver(wrapperRef);
    const [treeData, setTreeData] = useState(data);

    useEffect(() => {
        if (wrapperRef.current && treeData) {
            const {width, height} = dimensions || wrapperRef.current.getBoundingClientRect();
            const root = hierarchy(treeData);
            const treeLayout = tree().size([height * 1.5, width]);
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
                `-${(width * 1.25 - width) / 2} 0 ${width * 1.25} ${height * 1.5}`
            );

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
                    .attr(
                        "viewBox",
                        `-${(width * 1.25 - width) / 2} 0 ${width * 1.25} ${height * 1.5}`
                    )
                    .tween(
                        "resize",
                        // @ts-ignore
                        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
                    );

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
                    .attr("r", 2.5)
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
        <div ref={wrapperRef} style={{height: '100%', width:'100%'}}>
        </div>
    )
}

export default Tree;

