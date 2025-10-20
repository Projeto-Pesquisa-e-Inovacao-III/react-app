import { Bar, BarChart, CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
    data: any[];
    type: 'bar' | 'line';
    title?: string;
};

export default function Chart({ data, type, title }: Props) {
    //here you may choose the appropriate chart component based on the 'type' prop
    //the chart config is almost the same for both types. what changes is the actual chart component used (BarChart or LineChart) 
    const ChartComponent = type === 'line' ? LineChart : BarChart;

    return (
        <div className="chart-bar-personal">

            <h3 style={{ paddingLeft: '20px', fontWeight: 'bold' }}>
                {title}
            </h3>

            <ResponsiveContainer>
                <ChartComponent data={data} margin={{ top: 30, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid vertical={false} stroke="#e0e0e0" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />

                    <YAxis axisLine={false} tickLine={false}>
                        <Label
                            value="Número de Serviços"
                            angle={-90}
                            position="insideLeft"
                            style={{ textAnchor: "middle", fill: '#666' }}
                        />
                    </YAxis>

                    <Tooltip cursor={false} />

                    <Legend verticalAlign="bottom" height={36}
                        wrapperStyle={{
                            borderRadius: "50%",
                            bottom: 15,
                        }} />

                    {type === 'line' && (
                        <Line
                            dataKey="servicos"
                            name="Serviços"
                            stroke="#0F172A"
                            strokeWidth={2}
                        />
                    )}

                    {type === 'bar' && (
                        <Bar
                            dataKey="servicos"
                            name="Serviços"
                            fill="#0F172A"
                            radius={[4, 4, 0, 0]}
                        />
                    )}
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
}
