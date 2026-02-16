import { useState } from 'react';

import toast from 'react-hot-toast';

import { usePublicSightings } from '../hooks/usePublicSightings';

import { mapErrorToUiMessage } from '../../../utils/errorMapper';

import { validateForCreate } from '../../validation/validateSighting';

import { VALIDATION_CONSTANTS } from '../../constants/validationConstants';
import { SIGHTING_TYPE_OPTIONS } from '../../constants/sightingTypes';
import { ERROR_MESSAGES } from '../../constants/errorMessages';
import { ERROR_CODES } from '../../constants/errorCodes';

function AddSightingForm({ selectedLocation, onSubmit }) {
    const [ animal_type, setAnimalType ] = useState('');
    const [ sighted_at, setSightedAt ] = useState('');
    const [ note, setNote ] = useState('');
    const [ errors, setErrors ] = useState({});

    const { addPost } = usePublicSightings();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const postData = {
            animal_type,
            sighted_at: new Date(sighted_at),
            note,
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
        };

        const validationResult = validateForCreate(postData);

        if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            return;
        }

        const result = await addPost(postData);

        if (result.success) {
            // 成功時トースト表示
            toast.success('投稿が送信されました。（承認待ち）');
            setAnimalType('');
            setSightedAt('');
            setNote('');
            onSubmit?.();
        }
        else {
            const userMessage = mapErrorToUiMessage(result.error) || ERROR_MESSAGES[ERROR_CODES.CREATE_SIGHTING_FAILED];
            setErrors({ general: userMessage });
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <label className="block text-gray-700 text-sm mb-1">
                種類：
                <select
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                        errors.animal_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={animal_type}
                    onChange={(e) => setAnimalType(e.target.value)}
                    required
                >
                    <option value="">-- 選択してください --</option>
                    {SIGHTING_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.animal_type && (
                    <p className="text-red-500 text-xs mt-1">{errors.animal_type}</p>
                )}
            </label>

            <label className="block text-gray-700 text-sm mb-1">
                日時：
                <input
                    type="datetime-local" 
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                        errors.sighted_at ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={sighted_at}
                    onChange={(e) => setSightedAt(e.target.value)}
                    required
                />
                {errors.sighted_at && (
                    <p className="text-red-500 text-xs mt-1">{errors.sighted_at}</p>
                )}
            </label>

            <label className="block text-gray-700 text-sm mb-1">
                詳細（任意: {VALIDATION_CONSTANTS.MAX_NOTE_LENGTH}字以内）：
                <textarea
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                        errors.note ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="成獣・幼獣 頭数など"
                    value={note}
                    maxLength={VALIDATION_CONSTANTS.MAX_NOTE_LENGTH}
                    onChange={(e) => setNote(e.target.value)}
                />
                <div className={`text-xs mt-1 ${note.length > VALIDATION_CONSTANTS.MAX_NOTE_LENGTH ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    {note.length}/{VALIDATION_CONSTANTS.MAX_NOTE_LENGTH}文字
                </div>
                {errors.note && (
                    <p className="text-red-500 text-xs mt-1">{errors.note}</p>
                )}
            </label>

            <button 
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded"
            >
                投稿する
            </button>
            {errors.general && (
                <p className="text-red-500 mt-2">{errors.general}</p>
            )}
        </form>
    );
}

export default AddSightingForm;
