import { ERROR_CODES } from './errorCodes';

export const ERROR_MESSAGES = {
    [ERROR_CODES.CREATE_SIGHTING_FAILED]: '投稿に失敗しました。再度お試しください。',
    [ERROR_CODES.FETCH_PUBLIC_SIGHTINGS_FAILED]: '目撃情報の取得に失敗しました。',
    [ERROR_CODES.FETCH_ALL_SIGHTINGS_FAILED]: '投稿データの取得に失敗しました。',
    [ERROR_CODES.UPDATE_SIGHTING_FAILED]: '投稿の更新に失敗しました。再度お試しください。',
    [ERROR_CODES.REVIEW_SIGHTING_FAILED]: '投稿レビューの登録に失敗しました。再度お試しください。',
    [ERROR_CODES.UNKNOWN_ERROR]: '予期せぬエラーが発生しました。時間をおいて再度お試しください。',
};
