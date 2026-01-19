import { useState } from 'react';

import toast from 'react-hot-toast';
import { usePublicSightings } from '../hooks/usePublicSightings';
import { SIGHTING_TYPE_OPTIONS } from '../../constants/sightingTypes';

function AddSightingForm({ selectedLocation, onSubmit }) {
    const [ type, setType ] = useState('');
    const [ date, setDate ] = useState('');
    const [ note, setNote ] = useState('');
    const [ message, setMessage ] = useState('');

    const { addPost } = usePublicSightings();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedLocation) {
            setMessage('投稿する地点を選択してください');
            return;
        }

        try {
            await addPost({
                type,
                date: new Date(date),
                note,
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
            });
            // 成功時トースト表示
            toast.success('投稿が送信されました（承認待ち）');

            setType('');
            setDate('');
            setNote('');
            setMessage('');
            onSubmit?.();
        }
        catch (err) {
            console.log('投稿エラー', err);
            setMessage('投稿に失敗しました');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
            <label className="block text-gray-700 text-sm mb-1">
                種類：
                <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                >
                    <option value="">-- 選択してください --</option>
                    {SIGHTING_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block text-gray-700 text-sm mb-1">
                日時：
                <input
                    type="datetime-local" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </label>

            <label className="block text-gray-700 text-sm mb-1">
                詳細（任意）：
                <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="成獣・幼獣 頭数など"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </label>

            <button 
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded"
            >
                投稿する
            </button>
            <p style={{ color: 'red' }}>{message}</p>
        </form>
    )
}

export default AddSightingForm;