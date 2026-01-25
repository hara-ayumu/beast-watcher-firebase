import { useEffect, useState } from 'react'
import { fetchAllSightings, updateSightingStatus } from '../../services/sightingsService';
import { mapErrorToUiMessage } from '../../../utils/errorMapper';

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
     * 投稿ステータスを更新する
     * UI側で失敗時にトーストを出すことを想定して、成功/失敗で返す
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    const changePostStatus = async (id, status) => {
        setUpdating(true);
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
        changePostStatus
    };
};