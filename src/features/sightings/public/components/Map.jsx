import { useState } from 'react';

import { GoogleMap, Marker , InfoWindow, useJsApiLoader } from '@react-google-maps/api';

import { DEFAULT_MAP_CENTER, PUBLIC_MAP_INITIAL_ZOOM } from '../../constants/mapConstants';
import { POST_PLAN_POINT_MARKER_ICON } from '../../constants/markerIcons';

/**
 * Google Mapを表示するコンポーネント
 * @param props 
 * @returns {JSX}
 */
function Map({ markers, onMapClick, selectedLocation }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        language: 'ja',
        googleMapsClientOptions: {
            version: 'quarterly',
        },
    });

    const [ selectedMarker, setSelectedMarker ] = useState(null);

    if (!isLoaded) return <div>地図を読み込み中...</div>;

    return (
        <>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={DEFAULT_MAP_CENTER}
                zoom={PUBLIC_MAP_INITIAL_ZOOM}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
                onClick={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    onMapClick({ lat, lng });
                }}
            >
                {/* 見慣れたGoogleMap標準マーカーを使用するためicon指定なし */}
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        title={marker.type}
                        onClick={() => setSelectedMarker(marker)}
                    />
                ))}
                {/* 投稿のための仮マーカー */}
                {selectedLocation && (
                    <Marker
                        position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                        icon={{ url: POST_PLAN_POINT_MARKER_ICON }}
                        title="投稿予定地点"
                    />
                )}

                {selectedMarker && (
                    <InfoWindow
                        position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div style={{ maxWidth: '200px' }}>
                            <h3>{selectedMarker.type} の目撃</h3>
                            <p><strong>日時:</strong><br />{selectedMarker.date?.toDate().toLocaleString()}</p>
                            <p><strong>詳細:</strong><br />{selectedMarker.note}</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </>
    );
}

export default Map;