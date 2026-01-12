import { useState, useRef } from 'react';

import { Toaster } from 'react-hot-toast';

import PublicHeader from '../features/sightings/public/components/PublicHeader';
import Map from '../features/sightings/public/components/Map';
import AddSightingForm from '../features/sightings/public/components/AddSightingForm';

import { usePublicSightings } from '../features/sightings/public/hooks/usePublicSightings';

/**
 * Home（利用者向けトップページ）
 * - 承認済みの目撃情報を地図上に表示
 * - 地図上で地点を選択し、目撃情報を投稿
 */
function Home() {
    const [ selectedLocation, setSelectedLocation ] = useState(null);
    const [ sheetOpen, setSheetOpen ] = useState(false);
    // ヘッダー展開状態
    const [ isExpanded, setIsExpanded ] = useState(false);

    // ドラッグハンドルに使用
    const startYRef = useRef(0);
    const draggingRef = useRef(false);

    const { posts: markers, loadPosts } = usePublicSightings();

    // 投稿後の仮マーカーを削除してMAP再表示
    const handleUpdate = () => {
        // fetchMarkers();
        loadPosts();
        setSelectedLocation(null);
        setSheetOpen(false);
    }

    // ボトムシートドラッグ処理
    const touchHandlers = {
        start: (e) => {
            startYRef.current = e.touches[0].clientY;
            draggingRef.current = true;
        },
        move: (e) => {
            if (!draggingRef.current) return;
            const currentY = e.touches[0].clientY;
            if (currentY - startYRef.current > 30) {
                setSheetOpen(false);
                draggingRef.current = false;
            }
        },
        end: () => {
            draggingRef.current = false;
        }
    }

    return (
        <div className="flex h-screen w-screen">
            {/* 画面上部にトースト通知表示 */}
            <Toaster
                position="top-center"
            />

            {/* 一般ページ用ヘッダー */}
            <div
                className={`
                    absolute z-20 transition-all duration-300
                    ${isExpanded
                        ? 'top-0 left-0 w-full'
                        : 'top-4 left-4'
                    }
                `}
            >
                <PublicHeader
                    expanded={isExpanded}
                    onToggle={() => setIsExpanded(prev => !prev)}
                /> 
            </div>

            {/* <h1>クマ・サル目撃マップ</h1> */}
            <div className="flex-1 relative">
                {/* GoogleMap */}
                <Map
                    markers={markers}
                    onMapClick={setSelectedLocation}
                    selectedLocation={selectedLocation}
                />
                
                {/* スマホ：＋ボタン */}
                <button
                    className="absolute bottom-5 right-15 w-14 h-14 rounded-full bg-orange-500 text-white text-2xl flex items-center justify-center shadow-lg md:hidden"
                    onClick={() => setSheetOpen(true)}
                >
                    ＋
                </button>

                {/* スマホ：Bottom Sheet */}
                <div
                    className={`fixed left-0 bottom-0 w-full bg-white p-4 shadow-xl rounded-t-2xl transition-transform duration-300 z-20 md:hidden ${
                        sheetOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    style={{ maxHeight: '60vh', overflowY: 'auto' }}
                >
                    {/* ドラッグハンドル */}
                    <div
                        className="w-10 h-1.5 bg-gray-400 rounded mx-auto mb-2"
                        onTouchStart={touchHandlers.start}
                        onTouchMove={touchHandlers.move}
                        onTouchEnd={touchHandlers.end}
                    ></div>

                    {/* ヘッダー */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">目撃情報を投稿</h3>
                        <button
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 text-2x1 shadow"
                            onClick={() => setSheetOpen(false)}
                        >
                            ×
                        </button>
                    </div>
                    <AddSightingForm
                        selectedLocation={selectedLocation}
                        onSubmit={handleUpdate}
                    />
                </div>
            </div>

            {/* PC：右側サイドフォーム */}
            <div className="hidden md:block w-80 bg-white p-4 border-l h-full overflow-auto">
                <h3 className="text-lg font-semibold mb-4">目撃情報を投稿</h3>
                <AddSightingForm
                    selectedLocation={selectedLocation}
                    onSubmit={handleUpdate}
                />
            </div>
        </div>
    )
}

export default Home;
