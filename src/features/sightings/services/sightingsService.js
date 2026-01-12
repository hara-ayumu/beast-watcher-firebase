import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../auth/firebase';

/**
 * 投稿者用: 投稿を取得（承認済みのみ）
 * 誤情報拡散防止のため
 */
export const fetchPublicSightings = async () => {
    try {
        const sightingsQuery = query(
            collection(db, 'sightings'),
            where('status', '==', 'approved'),
            orderBy('date', 'desc')
        );

        const snapshot = await getDocs(sightingsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
    }
    catch (err) {
        console.error('fetchPublicSightingsエラー:', err);
        throw err;
    }
}

/**
 * 投稿者用: 新規投稿（ステータスは必ず未承認）
 */
export const createSighting = async (data) => {
    try {
        const payload = {
            ...data,
            date: data.date instanceof Date ? Timestamp.fromDate(data.date) : data.date,
            status: 'pending',
        };
        return await addDoc(collection(db, 'sightings'), payload);
    }
    catch (err) {
        console.error('createSightingエラー:', err);
        throw err;
    }
}

/**
 * 管理者用: すべての投稿を取得
 */
export const fetchAllSightings = async () => {
    try {
        const sightingsQuery = query(
            collection(db, 'sightings'),
            orderBy('date', 'desc')
        );

        const snapshot = await getDocs(sightingsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
    }
    catch (err) {
        console.error('updateSightingStatusエラー:', err);
        throw err;
    }
}

/**
 * 管理者用: 投稿ステータス更新
 */
export const updateSightingStatus = async (id, status) => {
    try {
        const ref = doc(db, 'sightings', id);
        await updateDoc(ref, { status });
    }
    catch (err) {
        console.error('updateSightingStatusエラー:', err);
        throw err;
    }
}