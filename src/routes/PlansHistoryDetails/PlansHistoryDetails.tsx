import classNames from 'classnames';
import GoBackButton from '../../components/GoBackButton/GoBackButton';
import styles from './PlansHistoryDetails.module.css';
import useMobile from '../../hooks/isMobile';
import { useQuery } from '@tanstack/react-query';
import { BoughtPlanDetails } from '../../constants/products';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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


    console.log(productDetails.data);

    return (
        <div className={styles.container}>
            <GoBackButton />
            <div className={styles.title}>
                <h1>Detalhes da compra</h1>
            </div>
            <div className={classNames(styles.contentRow)}>
                <div className={styles.content}>
                    <h2 className={styles.subtitle}>Dados</h2>
                    <span>Nome: {productDetails.data?.nomeComprador}</span>
                    <span>Email: {productDetails.data?.emailComprador}</span>
                    <span>Telefone: {productDetails.data?.telefone}</span>
                    <span>CPF: {productDetails.data?.cpf}</span>
                </div>
            </div>

            <div className={classNames(styles.contentRow, styles.orderDetailsSection)}>
                <h2 className={styles.subtitle}>Detalhes do pedido</h2>
                <div className={classNames(styles.content, styles.orderDetails)}>
                    <span>Produto: {productDetails.data?.produtoComprado}</span>
                    <span>Valor: R$ {productDetails.data?.valorCompra}</span>
                    <span>Data da compra: {productDetails.data?.dataCompra ? format(new Date(productDetails.data.dataCompra + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : ''}</span>
                </div>
            </div>
            <div className={styles.dashed}></div>
            <div className={styles.contentRow}>
                <div className={styles.planDetails}>
                    <h2 className={styles.subtitle}>{productDetails.data?.produtoComprado}</h2>
                    <span className={classNames(styles.planDetailsDescription, { [styles.planDetailsDescriptionMobile]: isMobile })}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. At, id nesciunt pariatur similique neque nihil.</span>
                </div>
                <div className={classNames(styles.cardDetails, { [styles.cardDetailsMobile]: isMobile })}>
                    <span className={styles.highlight}>Subtotal: <span>R$ {productDetails.data?.valorCompra}</span></span>
                    <span className={styles.highlight}>Desconto: <span>R$ 0</span></span>
                    <div className={styles.dashed}></div>
                    <span className={styles.highlight}>Total: <span>R$ {productDetails.data?.valorCompra}</span></span>
                </div>
            </div>
        </div >
    );
}
