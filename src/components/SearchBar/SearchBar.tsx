import styles from "./SearchBar.module.css";


type searchBarProps = {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}


export function SearchBar({search, setSearch}: searchBarProps) {

    return (
        <div className={styles.searchBar}>
            <img src="/searchIcon.png" alt="Pesquisar" className={styles.searchIcon} />
            <input
                type="text"
                placeholder="Pesquisar por nome"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
            />
        </div>  
    );
}
