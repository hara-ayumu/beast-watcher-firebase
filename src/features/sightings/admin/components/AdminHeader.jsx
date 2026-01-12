import { useNavigate } from 'react-router-dom';

import { signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { auth } from '../../../auth/firebase';
import HeaderBase from '../../../common/components/HeaderBase';

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
            right={<button onClick={handleLogout}>ログアウト</button>}
        />
    )
}

export default AdminHeader;