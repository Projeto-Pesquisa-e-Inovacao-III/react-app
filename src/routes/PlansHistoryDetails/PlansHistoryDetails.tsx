import GoBackButton from '../../components/GoBackButton/GoBackButton';
import styles from './PlansHistoryDetails.module.css';
import { useQuery } from '@tanstack/react-query';
import { BoughtPlanDetails } from '../../constants/products';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Skeleton from 'react-loading-skeleton';
import { User, ShoppingBag, Tag, CreditCard } from 'lucide-react';

export default function PlansHistoryDetails() {
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

    const isLoading = productDetails.isLoading;
    const data = productDetails.data;

    const formattedDate = data?.dataCompra
        ? format(new Date(data.dataCompra + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })
        : '';

    const formattedValue = (val?: number | string) =>
        val != null ? `R$ ${val}` : <Skeleton width={80} />;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <GoBackButton />
            </div>
            <div className={styles.title}>
                <h1>Detalhes da compra</h1>
            </div>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardHeaderIcon}>
                            <User size={17} />
                        </div>
                        <span className={styles.cardTitle}>Dados do comprador</span>
                    </div>

                    <div className={styles.infoList}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Nome</span>
                            <span className={styles.infoValue}>
                                {isLoading ? <Skeleton width={180} /> : data?.nomeComprador}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Email</span>
                            <span className={styles.infoValue}>
                                {isLoading ? <Skeleton width={220} /> : data?.emailComprador}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Telefone</span>
                            <span className={styles.infoValue}>
                                {isLoading ? <Skeleton width={140} /> : data?.telefone}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>CPF</span>
                            <span className={styles.infoValue}>
                                {isLoading ? <Skeleton width={140} /> : data?.cpf}
                            </span>
                        </div>
                    </div>
                </div>

                
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardHeaderIcon}>
                            <ShoppingBag size={17} />
                        </div>
                        <span className={styles.cardTitle}>Detalhes do pedido</span>
                    </div>

                    <div className={styles.infoList}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Produto</span>
                            <span className={styles.infoValue}>
                                {isLoading ? <Skeleton width={160} /> : data?.produtoComprado}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Valor</span>
                            <span className={styles.infoValue}>
                                {isLoading ? <Skeleton width={80} /> : `R$ ${data?.valorCompra}`}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Data da compra</span>
                            <span className={styles.infoValue}>
                                {isLoading ? <Skeleton width={100} /> : formattedDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className={styles.summaryCard}>
                <div className={styles.summaryHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className={styles.cardHeaderIcon}>
                            <CreditCard size={17} />
                        </div>
                        <span className={styles.summaryProductName}>
                            {isLoading ? <Skeleton width={180} /> : data?.produtoComprado}
                        </span>
                    </div>
                    <span className={styles.summaryBadge}>
                        <Tag size={11} />
                        Resumo do pagamento
                    </span>
                </div>

                <div className={styles.summaryRows}>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryRowLabel}>Subtotal</span>
                        <span>{formattedValue(data?.valorCompra)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span className={styles.summaryRowLabel}>Desconto</span>
                        <span>R$ 0</span>
                    </div>
                    <div className={styles.summaryDivider} />
                    <div className={styles.summaryTotal}>
                        <span>Total</span>
                        <span className={styles.summaryTotalValue}>
                            {formattedValue(data?.valorCompra)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
