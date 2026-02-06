import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../../auth/firebase';
import { SIGHTING_STATUS } from '../constants/sightingStatus';
import { ERROR_CODES } from '../constants/errorCodes';

/**
 * 開発環境でのみ詳細ログを出す
 */
const isDev = import.meta.env.VITE_APP_ENV === 'development';
const handleAndWrap = (code, originalError) => {
    if (isDev) {
        console.error(`[SightingsService] ${code}`, originalError);
    }
    const err = new Error(code);
    err.code = code;
    return err;
};

/**
 * 投稿者用: 新規投稿（ステータスは必ず未承認）
 */
export const createSighting = async (data) => {
    try {
        const payload = {
            animal_type: data.animal_type,
            sighted_at: data.sighted_at instanceof Date ? Timestamp.fromDate(data.sighted_at) : data.sighted_at,
            lat: data.lat,
            lng: data.lng,
            note: data.note || '',

            created_at: serverTimestamp(),
            created_by: null,

            status: SIGHTING_STATUS.PENDING,
            reviewed_at: null,
            reviewed_by: null,
            review_comment: null,
        };
        return await addDoc(collection(db, 'sightings'), payload);
    }
    catch (err) {
        throw handleAndWrap(ERROR_CODES.CREATE_SIGHTING_FAILED, err);
    }
};

/**
 * 投稿者用: 投稿を取得（承認済みのみ）
 * 誤情報拡散防止のため
 */
export const fetchPublicSightings = async () => {
    try {
        const sightingsQuery = query(
            collection(db, 'sightings'),
            where('status', '==', SIGHTING_STATUS.APPROVED),
            orderBy('sighted_at', 'desc')
        );

        const snapshot = await getDocs(sightingsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
    }
    catch (err) {
        throw handleAndWrap(ERROR_CODES.FETCH_PUBLIC_SIGHTINGS_FAILED, err);
    }
};

/**
 * 管理者用: すべての投稿を取得
 */
export const fetchAllSightings = async () => {
    try {
        const sightingsQuery = query(
            collection(db, 'sightings'),
            orderBy('sighted_at', 'desc')
        );

        const snapshot = await getDocs(sightingsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
    }
    catch (err) {
        throw handleAndWrap(ERROR_CODES.FETCH_ALL_SIGHTINGS_FAILED, err);
    }
};

/**
 * 管理者用: 投稿ステータス更新
 */
export const updateSightingStatus = async (id, status, reviewComment = '', adminUser = null) => {
    try {
        const ref = doc(db, 'sightings', id);
        await updateDoc(ref, {
            status,
            reviewed_at: serverTimestamp(),
            reviewed_by: adminUser?.uid || null,
            review_comment: reviewComment || null,
        });
    }
    catch (err) {
        throw handleAndWrap(ERROR_CODES.UPDATE_SIGHTING_STATUS_FAILED, err);
    }
};
