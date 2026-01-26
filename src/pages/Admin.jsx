import { Toaster } from 'react-hot-toast';

import AdminHeader from '../features/sightings/admin/components/AdminHeader';
import AdminSightingPanel from '../features/sightings/admin/components/AdminSightingPanel';
/**
 * Admin（管理者向けトップページ）
 * - 投稿一覧表示
 * - Google Map 上での投稿の確認
 * - 投稿ステータスの承認/却下
 * @returns {JSX.Element}
 */
function Admin() {
    return (
        <>
            <Toaster />
            <AdminHeader />
            <AdminSightingPanel />
        </>
    );
}

export default Admin;
