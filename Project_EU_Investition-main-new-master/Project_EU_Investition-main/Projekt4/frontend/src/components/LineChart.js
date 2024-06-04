import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Container, Spinner } from 'react-bootstrap';

export default function EuroExchangeRateChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/line-chart-data');
            const lineChartData = response.data;

            console.log("Line Chart Data from API:", lineChartData);
            setData(lineChartData);
        } catch (error) {
            console.error('Error fetching line chart data', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <Container style={{ width: '100%', height: 600, position: 'relative' }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    <span style={{ marginLeft: 10 }}>Loading...</span>
                </div>
            ) : (
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        margin={{
                            top: 60,
                            right: 30,
                            left: 20,
                            bottom: 60,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => new Date(date).toLocaleDateString()}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value.toFixed(2)} PLN`} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(2)} PLN`} />
                        <Tooltip labelFormatter={(label) => new Date(label).toLocaleDateString()} />
                        <Line yAxisId="left" type="monotone" dataKey="totalProjectValuePLN" stroke="#8884d8" />
                        <Line yAxisId="right" type="monotone" dataKey="euFunding" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Container>
    );
}
