import { useMemo, useState } from 'react';

import { GoogleMap, Marker , InfoWindow, useJsApiLoader } from '@react-google-maps/api';

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

    const center = useMemo(() => ({ lat: 35.5, lng: 137.8 }), []);
    const [ selectedMarker, setSelectedMarker ] = useState(null);

    if (!isLoaded) return <div>地図を読み込み中...</div>;

    return (
        <>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={center}
                zoom={12}
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
                        icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        }}
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