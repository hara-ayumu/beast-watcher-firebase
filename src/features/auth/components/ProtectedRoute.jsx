import { Navigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth'
import AuthLoading from '../../common/components/AuthLoading';

function ProtectedRoute({ children }) {
    const { user, authReady } = useAuth();

    /**
     * Firebase Authはページリロード時に非同期で認証状態を復元するため、
     * 状態確定前にリダイレクトが発生しないよう待機する
     */
    if (!authReady) return <AuthLoading />;

    // 未ログインならログイン画面へ
    if (!user) return <Navigate to="/login" />

    // ログイン済みなら管理画面を表示
    return children;
}

export default ProtectedRoute;
