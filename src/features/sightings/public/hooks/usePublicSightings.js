import { useEffect, useState } from 'react'
import { fetchPublicSightings, createSighting } from '../../services/sightingsService';
import { mapErrorToUiMessage } from '../../../utils/errorMapper';

/**
 * 利用者画面用の目撃情報管理フック
 * - 承認済み投稿の取得と新規投稿を提供
 * @returns {{ posts: Object[], loading: boolean, error: string|null, loadPosts: () => Promise<void>, addPost: (data: Object) => Promise<{success: boolean, error?: string}> }}
 */
export const usePublicSightings = () => {
    const [ posts, setPosts ] = useState([]);
    // 利用者画面ではMap領域のローディング表示だけで十分なため、投稿取得・追加のloadingを分けていない
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const loadPosts = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchPublicSightings();
            setPosts(data);
        }
        catch (err) {
            setError(mapErrorToUiMessage(err));
        }
        finally {
            setLoading(false);
        }
    };

    const addPost = async (postData) => {
        setLoading(true);
        setError(null);

        try {
            await createSighting(postData);
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

    return { posts, loading, error, loadPosts, addPost };
};
