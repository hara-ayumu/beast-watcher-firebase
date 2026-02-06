import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import PanelLoading from '../../../common/components/PanelLoading';
import SectionLoading from './SectionLoading';
import AdminMap from './AdminMap';
import Tabs from './Tabs';
import DataGrid from './DataGrid';
import PostActionButtons from './PostActionButtons';

import { useAdminSightings } from '../hooks/useAdminSightings';
import { DEFAULT_MAP_CENTER } from '../../constants/mapConstants';
import { SIGHTING_STATUS } from '../../constants/sightingStatus';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { ERROR_CODES } from '../../constants/errorCodes';

/**
 * 管理者用投稿管理パネル
 * - 投稿の一覧表示（ステータス別）
 * - 承認 / 却下操作
 * - 投稿の承認・却下後は一覧テーブルから自動的に削除され、InfoWindowを閉じる
 * @returns {JSX.Element}
 */
function AdminSightingPanel() {

    // 選択中のマーカー(InfoWindow表示用)
    const [ selectedPost, setSelectedPost ] = useState(null);
    const [ mapRef, setMapRef ] = useState(null);
    const [ center, setCenter ] = useState(DEFAULT_MAP_CENTER);

    const [ activeTab, setActiveTab ] = useState(SIGHTING_STATUS.PENDING);

    const { posts, initialLoading, updating, error, loadPosts, changePostStatus } = useAdminSightings();

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
     * 投稿ステータスを変更する共通関数
     * @param {string} id - 投稿の一意のID 
     * @param {Object} params - ステータス変更に関するパラメータ
     * @param {string} params.status - 新しいステータス（承認、却下など）
     * @param {string} params.successMessage - ステータス変更成功時に表示するメッセージ
     * @returns {Promise<void>}
     */
    const handleChangePostStatus = async (id, { status, successMessage }) => {
        const res = await changePostStatus(id, status);
        // 投稿ステータス変更に失敗した場合トーストでエラーを表示
        if (!res.success) {
            // 複数回同じ操作をした場合に毎回エラーメッセージが出るようにユニークIDを付与
            toast.error(res.error || ERROR_MESSAGES[ERROR_CODES.UPDATE_SIGHTING_STATUS_FAILED], { id: `admin-action-error-${Date.now()}` });
        }
        else {
            toast.success(successMessage);
        }
    };

    // 承認・却下ボタンハンドラ
    const handleApprove = (id) => handleChangePostStatus(id, {
        status: SIGHTING_STATUS.APPROVED,
        successMessage: '承認しました。',
    });
    const handleReject = (id) => handleChangePostStatus(id, {
        status: SIGHTING_STATUS.REJECTED,
        successMessage: '却下しました。',
    });

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
                    onApprove={handleApprove}
                    onReject={handleReject}
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
                                onApprove={() => handleApprove(row.id)}
                                onReject={() => handleReject(row.id)}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminSightingPanel;
