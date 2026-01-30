import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

import MapLoading from '../../../common/components/MapLoading';
import PostActionButtons from './PostActionButtons';

import { ADMIN_MAP_INITIAL_ZOOM } from '../../constants/mapConstants';
import { STATUS_MARKER_ICONS } from '../../constants/markerIcons';

/**
 * 管理者画面用マップコンポーネント
 * - 投稿データをマーカーで表示
 * - マーカー選択で InfoWindow 表示
 * - InfoWindow 内で承認/却下が可能
 * - Map の中心(center)や参照(mapRef)を親コンポーネントと同期
 * @param {{ id: string, date: string, lat: number, lng: number, note: string, status: string, type: string }[]} posts - 投稿データ一覧
 * @param {{ id: string, date: string, lat: number, lng: number, note: string, status: string, type: string } | null} selectedPost - 選択中の投稿
 * @param {(post: Object | null) => void} setSelectedPost - 選択投稿を更新する関数
 * @param {(id: string) => void} onApprove - 投稿承認ハンドラ
 * @param {(id: string) => void} onReject - 投稿却下ハンドラ
 * @param {google.maps.Map | null} mapRef - GoogleMap インスタンス
 * @param {(map: google.maps.Map) => void} setMapRef - GoogleMap インスタンスをセットする関数
 * @param {{ lat: number, lng: number }} center - 地図中心
 * @param {(center: { lat: number, lng: number }) => void} setCenter - 地図中心を更新する関数
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

    return(
        <div className="relative w-full h-full">
            {/* 地図読み込み中のオーバーレイ */}
            {!isLoaded && <MapLoading />}
            
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={center}
                    zoom={ADMIN_MAP_INITIAL_ZOOM}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                        gestureHandling: 'greedy',
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
                            icon={{ url: STATUS_MARKER_ICONS[post.status] }}
                            title={post.type}
                            onClick={() => setSelectedPost(post)}
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
            )}
        </div>
    );
}

export default AdminMap;
