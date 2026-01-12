/**
 * タブ切り替えUI
 * 管理画面で投稿ステータスを切り替えるために使用
 */
function Tabs({ tabs, activeTab, onChange }) {
    return (
        <div className="flex border-b border-gray-300">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.value;

                return (
                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={`
                            flex-1 text-center px-4 py-2 font-semibold transition-colors border-b-2
                            ${isActive
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    )
}

export default Tabs;