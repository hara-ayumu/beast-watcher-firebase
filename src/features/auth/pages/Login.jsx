import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../firebase';

function Login() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin');
        }
        catch (err) {
            setError('ログイン失敗： ' + err.message);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
            {/* カード */}
            <div className="bg-white shadow-lg rounded-lg w-full max-w-sm p-8">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Beast Watcher</h1>
                <p className="text-gray-500 text-sm text-center mb-6">管理者ログイン</p>

                {/* エラーメッセージ */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 text-sm">
                        メールアドレスまたはパスワードが間違っています。
                    </div>
                )}

                <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
                    {/* メールアドレス */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm mb-1">メールアドレス</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="メールアドレス" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {/* パスワード */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm mb-1">パスワード</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            placeholder="パスワード"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                        <button type="submit" className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors">ログイン</button>
                </form>
                <div className="text-center text-gray-400 text-xs mt-6">&copy; 2025 Hara Ayumu</div>
            </div>
        </div>
    );
}

export default Login;