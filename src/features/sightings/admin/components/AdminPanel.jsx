import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import AdminMap from './AdminMap';
import Tabs from './Tabs';
import DataGrid from './DataGrid';
import PostActionButtons from './PostActionButtons';

import { useAdminSightings } from '../hooks/useAdminSightings';

/**
 * 管理者向け投稿管理パネル
 * - 投稿の一覧表示（ステータス別）
 * - 承認 / 却下操作
 * - 投稿の承認・却下後は一覧テーブルから自動的に削除され、InfoWindowを閉じる
 * @returns {JSX}
 */
function AdminPanel() {

    // 選択中のマーカー(InfoWindow表示用)
    const [ selectedPost, setSelectedPost ] = useState(null);
    const [ mapRef, setMapRef ] = useState(null);
    const [center, setCenter] = useState({ lat: 35.5, lng: 137.8 });

    const [ activeTab, setActiveTab ] = useState('pending');

    const { posts, loading, error, changePostStatus } = useAdminSightings();

    // タブに応じてフィルタ
    const filteredPosts = posts
        .filter((post) => post.status === activeTab)
        .map((post) => ({
            ...post,
            date: post.date ? post.date.toDate().toLocaleString() : '',
        }));

    // タブ切り替え時に InfoWindow を閉じる
    const handleTabChange = (value) => {
        setActiveTab(value);
        setSelectedPost(null);
    }

    // 承認・却下ボタンハンドラ
    const handleApprove = (id) => changePostStatus(id, 'approved');
    const handleReject = (id) => changePostStatus(id, 'rejected');

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
        { key: 'type', label: '種類' },
        { key: 'date', label: '日時' },
        { key: 'lat', label: '緯度' },
        { key: 'lng', label: '経度' },
        { key: 'note', label: '詳細' },
    ]

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (selectedPost && mapRef) {
            const currentCenter = mapRef.getCenter();
            if (currentCenter.lat() !== selectedPost.lat || currentCenter.lng() !== selectedPost.lng) {
                mapRef.panTo({ lat: selectedPost.lat, lng: selectedPost.lng });
                mapRef.setZoom(14);
            }
        }
    }, [selectedPost, mapRef])

    if (loading) return <div>読み込み中...</div>;

    return (
        <div className="flex w-full h-screen">
            {/* 左：Google Map */}
            <div className="w-1/2 h-full border-r">
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
                        { label: '未承認', value: 'pending' },
                        { label: '承認済み', value: 'approved' },
                        { label: '却下済み', value: 'rejected' },
                    ]}
                    activeTab={activeTab}
                    onChange={handleTabChange}
                />

                <div className="flex-1 p-2 overflow-y-auto">
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
    )
}

export default AdminPanel;