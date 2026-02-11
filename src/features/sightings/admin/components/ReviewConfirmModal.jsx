import { useState } from 'react';

import Modal from 'react-modal';

import { SIGHTING_STATUS } from '../../constants/sightingStatus';

/**
 * 投稿レビュー確認モーダル
 * - 投稿内容を確認し、承認または却下を確定する
 * - 却下時はレビューコメントの入力必須
 * @param {boolean} isOpen - モーダルの表示状態
 * @param {Object} post - レビュー対象の投稿
 * @param {'approved'|'rejected'} nextStatus - 変更予定のステータス
 * @param {(review: {status: 'approved'|'rejected', reviewComment: string}) => Promise<void>} onSubmit - 確定時のコールバック
 * @param {() => void} onCancel - キャンセル時のコールバック
 * @returns {JSX.Element}
 */
function ReviewConfirmModal({ isOpen, post, nextStatus, onSubmit, onCancel }) {
    const [ reviewComment, setReviewComment ] = useState('');

    if (!post) return null;

    const isReject = nextStatus === SIGHTING_STATUS.REJECTED;

    const handleSubmit = () => {
        onSubmit({
            status: nextStatus,
            reviewComment,
        });
        setReviewComment('');
    }

    const handleCancel = () => {
        setReviewComment('');
        onCancel();
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCancel}
            ariaHideApp={false}
            className="bg-white p-4 rounded shadow max-w-md mx-auto mt-40"
            overlayClassName="fixed inset-0 bg-black/40 z-40"
        >
            <h2 className="text-lg font-bold mb-2">
                {isReject ? '却下の確認' : '承認の確認'}
            </h2>

            <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                    <strong>種類:</strong> {post.animal_type}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                    <strong>目撃日時:</strong> {post.sighted_at}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                    <strong>緯度:</strong> {post.lat}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                    <strong>経度:</strong> {post.lng}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                    <strong>詳細:</strong> {post.note}
                </p>
            </div>

            <textarea
                className="w-full border rounded p-2 mb-3"
                rows={4}
                placeholder={isReject ? '却下理由を入力してください（必須）' : '承認理由（任意）'}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
            />

            <div className="flex justify-end gap-2">
                <button
                    className="px-3 py-1 bg-gray-300 rounded"
                    onClick={handleCancel}
                >
                    キャンセル
                </button>
                <button
                    className={`px-3 py-1 text-white rounded ${
                        isReject ? 'bg-red-500 hover:bg-red-600 disabled:bg-red-300' : 'bg-green-500 hover:bg-green-600'
                    }`}
                    disabled={isReject && !reviewComment.trim()}
                    onClick={handleSubmit}
                >
                    確定
                </button>
            </div>
        </Modal>
    );
}

export default ReviewConfirmModal;
