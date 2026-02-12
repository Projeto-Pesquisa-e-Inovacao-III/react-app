import { SearchIcon } from "lucide-react";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./PlansHistory.module.css";
import SmallerButton from "../../components/SmallerButton/SmallerButton";
import InputCalendar from "../../components/Inputs/InputCalendar/InputCalendar";
import { useNavigate } from "react-router-dom";
import RowWithHeaderTitle from "../../components/RowWithHeaderTitle/RowWithHeaderTitle";
import useSearchFilter from "../../hooks/useSearchFilter";
import { useQuery } from "@tanstack/react-query";
import { getUserPlansHistory } from "../../constants/products";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type UserPlan = {
  id: number;
  dataCompra: string;
  produtoExibicao: {
    titulo: string;
    subtitulo: string;
  };
};


export default function PlansHistory() {
    const nav = useNavigate();

    function handleDetailsClick(id: number) {
        nav('/plans-history-details?id=' + id);
    }


    const userPlans = useQuery<UserPlan[]>({
        queryKey: ['user-plans'],
        queryFn: async () => {
            const response = await getUserPlansHistory();
            return response.data;
        },
    });

    const {
        filterSearch,
        setFilterSearch,
        filterInitialDate,
        setFilterInitialDate,
        filterFinalDate,
        setFilterFinalDate,
        filteredData,
        hasFilters,
        clearFilters,
    } = useSearchFilter(userPlans.data ?? [], {
        searchName: (item) => [item.produtoExibicao.titulo],
        dateFilter: (item) => item.dataCompra,
    });


    return (
        <div className={classNames(styles.container)}>
            <div className={classNames(styles.title)}>
                <h1>Histórico de Compras</h1>

            </div>

            <div className={classNames(styles.search)}>
                <div className={classNames(styles.searchInput)}>
                    <InputWithIcon
                        type="text"
                        placeholder="Buscar..."
                        icon={<SearchIcon />}
                        value={filterSearch}
                        onInputChange={setFilterSearch}
                    />
                </div>
                <div className={styles.datePickerWrapper}>
                    <InputCalendar selectedDate={filterInitialDate} setSelectedDate={setFilterInitialDate} />
                    <InputCalendar selectedDate={filterFinalDate} setSelectedDate={setFilterFinalDate} />
                </div>
                {hasFilters && (
                    <div className={classNames(styles.searchButton)}>
                        <SmallerButton title="Limpar filtros" handleButtonClick={clearFilters} />
                    </div>
                )}
            </div>

            {filteredData && filteredData.length > 0 ? (
                filteredData.sort((a, b) => a.dataCompra.localeCompare(b.dataCompra)).map((item) => (
                    <RowWithHeaderTitle 
                        key={item.id}
                        data={[
                            {
                                headerTitle: format(parseISO(item.dataCompra), "dd 'de' MMMM 'de' yyyy", {locale: ptBR}),
                                title: item.produtoExibicao.titulo, 
                                subtitle: item.produtoExibicao.subtitulo,
                                id: item.id
                            }
                        ]} 
                        includeDetailsButton={true} 
                        buttonLabel="Ver Detalhes" 
                        handleDetailsClick={() => handleDetailsClick(item.id)} 
                    />
                ))
            ) : (
                <p>Não há planos disponíveis</p>
            )}
            
        </div>
    );
}