import ReactLoading from 'react-loading';

/**
 * ページ全体のローディング表示コンポーネント
 * ページ全体を覆うオーバーレイとして表示
 * @param {string} color - スピナーの色（デフォルト: 青）
 * @returns {JSX.Elements} 
 */
function PageLoading({ color = '#3b82f6' }) {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
            <ReactLoading type="spin" color={color} height={50} width={50} />
        </div>
    );
}

export default PageLoading;
