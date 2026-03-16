function PostingGuideContent() {
    return (
        <div className="space-y-4 text-sm text-gray-700">
            <ol className="list-decimal pl-5 space-y-2">
                <li>地図上で目撃した場所をタップ（PCの場合はクリック）してピンを立てます</li>
                <li>画面下部に表示される「この場所の目撃情報を投稿」ボタンをタップします</li>
                <li>動物の種類を選択します</li>
                <li>目撃した日時を入力します</li>
                <li>詳細欄に目撃時の状況を入力します</li>
                <li>「投稿する」ボタンを押して完了です</li>
            </ol>
            <p className="text-xs text-gray-500">
                ※ 投稿は管理者の承認後に地図上に反映されます<br />
                ※ 投稿フォームを閉じると入力内容はリセットされます
            </p>
        </div>
    );
}

export default PostingGuideContent;
