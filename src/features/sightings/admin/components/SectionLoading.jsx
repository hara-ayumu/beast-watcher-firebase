import ReactLoading from 'react-loading';

/**
 * セクション領域のローディング表示コンポーネント
 * セクション全体を覆うオーバーレイとして表示
 * @param {Object} props
 * @param {string} [props.color='#3b82f6'] スピナーの色
 * @param {string} [props.message='処理中...'] 表示メッセージ
 * @returns {JSX.Element}
 */
function SectionLoading({ color = '#3b82f6', message = '処理中...' }) {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-30">
            <div className="flex flex-col items-center gap-2">
                <ReactLoading type="spin" color={color} height={30} width={30} />
                <div className="text-sm text-gray-600">{message}</div>
            </div>
        </div>
    );
}

export default SectionLoading;
