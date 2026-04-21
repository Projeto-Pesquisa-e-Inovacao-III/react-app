import "./style.css";


type searchBarProps = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}


export function SearchBar({search, setSearch}: searchBarProps) {

    return (
        <div className="search-bar">
            <img src="/searchIcon.png" alt="Pesquisar" className="search-icon" />
            <input
                type="text"
                placeholder="Pesquisar por nome"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
            />
        </div>  
    );
}
