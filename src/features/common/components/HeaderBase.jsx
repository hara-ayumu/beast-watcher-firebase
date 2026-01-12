function HeaderBase({ title, right, onClick }) {
    return (
        <header
            onClick={onClick}
            className="flex items-center justify-between px-4 h-14 border-b bg-white shadow cursor-pointer select-none"
        >
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">{title}</h1>
            <div>{right}</div>
        </header>
    );
}

export default HeaderBase;
