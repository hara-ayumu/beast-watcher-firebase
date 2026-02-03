import { useState } from 'react';

import HeaderBase from '../../../common/components/HeaderBase';
import HeaderButtonLink from '../../../common/components/HeaderButtonLink';

import { useAuth } from '../../../auth/hooks/useAuth'

/**
 * 利用者画面ヘッダー
 * - 常時表示の固定ヘッダー
 * - PC：右側にリンク表示
 * - SP：ハンバーガーメニュー
 * @returns {JSX.Element}
 */
function PublicHeader() {
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
    const { user } = useAuth();

    const menuItems = [
        user ? { label: '管理画面へ', href: '/admin' } : { label: 'ログイン', href: '/login' },
    ];

    const rightContent = (
        <>
            {/* PC */}
            <div className="hidden md:flex space-x-4">
                {menuItems.map(item => (
                    <HeaderButtonLink
                        key={item.label}
                        to={item.href}
                        className="px-2 py-1 hover:bg-gray-200 rounded"
                    >
                        {item.label}
                    </HeaderButtonLink>
                ))}
            </div>

            {/* ハンバーガーメニュー */}
            <div className="md:hidden relative">
                <button
                    className="p-2"
                    onClick={() => setIsMenuOpen(prev => !prev)}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-30">
                        {menuItems.map(item => (
                            <HeaderButtonLink
                                key={item.label}
                                to={item.href}
                                className="block px-4 py-2 hover:bg-gray-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </HeaderButtonLink>
                        ))}
                    </div>
                )}
            </div>
        </>
    );

    return (
        <HeaderBase
            title="Beast Watcher"
            right={rightContent}
        />
    );
}

export default PublicHeader;
