import { useEffect, useState } from 'react'
import { fetchPublicSightings, createSighting } from '../../services/sightingsService';

export const usePublicSightings = () => {
    const [ posts, setPosts ] = useState([]);
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
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }

    const addPost = async (postData) => {
        setLoading(true);
        setError(null);

        try {
            const newDoc = await createSighting(postData);
            setPosts(prev => [{ id: newDoc.id, ...postData }, ...prev]);
        }
        catch (err) {
            setError('投稿に失敗しました。再試行してください。');
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    return { posts, loading, error, loadPosts, addPost };
}