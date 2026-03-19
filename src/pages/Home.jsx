import { useEffect, useState } from 'react';

import { Toaster } from 'react-hot-toast';

import MapLoading from '../features/common/components/MapLoading';

import PublicHeader from '../layouts/public/PublicHeader';
import Map from '../features/sightings/public/components/Map';
import AddSightingModal from '../features/sightings/public/components/AddSightingModal';
import InfoModal from '../features/sightings/public/components/InfoModal';

import { usePublicSightings } from '../features/sightings/public/hooks/usePublicSightings';

const TERMS_AGREED_KEY = 'bw_terms_agreed';

/**
 * Home（利用者向けトップページ）
 * - 承認済みの目撃情報を地図上に表示
 * - 地図上で地点を選択し、目撃情報を投稿
 * - 利用規約・投稿方法モーダルの表示を管理
 * @returns {JSX.Element}
 */
function Home() {
    const [ selectedLocation, setSelectedLocation ] = useState(null);
    const [ isSightingFormOpen, setIsSightingFormOpen ] = useState(false);

    const [ isTermsModalOpen, setIsTermsModalOpen ] = useState(false);
    const [ isPostingGuideModalOpen, setIsPostingGuideModalOpen ] = useState(false);
    const [ isFirstVisit, setIsFirstVisit ] = useState(false);

    const { posts: markers, loading, error, loadPosts } = usePublicSightings();

    // 初回アクセス時、利用規約に未同意の場合はモーダルを表示して同意を促す
    useEffect(() => {
        const agreed = sessionStorage.getItem(TERMS_AGREED_KEY);
        if (!agreed) {
            setIsFirstVisit(true);
            setIsTermsModalOpen(true);
        }
    }, []);

    const handleTermsClose = () => {
        if (isFirstVisit) {
            sessionStorage.setItem(TERMS_AGREED_KEY, 'true');
            setIsFirstVisit(false);
        }
        setIsTermsModalOpen(false);
    };

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
            <PublicHeader
                onTermsOpen={() => setIsTermsModalOpen(true)}
                onPostingGuideOpen={() => setIsPostingGuideModalOpen(true)}
            />

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
            <AddSightingModal
                isOpen={isSightingFormOpen}
                onClose={() => setIsSightingFormOpen(false)}
                selectedLocation={selectedLocation}
                onSubmit={handleUpdate}
            />

            <InfoModal
                isOpen={isTermsModalOpen}
                onClose={handleTermsClose}
                mode="terms"
                requiresAgreement={isFirstVisit}
            />

            <InfoModal
                isOpen={isPostingGuideModalOpen}
                onClose={() => setIsPostingGuideModalOpen(false)}
                mode="postingGuide"
            />
        </div>
    );
}

export default Home;
