import React, { useState, useEffect }  from "react";
import CheckTable from "./components/CheckTable";
import Card from "../../../components/card";
import { useSelector, useDispatch } from 'react-redux';
import { compareAsc, format } from "date-fns";
import { toLocaleDateString } from 'date-fns';
import { increment, decrement,getCompany,getAnnualQuarterly} from "./../../../redux/companyDetails/companySlicer"
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "./variables/columnsData";
import tableDataDevelopment from "./variables/tableDataDevelopment.json";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataColumns from "./variables/tableDataColumns.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import DevelopmentTable from "./components/DevelopmentTable";
import ColumnsTable from "./components/ColumnsTable";
import ComplexTable from "./components/ComplexTable";
import axios from 'axios';
const Tables = () => {
  const dispatch = useDispatch();
  const [tabAQ,settabAQ] = useState(["Q1","Q2","Q3","Annual"])
  const [AnnualQuarterly, setAnnualQuarterly] = useState([]);
  const [MainData,setMainData] = useState([]);
  const [CurrentYear,setCurrentYear] = useState(2023);
  const [AllStatements,setAllStatements]= useState([]);
  const [CurrentStatement,setCurrentStatement] =useState("");
  const [CurrentAnnualQuarter,setCurrentAnnualQuarter]= useState(true);
  const [CurrentVariables, setCurrentVariables] = useState([]);
  const [tableDataCheck,settableDataCheck] = useState([]);
  const [selectedLiId, setSelectedLiId] = useState(null);
  const [selectedAHLiId, setSelectedAHLiId] = useState(null);
  const [selectedStateLiId, setSelectedStateLiId] = useState(null);
  const columnsDataCheck = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Value",
      accessor: "value",
    },
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "Audit",
      accessor:"audit"
    }
   
  ];


  const getVariablesOfStatements = (item,id)=>{
    setSelectedStateLiId(id);
    setCurrentStatement(item);
    let midCurrentVariables = []
 
  MainData.symbols.forEach(obj => {
   
    let getYear = new Date(obj.Statementdate).getFullYear();
    let isAnnual = obj.period;
    let resultStatement = obj.statement;
    let status = obj.status;
   
    if(getYear==CurrentYear && CurrentAnnualQuarter==isAnnual && resultStatement==item && status=="Processed"){
      let newDate = new Date(obj.date)
      let formattedDate= format(newDate, "dd-MMMM-yyyy");
      
      midCurrentVariables.push({"name":[obj.alias,false,obj.AuditedUnaudited,obj.variablePeriod],"value":obj.value,"date":formattedDate,"audit":[obj.pdf,obj.page,obj.variablebox,obj.valuebox,obj.width,obj.height],"auditedUnaudited":obj.AuditedUnaudited,"variablePeriod":obj.variablePeriod});
      
    }
  });
  console.log(midCurrentVariables);
  settableDataCheck(midCurrentVariables);

  }



  const getStatements = (item,id)=>{
    setSelectedAHLiId(id);
    
    let midStatements = []
   
  setCurrentAnnualQuarter(item);
       
  MainData.symbols.forEach(obj => {
  
      let getYear = new Date(obj.Statementdate).getFullYear();
      
      let isAnnual = obj.period;
      if(getYear==CurrentYear && item==isAnnual){
        midStatements.push(obj.statement);

      }
    });
   
    midStatements = new Set(midStatements);
    midStatements = [...midStatements];
    setAllStatements(midStatements);
  }

  const getAnnualQuarterly=(item,id)=>{
  setSelectedLiId(id);
  console.log("CHECK",selectedLiId)
  setCurrentYear(item);
  let  midtabQA = [];
  
  axios.get(`http://20.197.15.58/api/v1/symbol/`+count.company[0].Symbol+"/"+item)
      .then(({ data }) => {
       
        data.symbols.forEach(obj => {
          // Process existing properties (e.g., capitalize names)
          let getMonth = new Date(obj.Statementdate).getMonth();
          let AnnualQuarterly = obj.period
          console.log(getMonth)
          if(AnnualQuarterly=="Annual")
          {
            midtabQA.push("Annual");
            
          }
          if(AnnualQuarterly=="Q1")
          {
            midtabQA.push("Q1");
           
          }
          if(AnnualQuarterly=="Q2")
          {
            midtabQA.push("Q2");
           
          }
          if(AnnualQuarterly=="Q3")
          {
            midtabQA.push("Q3");
           
          }
          
        });
        setMainData(data)
        midtabQA = new Set(midtabQA)
        midtabQA = [...midtabQA]
        
        settabAQ(midtabQA)
       
    });
  

}
  const count = useSelector((state) => state.counter.currentCompany);
  
  return (
    <div className="max-h-52 scroll-smooth ">

<Card extra={"items-center flex-col w-full overflow-auto p-[16px] bg-cover mb-5"}>
      {/* Background and profile */}
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png)` }}
      >
        <div className="dark:!border-navy-700 absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
          <img
            className="h-full w-full rounded-full"
            src="data:image/jpeg;base64,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"
            alt=""
          />
        </div>
      </div>
 
      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-navy-700 text-xl font-bold dark:text-white">
        {count ? count.company[0].Name : 'Unknown'}
       
        </h4>
        <h5 className="text-base font-normal text-gray-600">{count ? count.company[0].Sector : 'Sector'}</h5>
      </div>
 
      {/* Post followers */}
      <p className="text-lg text-justify">{count ? count.company[0].CompanyProfile : 'CompanyProfile'}</p>
      <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-navy-700 text-2xl font-bold dark:text-white">
          {count ? count.company[0].MarketCap : 'MarketCap'}
          </h4>
          <p className="text-sm font-normal text-gray-600">Market Cap</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-navy-700 text-2xl font-bold dark:text-white">
          {count ? count.company[0].Shares : 'Shares'}
          </h4>
          <p className="text-sm font-normal text-gray-600">Shares</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-navy-700 text-2xl font-bold dark:text-white">
          {count ? count.company[0].FreeFloat : 'FreeFloat'}
          </h4>
          <p className="text-sm font-normal text-gray-600">Free Float</p>
        </div>
      </div>
      <div>
 
  <div class="mt-6 border-t border-gray-100">
    <dl class="divide-y divide-gray-100">
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-600">CEO</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"> {count ? count.company[0].CEO : 'CEO'}</dd>
      </div>
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-600">Address</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{count ? count.company[0].Address : 'Address'}</dd>
      </div>
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-600">Chair Person</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{count ? count.company[0].Chairperson : 'Chairperson'}</dd>
      </div>
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-600">Company Secretary</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{count ? count.company[0].CompanySecretary : 'CompanySecretary'}</dd>
      </div>
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6 text-gray-600">Website</dt>
        <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"><a href={count ? count.company[0].Website : '#'} target="_blank" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">{count ? count.company[0].Website : 'Website'}</a></dd>
      </div>
    </dl>
  </div>
</div>
    </Card>
    <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
    <ul class="flex flex-wrap -mb-px w-full" >
      
    {count ? count.years.map((item, index) => (
        <li key={index} onClick={() => getAnnualQuarterly(item,index)} className={index === selectedLiId ? 'bg-blue-500 text-white font-bold inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}><a href="#">{item}</a></li>
      )):""}
        
    </ul>
    <ul class="flex flex-wrap -mb-px w-full">
      {tabAQ?tabAQ.map((item, index) => (
        <li class="me-3" key={index} onClick={() => getStatements(item,index)} className={index === selectedAHLiId ? 'bg-blue-500 text-white font-bold inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}><a href="#"  >{item}</a></li>
      )):""}
    </ul>
    <ul class="flex flex-wrap -mb-px w-full">
      {AllStatements?AllStatements.map((item, index) => (
        <li class="me-4" key={index}   onClick={() => getVariablesOfStatements(item,index)} className={index === selectedStateLiId ? 'bg-blue-500 text-white font-bold inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}><a href="#">{item}</a></li>
      )):""}
    </ul>
</div>
      <div className="flex w-full flex-col gap-5">
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} currentTitle={CurrentStatement} />
      </div>

     
      </div>
 
  );
};

export default Tables;
