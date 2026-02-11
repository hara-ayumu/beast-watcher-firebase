import { useEffect, useState } from 'react'
import { fetchAllSightings, reviewSighting } from '../../services/sightingsService';
import { mapErrorToUiMessage } from '../../../utils/errorMapper';
import { SIGHTING_STATUS } from '../../constants/sightingStatus';

export const useAdminSightings = () => {
    const [ posts, setPosts ] = useState([]);
    const [ initialLoading, setInitialLoading ] = useState(false);
    const [ updating, setUpdating ] = useState(false);
    const [ error, setError ] = useState(null);

    const loadPosts = async () => {
        setInitialLoading(true);
        setError(null);

        try {
            const data = await fetchAllSightings();
            setPosts(data);
        }
        catch (err) {
            setError(mapErrorToUiMessage(err));
        }
        finally {
            setInitialLoading(false);
        }
    };

    /**
     * 投稿レビューを確定する
     * - 却下時はコメント必須のバリデーションを実施
     * - 成功時はローカルの投稿一覧の状態も同期的に更新
     * - UI側で失敗時にトーストを出すことを想定して、成功/失敗で返す
     * @param {string} id - 投稿ID
     * @param {Object} reviewData - レビューデータ
     * @param {'approved'|'rejected'} reviewData.status - 変更後のステータス
     * @param {string} reviewData.reviewComment - レビューコメント（却下時は空でない文字列、承認時は空文字列も可）
     * @param {Object} reviewData.reviewedBy - レビュー実行者情報
     * @param {string} reviewData.reviewedBy.uid - 実行者のUID
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    const submitReview = async (id, reviewData) => {
        const { status, reviewComment, reviewedBy } = reviewData;

        // 却下時のバリデーション
        if (status === SIGHTING_STATUS.REJECTED && !reviewComment?.trim()) {
            return {
                success: false,
                error: '却下理由を入力してください。'
            };
        }

        setUpdating(true);
        setError(null);

        try {
            await reviewSighting(id, {
                status,
                review_comment: reviewComment,
                reviewed_by: reviewedBy.uid,
            });
            setPosts((prev) => 
                prev.map((p) =>
                    p.id === id ? { ...p, status, review_comment: reviewComment  } : p
                )
            );
            return { success: true };
        }
        catch (err) {
            const message = mapErrorToUiMessage(err);
            setError(message);
            return { success: false, error: message };
        }
        finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return {
        posts,
        initialLoading,
        updating,
        error,
        loadPosts,
        submitReview
    };
};
