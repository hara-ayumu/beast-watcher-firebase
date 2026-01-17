import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

import PostActionButtons from './PostActionButtons';

import { ADMIN_MAP_INITIAL_ZOOM } from '../../constants/mapConstants';
import { SIGHTING_STATUS } from '../../constants/sightingStatus';

/**
 * 管理者向けマップコンポーネント
 * - 投稿データをマーカーで表示
 * - マーカー選択で InfoWindow 表示
 * - InfoWindow 内で承認/却下が可能
 * - Map の中心(center)や参照(mapRef)を親コンポーネントと同期
 * @param {Array} posts - 投稿データ一覧
 * @param {Object} selectedPost - 選択中の投稿
 * @param {Function} setSelectedPost - 選択投稿を更新
 * @param {Function} onApprove - 投稿承認ハンドラ
 * @param {Function} onReject - 投稿却下ハンドラ
 * @param {Object} mapRef - GoogleMap インスタンス
 * @param {Function} setMapRef - GoogleMap インスタンスをセット
 * @param {Object} center - 地図中心
 * @param {Function} setCenter - 地図中心を更新
 * @returns {JSX.Element}
 */
function AdminMap({posts, selectedPost, setSelectedPost, onApprove, onReject, mapRef, setMapRef, center, setCenter}) {
    const { isLoaded } = useJsApiLoader({
            googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            language: 'ja',
            googleMapsClientOptions: {
                version: 'quarterly',
            },
    });

    if (!isLoaded) return <div>地図を読み込み中...</div>;

    return(
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={ADMIN_MAP_INITIAL_ZOOM}
            options={{
                disableDefaultUI: true,
                zoomControl: true,
            }}
            onLoad={(map) => setMapRef(map)}
            onDragEnd={() => {
                const newCenter = mapRef.getCenter();
                setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
            }}
        >
            {posts.map((post) => (
                <Marker
                    key={post.id}
                    position={{ lat: post.lat, lng: post.lng }}
                    title={post.type}
                    onClick={() => setSelectedPost(post)}
                    icon={{
                        url:
                            post.status === SIGHTING_STATUS.APPROVED
                                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                : post.status === SIGHTING_STATUS.REJECTED
                                ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                        }}
                />
            ))}

            {selectedPost && (
                <InfoWindow
                    position={{ lat: selectedPost.lat, lng: selectedPost.lng }}
                    onCloseClick={() => setSelectedPost(null)}
                >
                    <div style={{ maxWidth: '200px' }}>
                        <h3>{selectedPost.type} の目撃</h3>
                        <p><strong>日時:</strong><br />{selectedPost.date}</p>
                        <p><strong>詳細:</strong><br />{selectedPost.note}</p>
                        <PostActionButtons
                            status={selectedPost.status}
                            onApprove={() => onApprove(selectedPost.id)}
                            onReject={() => onReject(selectedPost.id)}
                        />
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}

export default AdminMap;