import LoadingBase from '../../../components/LoadingBase';

/**
 * 認証確認中のローディング表示コンポーネント
 * 画面全体に中央配置で表示
 * @param {Object} props
 * @param {string} [props.color='#3b82f6'] - スピナーの色（デフォルト: 青）
 * @returns {JSX.Element}
 */
function AuthLoading({ color = '#3b82f6' }) {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <LoadingBase color={color} />
        </div>
    );
}

export default AuthLoading;
