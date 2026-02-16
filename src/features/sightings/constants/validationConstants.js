export const VALIDATION_CONSTANTS = {
    // 目撃日時の有効範囲
    SIGHTED_AT: {
        MAX_PAST_YEARS: 2,
    },

    // 詳細フィールドの最大文字数
    MAX_NOTE_LENGTH: 100,
};

export const VALIDATION_MESSAGES = {
    ANIMAL_TYPE_REQUIRED: '動物の種類を選択してください',
    ANIMAL_TYPE_INVALID: '有効な動物の種類を選択してください',

    SIGHTED_AT_REQUIRED: '目撃日時を入力してください',
    SIGHTED_AT_INVALID: '目撃日時が不正です',
    SIGHTED_AT_FUTURE: '未来の日時は入力できません',
    SIGHTED_AT_TOO_OLD: (years) => `${years}年以上前の目撃情報は投稿できません`,

    LOCATION_REQUIRED: '投稿予定地点の選択は必須です',
    LOCATION_INVALID: '位置情報が不正です',

    NOTE_TOO_LONG: (maxLength, currentLength) => `詳細は${maxLength}文字以内で入力してください（現在：${currentLength}文字）`,
};
