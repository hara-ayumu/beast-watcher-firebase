import ReactLoading from 'react-loading';

/**
 * ローディング系コンポーネントの共通部品
 * @param {Object} props
 * @param {string} [props.color='#3b82f6'] - スピナーの色（デフォルト: 青）
 * @param {number} [props.size=50] - スピナーのサイズ
 * @returns {JSX.Element}
 */
function LoadingBase({ color = '#3b82f6', size = 50 }) {
    return (
        <ReactLoading type="spin" color={color} height={size} width={size} />
    );
}

export default LoadingBase;
