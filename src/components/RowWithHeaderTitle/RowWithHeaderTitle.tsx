import classNames from 'classnames'
import styles from './RowWithHeaderTitle.module.css'
import SmallerButton from '../SmallerButton/SmallerButton'
import type { ReactNode } from 'react';
import Skeleton from 'react-loading-skeleton';

export type RowItem = {
    headerTitle: string;
    title: string;
    subtitle: ReactNode;
    id: number;
    tipoAula?: string;
}

type RowWithHeaderTitleProps = {
    data: RowItem[],
    includeDetailsButton?: boolean,
    buttonLabel?: string,
    handleDetailsClick?: (id: number) => void
    isLoading?: boolean;
}

export default function RowWithHeaderTitle(props: RowWithHeaderTitleProps) {
    const dataToRender = props.isLoading ? [...Array(3)].map((_, index) => (index)) : props.data;
    return (
        <>
            {dataToRender.map((plan, index: number) => (
                <div 
                key={props.isLoading ? `skeleton-${index}` : `${(plan as RowItem)?.headerTitle}-${index}`} 
                className={classNames(styles.rowCard, {[styles.typeClassPresencial]: (plan as RowItem)?.title === 'PRESENCIAL'})}>
                    <div className={classNames(styles.rowHeader)}>
                        <p>
                            {props.isLoading ? (
                                <Skeleton width={200} />
                            ) : (
                                plan.headerTitle
                            )}
                        </p>
                    </div>
                    <div className={classNames(styles.rowWrapperText)}>
                        <div className={classNames(styles.rowInfo)}>
                            <h2>
                                {props.isLoading ? (
                                    <Skeleton width={250} />
                                ) : (
                                    plan.title
                                )}
                            </h2>
                            <p>
                                {props.isLoading ? (
                                    <Skeleton width={300} />
                                ) : (
                                    plan.subtitle
                                )}
                            </p>
                        </div>
                        {props.includeDetailsButton && (
                            <div
                                className={classNames(styles.rowButton)}
                                onClick={props.isLoading ? undefined : () => props.handleDetailsClick?.(plan?.id)}
                            >
                                {props.isLoading ? (
                                    <Skeleton width={100} height={36} borderRadius={8} />
                                ) : (
                                    <SmallerButton title={props.buttonLabel || "Detalhes"} />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {!props.isLoading && props.data.length === 0 && (
                <div className={classNames(styles.noData)}>
                    {/* <p>Não há nada por aqui...</p> */}
                </div>
            )}
        </>
    )
}
