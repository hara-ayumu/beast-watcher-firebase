import { useEffect, useState } from 'react'
import { fetchAllSightings, updateSightingStatus } from '../../services/sightingsService';

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
            setError('投稿データの取得に失敗しました。');
        }
        finally {
            setLoading(false);
        }
    }

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
        }
        catch (err) {
            setError('ステータス更新に失敗しました。');
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    return { posts, loading, error, loadPosts, changePostStatus };
}