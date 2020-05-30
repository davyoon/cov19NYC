import React, { useEffect } from 'react';
import { render } from 'react-dom';
import Header from './components/header.js';
import CaseContainer from './components/caseContainer.js';
import FilterForm from './components/filterForm.js';
import Pagination from './components/pagination.js';
import Footer from './components/footer.js';
import Map from './components/map.js';
const axios = require('axios');
import './styles/app.scss';


const App = () => {
     console.log(React)
     const [covidData, setCovidData] = React.useState([]);
     const [sort, setSort] = React.useState("zip");
     const [showPerPage, setSortPerPage] = React.useState(20);
     const [currentPage, setCurrentPage] = React.useState(1);
     const [currentTab, setCurrentTab] = React.useState("table-tab");

     useEffect(() => {
          axios.get('api/covid')
               .then(res => {
                    setCovidData(res.data);
               });         
     }, []);

     function handleChange(sortBy) {
          setSort(sortBy);
          setCurrentPage(1);
     }

     function handlePagination(page) {
          setCurrentPage(page);
     }

     function handleToggle(tab) {
          setCurrentTab(tab);
     }

     let sorted, data;

     //sort whether data will be shown by zip or positive cases
     if(sort === "zip"){
          sorted = covidData;
     } else {
          sorted = covidData.slice().sort((a,b) => {
               return b.positive - a.positive;
          });
     }

     //determine how the data will be split for each page
     data = sorted.slice(showPerPage * currentPage - showPerPage, showPerPage * currentPage)

     //determine which component to show depending on which tab is clicked
     let main;
     if(currentTab === "table-tab"){
          main = <main>
                    <div className="container">
                         <CaseContainer cases={data} showPerPage={showPerPage} currentPage={currentPage} />
                         <Pagination onPageChange={handlePagination} showPerPage={showPerPage} dataLength={covidData.length} currentPage={currentPage} />
                    </div>
                    <FilterForm onDropDownChange={handleChange} sort={sort} />
                 </main>
     } else {
          main = <main>
                    <Map covidData={covidData} />
                 </main>
     }

     return (
          <div>
               <Header handleToggle={handleToggle}/>
                    {main}
               <Footer />
          </div>
          )
}

render(<App />, document.getElementById('app'));
