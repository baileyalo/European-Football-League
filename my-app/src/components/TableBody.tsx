import React from 'react';
import { TableBodyProps } from '../types';
import { STANDINGS_COLUMNS } from '../constants/standingsColumns';

const TableBody: React.FC<TableBodyProps> = React.memo(({ children }) => (
  <div className="standings-table-wrap">
    <table className="standings-table">
      <caption className="standings-caption">League standings</caption>
      <thead>
        <tr>
          {STANDINGS_COLUMNS.map((column) => (
            <th key={column.key} scope="col" className={column.className} title={column.title}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
));
TableBody.displayName = 'TableBody';

export default TableBody;
