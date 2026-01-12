import { Toaster } from 'react-hot-toast';

import AdminHeader from '../features/sightings/admin/components/AdminHeader';
import AdminPanel from '../features/sightings/admin/components/AdminPanel';
/**
 * Admin（管理者向けトップページ）
 * - 投稿一覧表示
 * - Google Map 上での投稿の確認
 * - 投稿ステータスの承認/却下
 */
function Admin() {
    return (
        <>
            <Toaster />
            <AdminHeader />
            <AdminPanel />
        </>
    );
}

export default Admin;