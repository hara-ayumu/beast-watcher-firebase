import { collection, getDocs, addDoc, doc, query, orderBy, Timestamp, serverTimestamp, runTransaction } from 'firebase/firestore';

import { db } from '../../auth/firebase';

import { validateCreateOrThrow, validateUpdateOrThrow } from '../validation/validateSighting';
import { ServiceError } from '../../../errors/ServiceError';

import { SIGHTING_STATUS } from '../constants/sightingStatus';
import { ERROR_CODES } from '../constants/errorCodes';

/**
 * 投稿者用: 新規投稿（ステータスは必ず未承認）
 */
export const createSighting = async (data) => {
    validateCreateOrThrow(data);
    
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
        return await addDoc(collection(db, 'sightings_master'), payload);
    }
    catch (err) {
        throw new ServiceError(ERROR_CODES.CREATE_SIGHTING_FAILED, err, {
            operation: 'createSighting',
            animalType: data.animal_type,
            hasNote: !!data.note
        });
    }
};

/**
 * 投稿者用: 投稿を取得（承認済みのみ）
 * 誤情報拡散防止のため
 */
export const fetchPublicSightings = async () => {
    try {
        const sightingsQuery = query(
            collection(db, 'sightings_published'),
            orderBy('sighted_at', 'desc')
        );

        const snapshot = await getDocs(sightingsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
    }
    catch (err) {
        throw new ServiceError(ERROR_CODES.FETCH_PUBLIC_SIGHTINGS_FAILED, err, {
            operation: 'fetchPublicSightings',
            collection: 'sightings_published'
        });
    }
};

/**
 * 管理者用: すべての投稿を取得
 */
export const fetchAllSightings = async () => {
    try {
        const sightingsQuery = query(
            collection(db, 'sightings_master'),
            orderBy('sighted_at', 'desc')
        );

        const snapshot = await getDocs(sightingsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
    }
    catch (err) {
        throw new ServiceError(ERROR_CODES.FETCH_ALL_SIGHTINGS_FAILED, err, {
            operation: 'fetchAllSightings',
            collection: 'sightings_master'
        });
    }
};

/**
 * 管理者用: 投稿更新
 * - ステータス変更を含む任意のフィールド更新が可能
 * - 承認済み投稿は公開データも同期更新
 * - 承認→却下の場合は公開データを削除
 * @param {string} id - 投稿ID
 * @param {Object} patch - 更新するフィールド
 * @returns {Promise<void>}
 */
export const updateSighting = async (id, patch) => {
    const needsValidation = 'animal_type' in patch || 'sighted_at' in patch ||
                            'lat' in patch || 'lng' in patch || 'note' in patch;

    if (needsValidation) {
        validateUpdateOrThrow(patch);
    }

    try {
        await runTransaction(db, async (transaction) => {
            const masterRef = doc(db, 'sightings_master', id);
            const publishedRef = doc(db, 'sightings_published', id);

            // 現在のステータスを確認するためのデータ取得
            const masterDoc = await transaction.get(masterRef);
            if (!masterDoc.exists()) {
                throw new Error(`Master document does not exist: ${id}`);
            }

            const currentData = masterDoc.data();
            const currentStatus = currentData.status;
            
            // 更新後のステータスを決定
            let newStatus;
            if ('status' in patch) {
                newStatus = patch.status;
            }
            else {
                newStatus = currentStatus;
            }

            // マスターの更新
            transaction.update(masterRef, patch);

            // 承認済みの場合、公開用データも更新する
            if (newStatus === SIGHTING_STATUS.APPROVED) {
                // 公開用のフィールド準備
                const publishedFields = ['animal_type', 'sighted_at', 'lat', 'lng', 'note'];
                const publishedData = {};

                publishedFields.forEach(field => {
                    if (field in patch) {
                        publishedData[field] = patch[field];
                    }
                    else {
                        publishedData[field] = currentData[field]
                    }
                });
                transaction.set(publishedRef, publishedData);
            }
            // 承認状態から日承認状態に変更された場合公開用データを削除
            else if (currentStatus === SIGHTING_STATUS.APPROVED) {
                transaction.delete(publishedRef);
            }
        });
    }
    catch (err) {
        throw new ServiceError(ERROR_CODES.UPDATE_SIGHTING_FAILED, err, {
            operation: 'updateSighting',
            sightingId: id,
            updatedFields: Object.keys(patch),
            statusChange: 'status' in patch ? patch.status : undefined
        });
    }
};

/**
 * 管理者用: 投稿のレビューを更新する
 * - 承認時: マスター更新、公開コレクション作成
 * - 却下時: マスター更新、公開コレクション削除
 * @param {string} id - 投稿ID
 * @param {{ status: string, review_comment: string, reviewed_by: string }} data - レビューデータ
 * @returns {Promise<void>}
 */
export const reviewSighting = async (id, { status, review_comment, reviewed_by }) => {
    try {
        await runTransaction(db, async (transaction) => {
            const masterRef = doc(db, 'sightings_master', id);
            const publishedRef = doc(db, 'sightings_published', id);

            // 公開用へのコピーのため最新のマスターデータを取得
            const masterDoc = await transaction.get(masterRef); 
            if (!masterDoc.exists()) {
                throw new Error(`Source data not found for review: ${id}`);
            }
            const data = masterDoc.data();

            // マスターのレビュー更新
            transaction.update(masterRef, {
                status,
                review_comment,
                reviewed_by,
                reviewed_at: serverTimestamp(),
            });

            // 承認時は公開用にコピーを作成
            if (status === SIGHTING_STATUS.APPROVED) {
                // 公開して良いフィールド
                const publishedData = {
                    animal_type: data.animal_type,
                    sighted_at: data.sighted_at,
                    lat: data.lat,
                    lng: data.lng,
                    note: data.note,
                };
                transaction.set(publishedRef, publishedData);
            }
            else {
                transaction.delete(publishedRef);
            }
        });

    }
    catch (err) {
        throw new ServiceError(ERROR_CODES.REVIEW_SIGHTING_FAILED, err, {
            operation: 'reviewSighting',
            sightingId: id,
            reviewAction: status,
            hasComment: !!review_comment,
            reviewerId: reviewed_by
        });
    }
};
