/**
 * 投稿ステータスに応じた操作ボタンを表示するコンポーネント
 * DataGridやInfoWindowなど共通で使用可能
 * @param {string} status - 投稿の状態 ("pending" | "approved" | "rejected")
 * @param {Function} onApprove - 承認ボタンをクリックしたときに呼ばれる関数
 * @param {Function} onReject - 却下ボタンをクリックしたときに呼ばれる関数
 * @returns {JSX.Element} 状態に応じた操作ボタンの JSX
 */
function PostActionButtons({ status, onApprove, onReject }) {
    // ステータスに応じたボタン配列を返す関数
    const getButtons = () => {
        switch (status) {
            case 'pending':
                return [
                    {
                        label: '承認',
                        color: 'bg-green-500 hover:bg-green-600 text-white',
                        action: onApprove,
                    },
                    {
                        label: '却下',
                        color: 'bg-red-500 hover:bg-red-600',
                        action: onReject,
                    },
                ];
            case 'approved':
                return [
                    {
                        label: '却下',
                        color: 'bg-red-500 hover:bg-red-600',
                        action: onReject,
                    },
                ];
            case 'rejected':
                return [
                    {
                        label: '承認',
                        color: 'bg-green-500 hover:bg-green-600 text-white',
                        action: onApprove,
                    },
                ];
            default:
                return [];
        }
    }

    return (
        <div className="flex gap-2">
            {getButtons().map((btn, i) => (
                <button
                    key={i}
                    className={`px-3 py-1 text-white rounded ${btn.color}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        btn.action();
                    }}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
}

export default PostActionButtons;