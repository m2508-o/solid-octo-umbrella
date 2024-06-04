import React, { useState } from 'react';
import '../App.css';

const ExportButtons = () => {
    const [exporting, setExporting] = useState({
        json: false,
        xml: false,
        txt: false,
        csv: false
    });

    const handleExport = (format) => {
        setExporting(prevState => ({ ...prevState, [format]: true }));
        const url = `http://localhost:5000/api/export/${format}`;
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `projects.${format}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                setExporting(prevState => ({ ...prevState, [format]: false }));
            })
            .catch(error => {
                console.error('Error exporting data:', error);
                setExporting(prevState => ({ ...prevState, [format]: false }));
            });
    };

    return (
        <div className="ExportButtons">
            <button className="json-button" onClick={() => handleExport('json')}>Eksportuj w JSON</button>
            {exporting.json && <progress className="export-progress" />}
            <button className="xml-button" onClick={() => handleExport('xml')}>Eksportuj w XML</button>
            {exporting.xml && <progress className="export-progress" />}
            <button className="txt-button" onClick={() => handleExport('txt')}>Eksportuj w TXT</button>
            {exporting.txt && <progress className="export-progress" />}
            <button className="csv-button" onClick={() => handleExport('csv')}>Eksportuj w CSV</button>
            {exporting.csv && <progress className="export-progress" />}
        </div>
    );
};

export default ExportButtons;
