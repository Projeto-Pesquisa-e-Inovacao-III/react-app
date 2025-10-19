import { Bar, BarChart, CartesianGrid, Label, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Chart({ data, type, title }: { data: any[]; type: 'bar' | 'line'; title?: string }) {
    return (
        <div className="chart-bar-personal">

            <h3 style={{ paddingLeft: '20px', fontWeight: 'bold' }}>
                {title}
            </h3>

            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 25 }}>
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
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
