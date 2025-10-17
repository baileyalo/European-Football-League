import React from 'react';
import { TableBodyProps } from '../types';

const TableBody: React.FC<TableBodyProps> = ({ children }) => {
    return (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="standings-table">
                <thead>
                    <tr>
                        <th style={{ width: '2rem' }}>#</th>
                        <th style={{ minWidth: '12rem' }}>Team</th>
                        <th style={{ width: '3rem' }} title="Matches played">MP</th>
                        <th style={{ width: '3rem' }} title="Wins">W</th>
                        <th style={{ width: '3rem' }} title="Draws">D</th>
                        <th style={{ width: '3rem' }} title="Losses">L</th>
                        <th style={{ width: '3rem' }} title="Goals for">GF</th>
                        <th style={{ width: '3rem' }} title="Goals against">GA</th>
                        <th style={{ width: '3rem' }} title="Goals difference">GD</th>
                        <th style={{ width: '3rem' }} title="Team points">PTS</th>
                    </tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
};

export default TableBody;