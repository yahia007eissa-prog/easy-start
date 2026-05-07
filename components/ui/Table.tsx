import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function Table<T extends { id?: string }>({
  columns,
  data,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                  column.align === 'right' ? 'text-right' :
                  column.align === 'center' ? 'text-center' : 'text-left'
                }`}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id ?? index}
              className={`
                border-b border-slate-100 transition-colors
                ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}
                ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
              `}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`py-3 px-4 text-sm ${
                    column.align === 'right' ? 'text-right' :
                    column.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {column.render
                    ? column.render(item, index)
                    : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}