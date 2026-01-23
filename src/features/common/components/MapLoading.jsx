import ReactLoading from 'react-loading';

/**
 * 地図のローディング表示コンポーネント
 * 地図コンテナ内に表示されるオーバーレイ
 * @param {string} color - スピナーの色（デフォルト: 青） 
 * @returns {JSX.Elements} 
 */
function MapLoading({ color = '#3b82f6' }) {
    return (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center z-10">
            <ReactLoading type="spin" color={color} height={50} width={50} />
        </div>
    );
}

export default MapLoading;
