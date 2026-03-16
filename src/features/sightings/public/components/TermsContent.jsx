function TermsContent() {
    return (
        <div className="space-y-4 text-sm text-gray-700">
            <p>「Beast Watcher」は、喬木村をモデルケースとした野生動物目撃情報共有サービスのデモです。喬木村の公式サービスではありません。</p>
            <p>ご利用の前に以下をご確認ください。</p>
            <div>
                <p className="font-semibold mb-1">免責事項</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>掲載されている情報にはテストデータが含まれている場合があります</li>
                    <li>情報の正確性・信頼性は保証されません</li>
                    <li>野生動物への対応など、安全に関わる実際の判断には使用しないでください</li>
                    <li>本サービスの利用により生じた損害について、開発者は一切の責任を負いません</li>
                </ul>
            </div>

            <div>
                <p className="font-semibold mb-1">投稿について</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>投稿された情報は管理者の承認後、地図上に公開されます</li>
                    <li>公序良俗に反する内容の投稿はご遠慮ください</li>
                </ul>
            </div>

            <div>
                <p className="font-semibold mb-1">外部サービス</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>本サービスはGoogle Maps Platformを使用しています。地図の利用にはGoogleの利用規約が適用されます。</li>
                </ul>
            </div>
        </div>
    );
}

export default TermsContent;
