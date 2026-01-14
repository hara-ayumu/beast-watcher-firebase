import { useNavigate } from 'react-router-dom';

import { signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { auth } from '../../../auth/firebase';
import HeaderBase from '../../../common/components/HeaderBase';
import HeaderButtonLink from '../../../common/components/HeaderButtonLink';

/**
 * 管理者ヘッダー
 * 
 * ログアウトボタン付き
 * @returns {JSX} ヘッダー
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
            title="管理者パネル"
            right={<HeaderButtonLink className="px-2 py-1 hover:bg-gray-200 rounded" onClick={handleLogout}>ログアウト</HeaderButtonLink>}
        />
    )
}

export default AdminHeader;