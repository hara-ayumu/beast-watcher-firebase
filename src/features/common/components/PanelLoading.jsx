import ReactLoading from 'react-loading';

/**
 * パネル領域のローディング表示コンポーネント
 * パネル全体を覆うオーバーレイとして表示
 * ヘッダーなど固定要素は表示したまま、パネル領域のみをローディング表示
 * @param {Object} props
 * @param {string} [props.color='#3b82f6'] スピナーの色
 * @returns {JSX.Element}
 */
function PanelLoading({ color = '#3b82f6' }) {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-40">
            <ReactLoading type="spin" color={color} height={50} width={50} />
        </div>
    );
}

export default PanelLoading;
