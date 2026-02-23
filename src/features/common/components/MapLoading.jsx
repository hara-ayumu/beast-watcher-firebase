import LoadingBase from '../../../components/LoadingBase';

/**
 * 地図のローディング表示コンポーネント
 * 地図コンテナ内に表示されるオーバーレイ
 * @param {Object} props
 * @param {string} [props.color='#3b82f6'] - スピナーの色（デフォルト: 青）
 * @returns {JSX.Element}
 */
function MapLoading({ color = '#3b82f6' }) {
    return (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center z-10">
            <LoadingBase color={color} />
        </div>
    );
}

export default MapLoading;
