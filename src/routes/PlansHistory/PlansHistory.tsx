import { SearchIcon } from "lucide-react";
import InputWithIcon from "../../components/Inputs/InputWithIcon/InputWithIcon";
import classNames from "classnames";

import styles from "./PlansHistory.module.css";
import { useNavigate } from "react-router-dom";
import RowWithHeaderTitle from "../../components/RowWithHeaderTitle/RowWithHeaderTitle";
import { getUserPlansHistory } from "../../constants/products";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useInfinitePagination } from "../../hooks/useInfinitePagination";

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


    // const userPlans = useQuery<UserPlan[]>({
    //     queryKey: ['user-plans'],
    //     queryFn: async () => {
    //         const response = await getUserPlansHistory();
    //         return response.data;
    //     },
    // });

    const { data, isLoading } = useInfinitePagination<UserPlan>({
        queryKey: ['user-plans'],
        queryFn: async () => {
            const response = await getUserPlansHistory();
            return response.data;
        },
    });

    console.log(data)

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
                        // value={filterSearch}
                        // onInputChange={setFilterSearch}
                    />
                </div>
                <div className={styles.datePickerWrapper}>
                    {/* <InputCalendar />
                    <InputCalendar /> */}
                </div>
                {/* {hasFilters && (
                    <div className={classNames(styles.searchButton)}>
                        <SmallerButton title="Limpar filtros" handleButtonClick={clearFilters} />
                    </div>
                )} */}
            </div>

            {data && data.length > 0 ? (
                data.sort((a, b) => a.dataCompra.localeCompare(b.dataCompra)).map((item) => (
                    <RowWithHeaderTitle
                        key={item.id}
                        data={[
                            {
                                headerTitle: format(parseISO(item.dataCompra), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
                                title: item.produtoExibicao.titulo,
                                subtitle: item.produtoExibicao.subtitulo,
                                id: item.id
                            }
                        ]}
                        includeDetailsButton={true}
                        buttonLabel="Ver Detalhes"
                        handleDetailsClick={() => handleDetailsClick(item.id)}
                        isLoading={isLoading}
                    />
                ))
            ) : isLoading ? (
                [...Array(1)].map((_, index) => (
                    <RowWithHeaderTitle
                        key={`skeleton-${index}`}
                        data={[{ headerTitle: '', title: '', subtitle: '', id: index }]}
                        isLoading={true}
                    />
                ))
            ) : (
                <div className="flex justify-center items-center mt-10 my-5 gap-5">
                    <span className="flex items-center justify-center w-full h-1 bg-gray-400"></span>
                    <span className="text-slate-500 w-1/2 text-center">Não há mais planos para exibir</span>
                    <span className="flex items-center justify-center w-full h-1 bg-gray-400"></span>
                </div>
            )}

        </div>
    );
}