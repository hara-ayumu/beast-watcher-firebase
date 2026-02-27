import { useNavigate } from 'react-router-dom';

import { signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { auth } from '../../features/auth/firebase';
import HeaderBase from '../HeaderBase';
import HeaderButtonLink from '../HeaderButtonLink';

/**
 * 管理者画面ヘッダー
 * - 常時表示の固定ヘッダー
 * - 利用者画面へのリンクと、ログアウトボタンを表示
 * @returns {JSX.Element}
 */
function AdminHeader() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        }
        catch (err) {
            if (err instanceof FirebaseError) {
                console.log(err);
            }
        }
    };

    return (
        <HeaderBase
            title="Beast Watcher 管理パネル"
            right={
                <div className="flex items-center gap-4">
                    <HeaderButtonLink to="/" className="px-2 py-1 hover:bg-gray-200 rounded">利用者画面へ</HeaderButtonLink>
                    <HeaderButtonLink className="px-2 py-1 hover:bg-gray-200 rounded" onClick={handleLogout}>ログアウト</HeaderButtonLink>
                </div>
            }
        />
    );
}

export default AdminHeader;
