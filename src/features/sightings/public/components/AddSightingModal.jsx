import Modal from 'react-modal';

import AddSightingForm from './AddSightingForm';

/**
 * 目撃情報投稿モーダル
 * - 選択地点の表示と投稿フォームをモーダル内に表示する
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの表示状態
 * @param {() => void} props.onClose - 閉じる操作時に呼ばれるコールバック
 * @param {{ lat: number, lng: number } | null} props.selectedLocation - 選択された地点
 * @param {() => void} props.onSubmit - 投稿完了時に呼ばれるコールバック
 * @returns {JSX.Element}
 */
function AddSightingModal({ isOpen, onClose, selectedLocation, onSubmit }) {
    return (
        <Modal
            isOpen={isOpen && !!selectedLocation}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            ariaHideApp={false}
            className="bg-white w-[95%] max-w-md max-h-[90vh] overflow-y-auto rounded-xl p-4 relative outline-none"
            overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-40"
        >
            {selectedLocation && (
                <>
                    <button
                        className="absolute top-2 right-2 text-xl"
                        aria-label="閉じる"
                        onClick={onClose}
                    >
                        ×
                    </button>
                    <div className="mb-3 text-sm text-gray-600">
                        <p className="font-medium">選択地点</p>
                        <p>緯度: {selectedLocation.lat.toFixed(5)}</p>
                        <p>経度: {selectedLocation.lng.toFixed(5)}</p>
                        <button
                            className="text-blue-600 underline mt-1"
                            onClick={onClose}
                        >
                            地点を変更する
                        </button>
                    </div>
                    <h2 className="text-lg font-semibold mb-2">目撃情報を投稿</h2>
                    <AddSightingForm
                        selectedLocation={selectedLocation}
                        onSubmit={onSubmit}
                    />
                </>
            )}
        </Modal>
    );
}

export default AddSightingModal;
