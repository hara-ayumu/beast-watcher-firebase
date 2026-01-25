import { useEffect, useState } from 'react'
import { fetchPublicSightings, createSighting } from '../../services/sightingsService';
import { mapErrorToUiMessage } from '../../../utils/errorMapper';

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
            const newDoc = await createSighting(postData);
            setPosts(prev => [{ id: newDoc.id, ...postData }, ...prev]);
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