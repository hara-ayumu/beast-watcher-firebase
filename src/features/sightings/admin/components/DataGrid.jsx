/**
 * 汎用データテーブル
 * 
 * 機能:
 * - 管理画面での投稿一覧表示
 * - 行クリックによるMap連動
 * 
 * @param {Array} columns - { key, label } の配列
 * @param {Array} data - 表示するデータ
 * @param {Boolean} zebra - 奇数偶数で色分け
 * @param {Function} onRowClick - 行クリック時
 * @param {Function | Array} rowActions - 行右端にボタンなどを描画
 *  関数の場合: 
 * @returns {JSX.Element}
 */
function DataGrid({ columns, data, zebra = false, onRowClick, rowActions }) {
    return(
        <div className="overflow-y-auto h-full">
            <table className="min-w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-2 text-left font-semibold border-b border-gray-300"
                            >
                                {col.label}
                            </th>
                        ))}
                        {rowActions && <th className="px-4 py-2 border-b border-gray-300">操作</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr
                            key={row.id || idx}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`cursor-pointer transition-colors ${
                                    zebra ? (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50') : 'bg-white'
                                } hover:bg-blue-50`
                            }
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-2 border-b border-gray-200">
                                    {row[col.key]}
                                </td>
                            ))}
                            {rowActions && (
                                <td className="px-4 py-2 border-b border-gray-200">
                                    {typeof rowActions === 'function'
                                        ? rowActions(row)
                                        : rowActions.map((action, i) => (
                                            <button
                                                key={i}
                                                className="mr-2 px-2 py-1 text-sm text-black bg-blue-500 rounded hover:bg-blue-600"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 配列バージョンのために一応
                                                    action.onClick(row);
                                            }}
                                            >
                                                {action.label}
                                            </button>
                                        ))
                                    }
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataGrid;