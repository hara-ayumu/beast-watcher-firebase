import { useEffect, useState } from 'react'
import { fetchAllSightings, updateSightingStatus } from '../../services/sightingsService';
import { mapErrorToUiMessage } from '../../../utils/errorMapper';

export const useAdminSightings = () => {
    const [ posts, setPosts ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const loadPosts = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchAllSightings();
            setPosts(data);
        }
        catch (err) {
            setError(mapErrorToUiMessage(err));
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 投稿ステータスを更新する
     * UI側で失敗時にトーストを出すことを想定して、成功/失敗で返す
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    const changePostStatus = async (id, status) => {
        setLoading(true);
        setError(null);

        try {
            await updateSightingStatus(id, status);
            setPosts((prev) => 
                prev.map((p) =>
                    p.id === id ? { ...p, status } : p
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
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return { posts, loading, error, loadPosts, changePostStatus };
};