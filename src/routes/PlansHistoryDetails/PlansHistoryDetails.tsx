import classNames from 'classnames';
import GoBackButton from '../../components/GoBackButton/GoBackButton';
import styles from './PlansHistoryDetails.module.css';
import useMobile from '../../hooks/isMobile';
import { useQuery } from '@tanstack/react-query';
import { BoughtPlanDetails } from '../../constants/products';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Skeleton from 'react-loading-skeleton';
export default function PlansHistoryDetails() {
    const isMobile = useMobile();

    const [searchParams] = useSearchParams();

    const nav = useNavigate();

    const productDetails = useQuery({
        queryKey: ['planDetails'],
        queryFn: () => BoughtPlanDetails(Number(searchParams.get("id"))),
        select: (res) => res.data,
        retry: 1,
        retryDelay: 0,
    });

    if (productDetails.isError) {
        console.error('Failed to fetch plan details:', productDetails.error);
        nav('/plans-history');
    }


    

    return (
        <div className={styles.container}>
            <GoBackButton />
            <div className={styles.title}>
                <h1>Detalhes da compra</h1>
            </div>
            <div className={classNames(styles.contentRow)}>
                <div className={styles.content}>
                    <h2 className={styles.subtitle}>Dados</h2>
                    {productDetails.isLoading ? <Skeleton count={4} width={300} /> : (
                        <>
                            <span>Nome: {productDetails.data?.nomeComprador}</span>
                            <span>Email: {productDetails.data?.emailComprador}</span>
                            <span>Telefone: {productDetails.data?.telefone}</span>
                            <span>CPF: {productDetails.data?.cpf}</span>
                        </>
                    )}
                </div>
            </div>

            <div className={classNames(styles.contentRow, styles.orderDetailsSection)}>
                <h2 className={styles.subtitle}>Detalhes do pedido</h2>
                <div className={classNames(styles.content, styles.orderDetails)}>
                    {productDetails.isLoading ? <Skeleton count={3} width={300} /> : (
                        <>
                            <span>Produto: {productDetails.data?.produtoComprado}</span>
                            <span>Valor: R$ {productDetails.data?.valorCompra}</span>
                            <span>Data da compra: {productDetails.data?.dataCompra ? format(new Date(productDetails.data.dataCompra + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : ''}</span>
                        </>
                    )}

                </div>
            </div>
            <div className={styles.dashed}></div>
            <div className={styles.contentRow}>
                <div className={styles.planDetails}>
                    <h2 className={styles.subtitle}>{productDetails.data?.produtoComprado}</h2>
                </div>
                <div className={classNames(styles.cardDetails, { [styles.cardDetailsMobile]: isMobile })}>
                    <span className={styles.highlight}>Subtotal: <span>{productDetails.data?.valorCompra ? `R$ ${productDetails.data?.valorCompra}` : <Skeleton width={100} />}</span></span>
                    <span className={styles.highlight}>Desconto: <span>R$ 0</span></span>
                    <div className={styles.dashed}></div>
                    <span className={styles.highlight}>Total: <span>{productDetails.data?.valorCompra ? `R$ ${productDetails.data?.valorCompra}` : <Skeleton width={100} />}</span></span>
                </div>
            </div>
        </div >
    );
}
