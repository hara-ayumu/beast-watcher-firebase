import ReactLoading from 'react-loading';

/**
 * 認証確認中のローディング表示コンポーネント
 * 画面全体に中央配置で表示
 * @param {string} color - スピナーの色（デフォルト: 青）
 * @returns {JSX.Elements}
 */
function AuthLoading({ color = '#3b82f6' }) {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <ReactLoading type="spin" color={color} height={50} width={50} />
        </div>
    );
}

export default AuthLoading;
