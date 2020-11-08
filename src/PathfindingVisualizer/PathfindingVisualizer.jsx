import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra'

import './PathfindingVisualizer.css'

const START_NODE_ROW = 4;
const START_NODE_COL = 19;
const TARGET_NODE_ROW = 18;
const TARGET_NODE_COL = 37;
const GRID_WIDTH = 50;
const GRID_HEIGHT = 20;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            mouseIsPressed: false,
        };
    }

    componentDidMount() {
        const grid = getStartingGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
    }

    handleMouseUp(row,col) {
        this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    resetAnimation() {
        const {grid} = this.state;
        for (let row = 0; row < GRID_HEIGHT; row++) {
            for(let col = 0; col < GRID_WIDTH; col++) {
                const node = grid[row][col];
                const startNode = grid[START_NODE_ROW][START_NODE_COL];
                const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];

                if (node === startNode) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-start';
                }
                else if (node === targetNode) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-target';
                } else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                'node';
                }
            }
        }
    }

    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const targetNode = grid[TARGET_NODE_ROW][TARGET_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, targetNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    resetPathfinder() {
        this.resetAnimation();
        const grid = getStartingGrid();
        this.setState({grid});
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <div className="overlay">
                    <div className="header">Pathfinding Visualizer
                        <button onClick = {() => this.visualizeDijkstra()}>
                            Visualize Dijkstra's Algorithm
                        </button>
                        <button onClick = {() => this.resetPathfinder()}>
                            Reset Pathfinder
                        </button>
                    </div>
                    <div className="grid">
                        {grid.map((row, rowIndx) => {
                            return (
                                <div key={rowIndx}>
                                    {row.map((node, nodeIndx) => {
                                        const {row, col, isWall, isStart, isTarget} = node;
                                        return (
                                            <Node
                                            key={nodeIndx}
                                            row={row}
                                            col={col}
                                            isWall={isWall}
                                            isStart={isStart}
                                            isTarget={isTarget}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => 
                                                this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) => 
                                                this.handleMouseEnter(row,col)}
                                            onMouseUp={() => this.handleMouseUp()}></Node>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

const getStartingGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
        const currentRow = []
        for(let col = 0; col < GRID_WIDTH; col++) {
            currentRow.push(createNode(row, col));
        }
        grid.push(currentRow)
    }
    return grid;
};

const createNode = (row, col) => {
    return  {
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isTarget: row === TARGET_NODE_ROW && col === TARGET_NODE_COL,
        isVisited: false,
        distance: Infinity,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};