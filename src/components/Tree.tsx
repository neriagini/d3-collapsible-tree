import React, {useEffect, useRef, useState} from "react";
import {hierarchy, HierarchyNode, linkHorizontal, pointer, select, tree} from 'd3';
import useResizeObserver from '../hooks/useResizeObserver';
import edit from '../assets/edit.svg';
import trash from '../assets/trash.svg';
import add from '../assets/add.svg';
import exchange from '../assets/exchange.svg';
import useClickOutside from "../hooks/useClickOutside";

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

interface IData {
    name: string;
    id: string;
    children: IData[];
}
const Tree = ({data} : {data: any}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dimensions = useResizeObserver(wrapperRef);
    const [treeData, setTreeData] = useState(data);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const [showContextMenu, setShowContextMenu] =  useClickOutside(menuRef);
    // const [focusedNode, setFocusedNode] = useState<any>(null);
    // const [deletedNodes, setDeletedNodes] = useState<any>([])

    const diagonal = linkHorizontal()
        .x((d: any) => d.y ? d.y : 0)
        .y((d: any) => d.x ? d.x : 0);

    useEffect(() => {
        if (wrapperRef.current && treeData) {
            const root = hierarchy(treeData);
            // let {width} = dimensions || wrapperRef.current.getBoundingClientRect();
            // let height = root.descendants().length * 10;
            let width = (root.height + 1) * 400;
            // const treeHeight = root.descendants().length * 20;
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
                    selected.deleted = true;
                    selected.children = selected.children ? null : selected._children;
                    update(root)
                    iconGroup.attr('opacity', 0)
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
                let nodes = root.descendants().reverse();
                let links = root.links();
                // Compute the new tree layout.
                let left:any = root;
                let right:any = root;
                root.eachBefore((node:any) => {
                    if (node.x < left.x) left = node;
                    if (node.x > right.x) right = node;
                });


                // @ts-ignore
                links = links.filter(link => !link.target.deleted)
                // @ts-ignore
                nodes = nodes.filter(node => !node.deleted)

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
                    .attr("transform", (d) => `translate(${source.y0 || 0},${source.x0 || 0})`)
                    .attr("fill-opacity", 0)
                    .attr("stroke-opacity", 0)
                    .on("click", (event, d:any) => {
                        selected = d;
                        d.children = d.children ? null : d._children;
                        update(d);
                    })
                    .on("contextmenu", (event, d) => {
                        event.preventDefault(); // prevent default context menu from showing up
                        setShowContextMenu(true);
                        selected = d;
                        // setFocusedNode(d)
                        // iconGroup.attr('transform', `translate(${event.pageX}, ${event.pageY})`)
                        // setContextMenuPosition({ x: event.pageX + 5, y: event.pageY - 45 });

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

    function deleteObjectById(id:string, obj:any, tree: any) {
        if (obj.id === id) {
            // found the object with the given ID, remove it from its parent's children array
            const parent = getParentNode(id, tree);
            if (parent) {
                 parent.children = parent.children.map((child:any) => {
                     if (child.id === id) {
                         child.deleted = true
                     }
                     return child
                 });
                console.log(data)
            }
        } else {
            // recursively search for the object with the given ID
            obj.children.forEach((child:any) => {
                deleteObjectById(id, child, tree);
            });
        }
    }

    function getParentNode(id:string, obj:any) {
        if (obj.children.some((child:any) => child.id === id)) {
            // found the parent node, return it
            return obj;
        } else {
            // recursively search for the parent node
            let result = null;
            obj.children.some((child:any) => {
                result = getParentNode(id, child);
                return result !== null;
            });
            return result;
        }
    }

    const handleDeleteNode = () => {
         // deleteObjectById(focusedNode.data.id,data, data)
        setShowContextMenu(false);
    }
    return(
            <div ref={wrapperRef} style={{position:'relative', height: '100%', width:'100%'}}>
                {/*{showContextMenu && (*/}
                {/*    <div*/}
                {/*        ref={menuRef}*/}
                {/*        style={{*/}
                {/*            position: "absolute",*/}
                {/*            left: contextMenuPosition.x,*/}
                {/*            top: contextMenuPosition.y,*/}
                {/*            display:'flex',*/}
                {/*            flexDirection: 'row',*/}
                {/*            gap: 15,*/}
                {/*            padding: 10,*/}
                {/*            borderRadius: 5,*/}
                {/*            backgroundColor: 'white',*/}
                {/*            boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.2)'*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <img onClick={handleDeleteNode} src={trash} alt='trash'/>*/}
                {/*        <img src={add} alt='add'/>*/}
                {/*        <img src={exchange} alt='exchange'/>*/}
                {/*        <img src={edit} alt='edit'/>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
    )
}

export default Tree;

