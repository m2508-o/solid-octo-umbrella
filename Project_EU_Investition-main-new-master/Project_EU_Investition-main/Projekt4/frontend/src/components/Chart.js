import React, { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, LabelList } from 'recharts';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import moment from 'moment';
import { scaleLog, scaleLinear } from 'd3-scale';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import { js2xml } from 'xml-js';

// Funkcja generowania lat.
const generateYearOptions = () => {
    const years = [];
    for (let year = 2020; year <= 2030; year++) {
        years.push(<option key={year} value={year}>{year}</option>);
    }
    return years;
};

// Konwersja danych do formatu XML.
const convertToXML = (data) => {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const xml = js2xml({ root: { item: data } }, options);
    return xml;
};

// Konwersja danych do formatu TXT.
const convertToTXT = (data) => {
    let txt = '';
    data.forEach((item) => {
        txt += `${JSON.stringify(item)}\n`;
    });
    return txt;
};

// Main ProjectCharts component
const ProjectCharts = () => {
    const [barData, setBarData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [startYear, setStartYear] = useState(2020);
    const [endYear, setEndYear] = useState(2030);
    const [activeCategories, setActiveCategories] = useState([]);
    const [loadingBarChart, setLoadingBarChart] = useState(false);
    const [loadingLineChart, setLoadingLineChart] = useState(false);
    const [sliderRange, setSliderRange] = useState([moment('2014-01-01').valueOf(), moment('2026-06-01').valueOf()]);
    const [scaleType, setScaleType] = useState('linear');
    const [showDataLabels] = useState(false);
    const [theme, setTheme] = useState('light');

    const minDate = moment('2014-01-01').valueOf();
    const maxDate = moment('2026-06-01').valueOf();
    const step = moment.duration(1, 'months').asMilliseconds();

    const fetchBarChartData = useCallback(async () => {
        setLoadingBarChart(true);
        try {
            const startDate = `${startYear}-01-01`;
            const endDate = `${endYear}-12-31`;

            const response = await axios.get('http://localhost:5000/api/chart-data', {
                params: {
                    startDate,
                    endDate
                }
            });
            const chartData = response.data;

            const groupedData = chartData.reduce((acc, curr) => {
                const { wojewodztwo, category, value } = curr;
                if (!acc[wojewodztwo]) {
                    acc[wojewodztwo] = { name: wojewodztwo };
                }
                acc[wojewodztwo][category] = value;
                return acc;
            }, {});

            const finalData = Object.values(groupedData);
            setBarData(finalData);

            const uniqueCategories = [...new Set(chartData.map(item => item.category))];
            setCategories(uniqueCategories);
            setActiveCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching bar chart data', error);
        } finally {
            setLoadingBarChart(false);
        }
    }, [startYear, endYear]);

    const fetchLineChartData = useCallback(async () => {
        setLoadingLineChart(true);
        try {
            const response = await axios.get('http://localhost:5000/api/line-chart-data');
            const lineChartData = response.data;

            const groupedLineData = lineChartData.reduce((acc, curr) => {
                const date = moment(curr.date).startOf('month').format('YYYY-MM');
                if (!acc[date]) {
                    acc[date] = { date, totalProjectValuePLN: 0, euCoFinancingPLN: 0 };
                }
                acc[date].totalProjectValuePLN += curr.totalProjectValuePLN;
                acc[date].euCoFinancingPLN += curr.euCoFinancingPLN;
                return acc;
            }, {});

            const finalLineData = Object.values(groupedLineData);
            setLineData(finalLineData);
        } catch (error) {
            console.error('Error fetching line chart data', error);
        } finally {
            setLoadingLineChart(false);
        }
    }, []);

    useEffect(() => {
        fetchBarChartData();
        fetchLineChartData();
    }, [fetchBarChartData, fetchLineChartData]);

    const colors = {
        "Edukacja": "#8884d8",
        "Energetyka": "#82ca9d",
        "Badania i Innowacje": "#8dd1e1",
        "Zdrowie": "#ffc658",
        "Transport": "#d0ed57",
        "Społeczeństwo": "#a4de6c",
        "Środowisko": "#d0ed57",
        "Kultura i Turystyka": "#ff8042",
        "Administracja": "#83a6ed",
        "Bezpieczeństwo": "#8a2be2",
        "Gospodarka Morska": "#ff7300",
        "Łączność i Infrastruktura": "#00c49f"
    };

    const handleStartYearChange = (e) => {
        setStartYear(parseInt(e.target.value));
    };

    const handleEndYearChange = (e) => {
        setEndYear(parseInt(e.target.value));
    };

    const handleCheckboxChange = (category) => {
        setActiveCategories(prevActiveCategories =>
            prevActiveCategories.includes(category)
                ? prevActiveCategories.filter(c => c !== category)
                : [...prevActiveCategories, category]
        );
    };

    const handleSelectAll = () => {
        setActiveCategories(categories);
    };

    const handleSelectNone = () => {
        setActiveCategories([]);
    };

    const handleSliderChange = (value) => {
        setSliderRange(value);
    };

    const handleScaleChange = (e) => {
        setScaleType(e.target.value);
    };

    const formatDate = (timestamp) => moment(timestamp).format('YYYY-MM');

    const filteredLineData = lineData.filter(item => {
        const timestamp = moment(item.date).valueOf();
        return timestamp >= sliderRange[0] && timestamp <= sliderRange[1];
    });

    const renderLegend = () => {
        return (
            <div className="custom-legend">
                <div style={{ marginBottom: 10 }}>
                    <Button variant="outline-success" onClick={handleSelectAll} style={{ marginRight: 10 }}>Wszystkie</Button>
                    <Button variant="outline-danger" onClick={handleSelectNone}>Żadne</Button>
                </div>
                {categories.map((category, index) => (
                    <div key={`item-${index}`} style={{ marginBottom: 5 }}>
                        <input
                            type="checkbox"
                            checked={activeCategories.includes(category)}
                            onChange={() => handleCheckboxChange(category)}
                        />
                        <span style={{ color: activeCategories.includes(category) ? colors[category] : '#AAA', marginLeft: 5 }}>
                            {category}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    // Handlers for exporting data
    const handleExportJSON = () => {
        const json = JSON.stringify(barData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        saveAs(blob, 'bar_chart_data.json');
    };

    const handleExportXML = () => {
        const xml = convertToXML(barData);
        const blob = new Blob([xml], { type: 'application/xml' });
        saveAs(blob, 'bar_chart_data.xml');
    };

    const handleExportTXT = () => {
        const txt = convertToTXT(barData);
        const blob = new Blob([txt], { type: 'text/plain' });
        saveAs(blob, 'bar_chart_data.txt');
    };

    return (
        <Container style={{ width: '100%', height: 'auto', position: 'relative', backgroundColor: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
            <Row className="my-3">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>Rok Początkowy</InputGroup.Text>
                        <Form.Control as="select" value={startYear} onChange={handleStartYearChange}>
                            {generateYearOptions()}
                        </Form.Control>
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>Rok Końcowy</InputGroup.Text>
                        <Form.Control as="select" value={endYear} onChange={handleEndYearChange}>
                            {generateYearOptions()}
                        </Form.Control>
                    </InputGroup>
                </Col>
            </Row>
            <div style={{ position: 'absolute', right: 0, top: 90, zIndex: 10, backgroundColor: theme === 'light' ? '#fff' : '#333', padding: '10px', borderRadius: '5px', color: theme === 'light' ? '#000' : '#fff' }}>
                {renderLegend()}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                <Button variant="outline-info" onClick={toggleTheme}>
                    Włącz tryb {theme === 'light' ? 'Ciemny' : 'Jasny'}
                </Button>
                <CSVLink data={barData} filename={"bar_chart_data.csv"} className="btn btn-outline-success" style={{
                    marginLeft: 10, backgroundColor: '#870536 ', color: 'white', border:
                        'none'
                }}>Eksportuj w CSV</CSVLink>
                <Button variant="outline-success" onClick={handleExportJSON} style={{
                    marginLeft: 10, backgroundColor: 'cornflowerblue', color: 'white', border:
           'none'}}>Eksportuj w JSON</Button>
                <Button variant="outline-success" onClick={handleExportXML} style={{
                    marginLeft: 10, backgroundColor: '#2A6C4F' , color: 'white', border:
                        'none'
                }}>Eksportuj w XML</Button>
                <Button variant="outline-success" onClick={handleExportTXT} style={{
                    marginLeft: 10, backgroundColor: '#EF4800', color: 'white', border:
                        'none'
                }}>Eksportuj w TXT</Button>
            </div>
            {loadingBarChart ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spinner animation="border" role="status">
                        <span className="sr-only"></span>
                    </Spinner>
                    <span style={{ marginLeft: 10 }}>Ładowanie...</span>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={barData}
                        margin={{
                            top: 60,
                            right: 200,
                            left: 20,
                            bottom: 80,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={80}
                            tick={{ fontSize: 12, fill: theme === 'light' ? '#000' : '#fff' }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${(value / 1_000_000).toFixed(2)} mln`}
                            tick={{ fill: theme === 'light' ? '#000' : '#fff' }}
                        />
                        <Tooltip
                            formatter={(value) => `${(value / 1_000_000).toFixed(2)} mln`}
                        />
                        <text x="50%" y="20" textAnchor="middle" dominantBaseline="central" className="chart-title" style={{ fontSize: '24px', fill: theme === 'light' ? '#000' : '#fff' }}>
                            Wykres kosztów realizowanych inwestycji z podziałem na województwa
                        </text>
                        {categories.map((category, index) => (
                            activeCategories.includes(category) && (
                                <Bar key={index} dataKey={category} stackId="a" fill={colors[category]}>
                                    {showDataLabels && <LabelList dataKey={category} position="top" />}
                                </Bar>
                            )
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            )}
            <div style={{ marginTop: 50, textAlign: 'center' }}>
                <h4 style={{ fontSize: '24px' }}>Wykres kosztów realizowanych inwestycji w czasie</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{formatDate(sliderRange[0])}</span>
                    <div style={{ width: '70%' }}>
                        <Slider
                            range
                            min={minDate}
                            max={maxDate}
                            defaultValue={sliderRange}
                            onChange={handleSliderChange}
                            step={step}
                            marks={{
                                [minDate]: '2014-01',
                                [maxDate]: '2026-06',
                            }}
                        />
                    </div>
                    <span>{formatDate(sliderRange[1])}</span>
                </div>
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form.Check
                    type="radio"
                    label="Skala liniowa"
                    name="scaleType"
                    value="linear"
                    checked={scaleType === 'linear'}
                    onChange={handleScaleChange}
                    style={{ marginRight: 10 }}
                />
                <Form.Check
                    type="radio"
                    label="Skala logarytmiczna"
                    name="scaleType"
                    value="log"
                    checked={scaleType === 'log'}
                    onChange={handleScaleChange}
                />
            </div>
            {loadingLineChart ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Spinner animation="border" role="status">
                        <span className="sr-only"></span>
                    </Spinner>
                    <span style={{ marginLeft: 10 }}>Ładowanie...</span>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={filteredLineData}
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
                            tickFormatter={(date) => moment(date).format('YYYY-MM')}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fill: theme === 'light' ? '#000' : '#fff' }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)} mln`}
                            domain={scaleType === 'log' ? [1, 'auto'] : ['auto', 'auto']}
                            scale={scaleType === 'log' ? scaleLog().base(10) : scaleLinear()}
                            tick={{ fill: theme === 'light' ? '#000' : '#fff' }}
                        />
                        <Tooltip
                            labelFormatter={(label) => moment(label).format('YYYY-MM')}
                            formatter={(value) => `${(value / 1_000_000).toFixed(1)} mln`}
                        />
                        <Line
                            type="monotone"
                            dataKey="totalProjectValuePLN"
                            name="Całkowita wartość projektu (PLN)"
                            stroke="#8884d8"
                        />
                        <Line
                            type="monotone"
                            dataKey="euCoFinancingPLN"
                            name="Współfinansowanie UE (PLN)"
                            stroke="#82ca9d"
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Container>
    );
};

export default ProjectCharts;
