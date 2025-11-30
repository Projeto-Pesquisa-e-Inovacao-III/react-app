import { Bar, BarChart, CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./chart.module.css"
import classNames from "classnames";
import useMobile from "../../../hooks/isMobile";


type Props = {
    data: any[];
    type: 'bar' | 'line';
    title?: string;
    titleY?: string;
    titleX?: string;
    legend?: string;
    ooffsetY: number;
};

export default function Chart({ data, type, title, titleY, titleX, legend, ooffsetY }: Props) {
    //here you may choose the appropriate chart component based on the 'type' prop
    //the chart config is almost the same for both types. what changes is the actual chart component used (BarChart or LineChart) 
    const ChartComponent = type === 'line' ? LineChart : BarChart;

    return (
        <div className={classNames(styles.chartBarPersonal, useMobile() && styles.chartBarPersonalMobile)}>

            <h3 style={{ paddingLeft: '20px', fontWeight: 'bold' }}>
                {title}
            </h3>

            <ResponsiveContainer>
                <ChartComponent data={data} margin={{ top: 30, right: 30, left: 30, bottom: 25 }}>

                     <Legend
                        verticalAlign="top"
                        align="center"
                        height={36}
                    />

                    <CartesianGrid vertical={false} stroke="#e0e0e0" />
                    
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => value.slice(0, 3)}
                    >
                        <Label
                            value="Meses"
                            offset={-20}
                            position="insideBottom"
                            style={{ textAnchor: "middle", fill: '#666' }}
                        />
                    </XAxis>

                    <YAxis axisLine={false} tickLine={false}>
                        <Label
                            value={titleY || "Numero de serviços"}
                            angle={-90}
                            position="insideLeft"
                            offset={-ooffsetY || 10}
                            style={{ textAnchor: "middle", fill: '#666' }}
                        />
                    </YAxis>

                    <Tooltip cursor={false} />

                    {type === 'line' && (
                        <Line
                            dataKey="servicos"
                            name={legend || "Serviços"}
                            stroke="#0F172A"
                            strokeWidth={2}
                            style={{ fontSize: '5px' }}
                        />
                    )}

                    {type === 'bar' && (
                        <Bar
                            dataKey="servicos"
                            name={legend || "Serviços"}
                            fill="#0F172A"
                            radius={[4, 4, 0, 0]}
                        />
                    )}
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
}
