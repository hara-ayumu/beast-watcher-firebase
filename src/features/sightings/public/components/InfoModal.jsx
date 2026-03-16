import Modal from 'react-modal';

import TermsContent from './TermsContent';
import PostingGuideContent from './PostingGuideContent';

const MODAL_CONFIG = {
    terms: { title: '利用規約', content: <TermsContent /> },
    postingGuide: { title: '投稿方法', content: <PostingGuideContent /> },
};

/**
 * 利用者向けの各種情報（利用規約など）を表示する共通モーダル
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの表示状態
 * @param {() => void} props.onClose - 閉じる操作時に呼ばれるコールバック
 * @param {'terms'|'postingGuide'} props.mode - 表示するコンテンツの種類
 * @param {boolean} [props.requiresAgreement=false] - true のとき、同意操作が完了するまで閉じる操作を制限する
 * @returns {JSX.Element | null}
 */
function InfoModal ({ isOpen, onClose, mode, requiresAgreement = false }) {
    const { title, content } = MODAL_CONFIG[mode] ?? {};
    if (!title) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            // 初回アクセス時は利用規約への同意を促すためオーバーレイクリックで閉じない
            shouldCloseOnOverlayClick={!requiresAgreement}
            shouldCloseOnEsc={!requiresAgreement}
            ariaHideApp={false}
            className="bg-white rounded-lg shadow-xl w-[90%] max-w-md flex flex-col max-h-[80vh] relative outline-none"
            overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div className="p-4 border-b font-bold text-base flex-shrink-0">
                <h2 className="text-lg font-bold">{title}</h2>
                {!requiresAgreement && (
                    <button
                        className="absolute top-2 right-2 text-xl text-gray-400 hover:text-gray-600"
                        aria-label="閉じる"
                        onClick={onClose}
                    >
                        ×
                    </button>
                )}
            </div>

            <div className="p-4 overflow-y-auto flex-1 text-sm text-gray-700">
                {content}
            </div>

            <div className="p-4 border-t flex justify-end flex-shrink-0">
                <button
                    className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                    onClick={onClose}
                >
                    {requiresAgreement ? '同意する' : '閉じる'}
                </button>
            </div>
        </Modal>
    );
}

export default InfoModal;
