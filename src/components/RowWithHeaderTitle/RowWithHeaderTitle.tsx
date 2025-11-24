import classNames from 'classnames'
import styles from './RowWithHeaderTitle.module.css'
import React from 'react'
import SmallerButton from '../SmallerButton'


type RowWithHeaderTitleProps = {
    data: Array<{
        headerTitle: string,
        title: string,
        subtitle: string
    }>,
    includeDetailsButton?: boolean,
    buttonLabel?: string,
    handleDetailsClick?: () => void
}

export default function RowWithHeaderTitle(props: RowWithHeaderTitleProps) {
    return (
        <>
            {props.data.map((plan: any, index: number) => (
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
                            <div className={classNames(styles.rowButton)} onClick={() => props.handleDetailsClick(plan.id)}>
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
