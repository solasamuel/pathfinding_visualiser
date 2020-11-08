import React, {Component} from 'react';

import './Node.css'

export default class Node extends Component {
    render() {
        const {
            isTarget,
            isStart,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            col,
            row,
        } = this.props;
        const extraClassName = isTarget
            ? 'node-target'
            : isStart
            ? 'node-start'
            : isWall
            ? 'node-wall'
            : '';

        return (
            <div 
                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp(row, col)}></div>
        );
    }
}