import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes, BrowserRouter as  Navigate } from 'react-router-dom';
import Home from './components/Home';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import Login from './components/Login';
import Register from './components/Register';
import NavigationBar from './components/NavigationBar';
import ProjectValueChart from './components/Chart';
import ExportButtons from './components/ExportButtons';  

function App() {
    const user = localStorage.getItem('token');

    const [projects, setProjects] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [location, setLocation] = useState('Wszystkie');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/projects?page=${currentPage}&limit=100&category=${category}&location=${location}&sortField=${sortField}&sortOrder=${sortOrder}`);
                setProjects(response.data.projects);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching projects', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/type`);
                if (response.data) {
                    setCategories(response.data);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchProjects();
        fetchCategories();
    }, [currentPage, category, location, sortField, sortOrder]);

    return (
        <div>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Home />} />
                {user && <Route path="/projectlist" element={
                    <div>
                        <ExportButtons /> 
                        <ProjectList
                            projects={projects}
                            setProjects={setProjects}
                            setCurrentPage={setCurrentPage}
                            setCategory={setCategory}
                            setLocation={setLocation}
                            setSortField={setSortField}
                            setSortOrder={setSortOrder}
                            categories={categories}
                            sortField={sortField}
                            sortOrder={sortOrder}
                            totalPages={totalPages}
                        />
                    </div>
                } />}
                {user && <Route path="/projects/:id" element={<ProjectDetail projects={projects} />} />}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {user && <Route path="/charts" element={<ProjectValueChart />} />}
                {user && <Route path="/project-value-chart" element={<ProjectValueChart />} />}
                <Route path="/charts" element={<Navigate replace to="/" />} />
                <Route path="/project-value-chart" element={<Navigate replace to="/" />} />
                <Route path="/projectlist" element={<Navigate replace to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
