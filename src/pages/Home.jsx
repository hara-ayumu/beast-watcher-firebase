import { useState } from 'react';

import Modal from 'react-modal'
import { Toaster } from 'react-hot-toast';

import MapLoading from '../features/common/components/MapLoading';

import PublicHeader from '../layouts/public/PublicHeader';
import Map from '../features/sightings/public/components/Map';
import AddSightingForm from '../features/sightings/public/components/AddSightingForm';

import { usePublicSightings } from '../features/sightings/public/hooks/usePublicSightings';

/**
 * Home（利用者向けトップページ）
 * - 承認済みの目撃情報を地図上に表示
 * - 地図上で地点を選択し、目撃情報を投稿
 * @returns {JSX.Element}
 */
function Home() {
    const [ selectedLocation, setSelectedLocation ] = useState(null);
    const [ isSightingFormOpen, setIsSightingFormOpen ] = useState(false);

    const { posts: markers, loading, error, loadPosts } = usePublicSightings();

    // 投稿後の仮マーカーを削除してMAP再表示
    const handleUpdate = () => {
        loadPosts();
        setSelectedLocation(null);
        setIsSightingFormOpen(false);
    };

    // 目撃カウンターに表示する文字列
    const counterLabel = (() => {
        if (error) return '取得失敗';
        if (loading) return '読み込み中…';
        if (markers.length === 0) return '目撃情報はまだありません';
        return `目撃数：${markers.length} 件`;
    })();

    return (
        <div className="h-[100dvh] w-screen flex flex-col overflow-hidden">
            {/* 画面上部にトースト通知表示 */}
            <Toaster
                position="top-center"
            />

            {/* 一般ページ用ヘッダー */}
            <PublicHeader />

            <div className="flex flex-1 min-h-0">
                <div className="flex-1 relative pb-[env(safe-area-inset-bottom)]">
                    {/* ローディングオーバーレイ（投稿取得・追加のloading） */}
                    {loading && <MapLoading />}
                    
                    {/* 初回取得、または未取得状態でエラーになった場合は地図をオーバーレイ、再試行ボタンを表示する */}
                    {error && markers.length === 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
                            <div className="text-center p-4">
                                <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded mb-4">
                                    <p>{error}</p>
                                </div>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    onClick={() => loadPosts()}
                                >
                                    再試行
                                </button>
                            </div>
                        </div>
                    )}
                    {/* 既に目撃情報を表示できている状態で再取得に失敗した場合は既存表示を維持したまま再試行ボタンを表示する */}
                    {error && markers.length > 0 && (
                        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
                            <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded mb-2 shadow-lg">
                                <p className="mb-2">{error}</p>
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    onClick={() => loadPosts()}
                                >
                                    再試行
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* GoogleMap */}
                    <Map
                        markers={markers}
                        onMapClick={setSelectedLocation}
                        selectedLocation={selectedLocation}
                    />

                    {/* 投稿数カウンター */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full shadow-md z-20">
                        {counterLabel}
                    </div>
                    
                    {/* 投稿予定地点選択後のみ表示されるボタン */}
                    {selectedLocation && !isSightingFormOpen && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                            <button
                                className="px-6 py-3 bg-orange-500 text-white rounded-full shadow-lg"
                                onClick={() => setIsSightingFormOpen(true)}
                            >
                                この場所の目撃情報を投稿
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 投稿フォームモーダル */}
            <Modal
                isOpen={isSightingFormOpen && !!selectedLocation}
                onRequestClose={() => setIsSightingFormOpen(false)}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-40"
                className="bg-white w-[95%] max-w-md max-h-[90vh] overflow-y-auto rounded-xl p-4 relative outline-none"
            >
                {selectedLocation && (
                    <>
                        <button
                            className="absolute top-2 right-2 text-xl"
                            onClick={() => setIsSightingFormOpen(false)}
                        >
                            ×
                        </button>

                        <div className="mb-3 text-sm text-gray-600">
                            <p className="font-medium">選択地点</p>
                            <p>緯度: {selectedLocation.lat.toFixed(5)}</p>
                            <p>経度: {selectedLocation.lng.toFixed(5)}</p>
                            <button
                                className="text-blue-600 underline mt-1"
                                onClick={() => setIsSightingFormOpen(false)}
                            >
                                地点を変更する
                            </button>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">目撃情報を投稿</h3>

                        <AddSightingForm
                            selectedLocation={selectedLocation}
                            onSubmit={handleUpdate}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
}

export default Home;
