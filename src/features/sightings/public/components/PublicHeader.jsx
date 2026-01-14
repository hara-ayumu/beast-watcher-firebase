import { useState } from 'react';

import HeaderBase from '../../../common/components/HeaderBase';
import HeaderButtonLink from '../../../common/components/HeaderButtonLink';

import { useAuth } from '../../../auth/hooks/useAuth'

function PublicHeader({ expanded, onToggle }) {
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
                    onClick={(e) => {
                        e.stopPropagation(); // ヘッダー展開トグルを防ぐ
                        setIsMenuOpen(prev => !prev);
                    }}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-20">
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
        <div
            onClick={onToggle}
            className={`
                transition-all duration-300 bg-white shadow-lg
                ${expanded
                    ? 'w-full'
                    : 'w-14 h-14 rounded-lg flex items-center justify-center'
                }
            `}
        >
            {/* 展開時：通常ヘッダー */}
            {expanded ? (
                <HeaderBase
                    title="Beast Watcher"
                    right={rightContent}
                />
            ) : (
                /* 最小化時：コンパクトUI */
                <div className="flex flex-col items-center justify-center text-sm font-semibold">
                    <span>BW</span>
                    <span className="text-lg leading-none">☰</span>
                </div>
            )}
        </div>
    );
}

export default PublicHeader;