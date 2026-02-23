import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import PanelLoading from '../../../common/components/PanelLoading';
import SectionLoading from '../../../common/components/SectionLoading';
import AdminMap from './AdminMap';
import Tabs from '../../../../components/Tabs';
import DataGrid from '../../../../components/DataGrid';
import PostActionButtons from './PostActionButtons';
import ReviewConfirmModal from './ReviewConfirmModal';

import { useAdminSightings } from '../hooks/useAdminSightings';
import { useAuth } from '../../../auth/hooks/useAuth';
import { DEFAULT_MAP_CENTER } from '../../constants/mapConstants';
import { SIGHTING_STATUS } from '../../constants/sightingStatus';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { ERROR_CODES } from '../../constants/errorCodes';

/**
 * 管理者用投稿管理パネル
 * - 投稿の一覧表示（ステータス別）
 * - 承認 / 却下のレビュー操作
 * - 投稿の承認・却下後は一覧テーブルおよび地図のマーカーを更新する
 * @returns {JSX.Element}
 */
function AdminSightingPanel() {

    // 選択中のマーカー(InfoWindow表示用)
    const [ selectedPost, setSelectedPost ] = useState(null);
    const [ mapRef, setMapRef ] = useState(null);
    const [ center, setCenter ] = useState(DEFAULT_MAP_CENTER);

    const [ activeTab, setActiveTab ] = useState(SIGHTING_STATUS.PENDING);
    
    const [ reviewPost, setReviewPost ] = useState(null);
    const [ nextStatus, setNextStatus ] = useState(null);
    const [ isReviewModalOpen, setIsReviewModalOpen ] = useState(false);

    const { posts, initialLoading, updating, error, loadPosts, submitReview } = useAdminSightings();
    const { user } = useAuth();

    // タブに応じてフィルタ
    const filteredPosts = posts
        .filter((post) => post.status === activeTab)
        .map((post) => ({
            ...post,
            sighted_at: post.sighted_at ? post.sighted_at.toDate().toLocaleString() : '',
        }));

    // タブ切り替え時に InfoWindow を閉じる
    const handleTabChange = (value) => {
        setActiveTab(value);
        setSelectedPost(null);
    };

    /**
     * レビュー確定時の処理を行う
     * - 投稿ステータスを更新し、レビューを記録する
     * - 成功/失敗に応じてトーストで通知
     * - 処理完了後にレビュー用モーダルを閉じる
     * @param {Object} params - レビュー情報
     * @param {'approved'|'rejected'} params.status - 変更後のステータス
     * @param {string} params.reviewComment - レビューコメント（却下時は空でない文字列、承認時は空文字列も可）
     * @returns {Promise<void>}
     */
    const handleSubmitReview = async ({ status, reviewComment }) => {
        const res = await submitReview(reviewPost.id, {
            status,
            reviewComment,
            reviewedBy: user,
        });
        // 投稿ステータス変更に失敗した場合トーストでエラーを表示
        if (!res.success) {
            // 複数回同じ操作をした場合に毎回エラーメッセージが出るようにユニークIDを付与
            toast.error(res.error || ERROR_MESSAGES[ERROR_CODES.REVIEW_SIGHTING_FAILED], { id: `admin-action-error-${Date.now()}` });
        }
        else {
            toast.success(status === SIGHTING_STATUS.APPROVED ? '承認しました。' : '却下しました。');
        }

        setReviewPost(null);
        setNextStatus(null);
        setIsReviewModalOpen(false);
    };

    const openReviewModal = (post, status) => {
        setReviewPost(post);
        setNextStatus(status);
        setIsReviewModalOpen(true)
    };

    /**
     * 投稿を選択し、地図中心を該当座標に移動
     * @param {object} post - 選択された投稿データ
     * @param {number} post.lat - 緯度
     * @param {number} post.lng - 経度
     */
    const handleSelectMarker = (post) => {
        setSelectedPost(post);
        // 投稿位置に地図を移動
        setCenter({ lat: post.lat, lng: post.lng });
    };

    // DataGridに渡すカラム
    const columns = [
        { key: 'animal_type', label: '種類' },
        { key: 'sighted_at', label: '目撃日時' },
        { key: 'note', label: '詳細' },
        { key: 'review_comment', label: '判定理由' },
    ];

    useEffect(() => {
        // 承認・却下により、選択中の投稿が表示中の投稿一覧から外れた場合はInfoWindowを閉じる
        if (selectedPost && !filteredPosts.some(post => post.id === selectedPost.id)) {
            setSelectedPost(null);
        }
    }, [filteredPosts, selectedPost]);

    useEffect(() => {
        // 投稿選択時、地図の表示位置が選択した投稿の座標と異なる場合は地図の中心を移動する
        if (selectedPost && mapRef) {
            const currentCenter = mapRef.getCenter();
            if (currentCenter.lat() !== selectedPost.lat || currentCenter.lng() !== selectedPost.lng) {
                mapRef.panTo({ lat: selectedPost.lat, lng: selectedPost.lng });
                mapRef.setZoom(14);
            }
        }
    }, [selectedPost, mapRef]);

    return (
        <div className="flex w-full flex-1 min-h-0 relative">
            {/* 初回ロード時のローディングオーバーレイ（パネル全体） */}
            {initialLoading && <PanelLoading />}
            
            {/* 初回取得、または未取得状態でエラーになった場合は地図をオーバーレイ、再試行ボタンを表示する */}
            {error && posts.length === 0 && (
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
            {error && posts.length > 0 && (
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded shadow-lg">
                        <p className="mb-2">{error}</p>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            onClick={() => loadPosts()}
                        >
                            再読み込み
                        </button>
                    </div>
                </div>
            )}

            {/* 左：Google Map */}
            <div className="w-1/2 h-full border-r relative">
                {/* 投稿ステータス更新中のローディング（AdminMap領域のみ） */}
                {updating && <SectionLoading message="更新中..." />}
                <AdminMap
                    posts={filteredPosts}
                    selectedPost={selectedPost}
                    setSelectedPost={setSelectedPost}
                    onApprove={(post) => openReviewModal(post, SIGHTING_STATUS.APPROVED)}
                    onReject={(post) => openReviewModal(post, SIGHTING_STATUS.REJECTED)}
                    mapRef={mapRef}
                    setMapRef={setMapRef}
                    center={center}
                    setCenter={setCenter}
                />
            </div>

            {/* 右：タブ + リスト */}
            <div className="w-1/2 h-full flex flex-col">
                <Tabs
                    tabs={[
                        { label: '未承認', value: SIGHTING_STATUS.PENDING },
                        { label: '承認済み', value: SIGHTING_STATUS.APPROVED },
                        { label: '却下済み', value: SIGHTING_STATUS.REJECTED },
                    ]}
                    activeTab={activeTab}
                    onChange={handleTabChange}
                />

                <div className="flex-1 p-2 relative min-h-0">
                    {/* 投稿ステータス更新中のローディング（DataGrid領域のみ） */}
                    {updating && <SectionLoading message="更新中..." />}
                    <DataGrid
                        columns={columns}
                        data={filteredPosts}
                        zebra={true}
                        onRowClick={handleSelectMarker} // Map連動
                        rowActions={(row) => (
                            <PostActionButtons
                                status={row.status}
                                onApprove={() => openReviewModal(row, SIGHTING_STATUS.APPROVED)}
                                onReject={() => openReviewModal(row, SIGHTING_STATUS.REJECTED)}
                            />
                        )}
                    />
                </div>
            </div>

            <ReviewConfirmModal
                isOpen={isReviewModalOpen}
                post={reviewPost}
                nextStatus={nextStatus}
                onSubmit={handleSubmitReview}
                onCancel={() => {
                    setReviewPost(null);
                    setNextStatus(null);
                    setIsReviewModalOpen(false);
                }}
            />
        </div>
    );
}

export default AdminSightingPanel;
