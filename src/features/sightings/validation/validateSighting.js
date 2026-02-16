import { ValidationError } from '../../../errors/ValidationError';
import { SIGHTING_TYPE_OPTIONS } from '../constants/sightingTypes';
import { VALIDATION_CONSTANTS, VALIDATION_MESSAGES } from '../constants/validationConstants';

const rules = {
    animal_type: (value) => {
        if (!value) {
            return null;
        }
        const allowedTypes = SIGHTING_TYPE_OPTIONS.map(opt => opt.value);
        return allowedTypes.includes(value) ? null : VALIDATION_MESSAGES.ANIMAL_TYPE_INVALID;
    },

    sighted_at: (value) => {
        if (!value) {
            return null;
        }
        const sightedDate = value instanceof Date ? value : new Date(value);
        if (isNaN(sightedDate.getTime())) {
            return VALIDATION_MESSAGES.SIGHTED_AT_INVALID
        };

        // 未来の日時チェック
        const now = new Date();
        if (sightedDate > now) {
            return VALIDATION_MESSAGES.SIGHTED_AT_FUTURE
        };

        // 既定の年数より前の日時かチェック
        const minDate = new Date();
        minDate.setFullYear(now.getFullYear() - VALIDATION_CONSTANTS.SIGHTED_AT.MAX_PAST_YEARS);
        if (sightedDate < minDate) {
            return VALIDATION_MESSAGES.SIGHTED_AT_TOO_OLD(VALIDATION_CONSTANTS.SIGHTED_AT.MAX_PAST_YEARS);
        }
        return null;
    },

    location: (lat, lng) => {
        if (lat === undefined || lat === null || lng === undefined || lng === null) {
            return null
        };
        
        // 緯度経度の型が数値かチェック
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            return VALIDATION_MESSAGES.LOCATION_INVALID
        };

        // 緯度経度の異常値をチェック
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return VALIDATION_MESSAGES.LOCATION_INVALID
        };
        return null;
    },

    note: (value) => {
        if (!value) {
            return null
        };
        // 詳細の文字数チェック
        if (value.length > VALIDATION_CONSTANTS.MAX_NOTE_LENGTH) {
            return VALIDATION_MESSAGES.NOTE_TOO_LONG(VALIDATION_CONSTANTS.MAX_NOTE_LENGTH, value.length);
        }
        return null;
    }
};

export const validateForCreate = (data) => {
    const errors = {};

    // 動物種未選択の場合
    if (!data.animal_type) {
        errors.animal_type = VALIDATION_MESSAGES.ANIMAL_TYPE_REQUIRED;
    }
    else {
        const err = rules.animal_type(data.animal_type);
        if (err) {
            errors.animal_type = err;
        }
    }

    // 目撃日時未選択の場合
    if (!data.sighted_at) {
        errors.sighted_at = VALIDATION_MESSAGES.SIGHTED_AT_REQUIRED;
    }
    else {
        const err = rules.sighted_at(data.sighted_at);
        if (err) {
            errors.sighted_at = err
        };
    }

    // 投稿予定地点未選択の場合
    if (data.lat === undefined || data.lat === null || data.lng === undefined || data.lng === null) {
        errors.location = VALIDATION_MESSAGES.LOCATION_REQUIRED;
    }
    else {
        const err = rules.location(data.lat, data.lng);
        if (err) {
            errors.location = err
        };
    }

    const noteErr = rules.note(data.note);
    if (noteErr) {
        errors.note = noteErr
    };

    return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateForUpdate = (patch) => {
    const errors = {};

    if ('animal_type' in patch) {
        if (!patch.animal_type) {
            errors.animal_type = VALIDATION_MESSAGES.ANIMAL_TYPE_REQUIRED;
        }
        else {
            const err = rules.animal_type(patch.animal_type);
            if (err) errors.animal_type = err;
        }
    }

    if ('sighted_at' in patch) {
        if (!patch.sighted_at) {
            errors.sighted_at = VALIDATION_MESSAGES.SIGHTED_AT_REQUIRED;
        }
        else {
            const err = rules.sighted_at(patch.sighted_at);
            if (err) {
                errors.sighted_at = err;
            }
        }
    }

    if ('lat' in patch || 'lng' in patch) {
        if (patch.lat === undefined || patch.lat === null || patch.lng === undefined || patch.lng === null) {
            errors.location = VALIDATION_MESSAGES.LOCATION_REQUIRED;
        }
        else {
            const err = rules.location(patch.lat, patch.lng);
            if (err) {
                errors.location = err;
            }
        }
    }

    if ('note' in patch) {
        const err = rules.note(patch.note);
        if (err) {
            errors.note = err;
        }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * 新規投稿のバリデーションを実行し、エラーがあれば ValidationError を投げる
 * @param {Object} data - バリデーション対象のデータ
 * @throws {ValidationError} バリデーションエラーがある場合
 */
export const validateCreateOrThrow = (data) => {
    const { isValid, errors } = validateForCreate(data);

    if (!isValid) {
        const firstErrorKey = Object.keys(errors)[0];
        const firstErrorMessage = Object.values(errors)[0];
        throw new ValidationError(firstErrorMessage, firstErrorKey, errors);
    }
};

/**
 * 投稿更新のバリデーションを実行し、エラーがあれば ValidationError を投げる
 * @param {Object} patch - バリデーション対象のデータ
 * @throws {ValidationError} バリデーションエラーがある場合
 */
export const validateUpdateOrThrow = (patch) => {
    const { isValid, errors } = validateForUpdate(patch);

    if (!isValid) {
        const firstErrorKey = Object.keys(errors)[0];
        const firstErrorMessage = Object.values(errors)[0];
        throw new ValidationError(firstErrorMessage, firstErrorKey, errors);
    }
};
