import React, { useState } from 'react';
import Papa from 'papaparse';
import moment from 'moment';

const App = () => {
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (parsedData) => {
        setData(parsedData.data);
      calculateCommonProjects(parsedData.data);

      }
    });
  };

  const calculateCommonProjects = (employeeData) => {
    const result = [];
    for (let i = 0; i < employeeData.length - 1; i++) {
  
      for (let j = i + 1; j < employeeData.length; j++) {
        const emp1 = employeeData[i];
        const emp2 = employeeData[j];
        if(emp1.DateTo === 'NULL'){
          emp1.DateTo=moment().format('YYYY-MM-DD')
          }
  
        if (emp1.ProjectID === emp2.ProjectID) {
          const startDate = moment.max(
            moment(emp1.DateFrom, 'YYYY-MM-DD'),
            moment(emp2.DateFrom, 'YYYY-MM-DD')
          );
  
          let endDate;
 
       
          if (emp1.DateTo && emp2.DateTo) {
            endDate = moment.min(
              moment(emp1.DateTo, 'YYYY-MM-DD'),
              moment(emp2.DateTo, 'YYYY-MM-DD')
            );
          } else {
            endDate = moment();
          }
          if (startDate.isAfter(endDate)) {
            continue;
          }


          const days = endDate.diff(startDate, 'days') + 1;
          result.push({
            emp1: emp1.EmpID,
            emp2: emp2.EmpID,
            project: emp1.ProjectID,
            days
          });
        }
      }
    }
    setResult(result);
  };
  
  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <table>
        <thead>
          <tr>
            <th>Employee ID #1</th>
            <th>Employee ID #2</th>
            <th>Project ID</th>
            <th>Days worked</th>
          </tr>
        </thead>
        <tbody>
          {result.map((item, index) => (
            <tr key={index}>
              <td>{item.emp1}</td>
              <td>{item.emp2}</td>
              <td>{item.project}</td>
              <td>{item.days}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
