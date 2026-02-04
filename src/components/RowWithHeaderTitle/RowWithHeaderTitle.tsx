import classNames from 'classnames'
import styles from './RowWithHeaderTitle.module.css'
import SmallerButton from '../SmallerButton'
import type { ReactNode } from 'react';

export type RowItem = {
    headerTitle: string;
    title: string;
    subtitle: ReactNode;
    id: number;
}

type RowWithHeaderTitleProps = {
    data: RowItem[],
    includeDetailsButton?: boolean,
    buttonLabel?: string,
    handleDetailsClick?: (id: number) => void
}

export default function RowWithHeaderTitle(props: RowWithHeaderTitleProps) {
    console.log("Rendering RowWithHeaderTitle with data:", props.data);
    return (
        <>
            {props.data.map((plan, index: number) => (
                <div key={`${plan.headerTitle}-${index}`} className={classNames(styles.rowCard)}>
                    <div className={classNames(styles.rowHeader)}>
                        <p>{plan.headerTitle}</p>
                    </div>
                    <div className={classNames(styles.rowWrapperText)}>

                        <div className={classNames(styles.rowInfo)}>
                            <h2>{plan.title}</h2>
                            <p>{plan.subtitle}</p>
                        </div>
                        {props.includeDetailsButton && props.handleDetailsClick && (
                            <div className={classNames(styles.rowButton)} onClick={() => props.handleDetailsClick?.(plan.id)}>
                                <SmallerButton title={props.buttonLabel || "Detalhes"} />
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {props.data.length === 0 && (
                <div className={classNames(styles.noData)}>
                    <p>Não há nada por aqui...</p>
                </div>
            )}
        </>
    )
}
