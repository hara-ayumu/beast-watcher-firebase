/**
 * 汎用データテーブル
 * - 管理画面での投稿一覧表示
 * - 行クリックによるMap連動
 * @param {Object} props
 * @param {{ key: string, label: string }[]} props.columns - カラムの定義
 * @param {Object[]} props.data - 表示するデータ
 * @param {boolean} [props.zebra=false] - 奇数偶数で色分け
 * @param {(row: Object) => void} [props.onRowClick] - 行クリック時
 * @param {(row: Object) => JSX.Element} [props.rowActions] - 行右端にボタンなどを描画
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
                        {rowActions && <th className="px-4 py-2 text-center font-semibold border-b border-gray-300">操作</th>}
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
                                    {typeof rowActions === 'function' ? rowActions(row) : null}
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
