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
      Header: "Reported Date",
      accessor: "reporteddate",

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
   
    let getYear = new Date(obj.date).getFullYear();
    let isAnnual = obj.period;
    let resultStatement = obj.statement;
    let status = obj.status;
   
    if(getYear==CurrentYear && CurrentAnnualQuarter==isAnnual && resultStatement==item && status=="Processed"){
      let newDate = new Date(obj.date);
      let StatementnewDate = new Date(obj.Statementdate);
      let formattedDate= format(newDate, "dd-MMMM-yyyy");
      let formattedStatementDate = format(StatementnewDate, "dd-MMMM-yyyy");
      midCurrentVariables.push({"reporteddate":formattedStatementDate,"name":[obj.alias,false,obj.AuditedUnaudited,obj.variablePeriod],"value":obj.value,"date":formattedDate,"audit":[obj.pdf,obj.page,obj.variablebox,obj.valuebox,obj.width,obj.height],"auditedUnaudited":obj.AuditedUnaudited,"variablePeriod":obj.variablePeriod});
     
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
  
      let getYear = new Date(obj.date).getFullYear();
      
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
  
  axios.get(`https://docanswers.org/api/v1/symbol/`+count.company[0].Symbol+"/"+item)
      .then(({ data }) => {
       
        data.symbols.forEach(obj => {
          // Process existing properties (e.g., capitalize names)
          let getMonth = new Date(obj.date).getMonth();
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
      {/* <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png)` }}
      >
        <div className="dark:!border-navy-700 absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-blue-400">
          <img
            className="h-full w-full rounded-full"
            src='data:image/png;base64,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'
            alt=""
          />
        </div> 
      </div> */}
 
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
        <dt class="text-sm font-medium leading-6">CEO</dt>
        <dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0"> {count ? count.company[0].CEO : 'CEO'}</dd>
      </div>
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6">Address</dt>
        <dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{count ? count.company[0].Address : 'Address'}</dd>
      </div>
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6">Chair Person</dt>
        <dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{count ? count.company[0].Chairperson : 'Chairperson'}</dd>
      </div>
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6">Company Secretary</dt>
        <dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">{count ? count.company[0].CompanySecretary : 'CompanySecretary'}</dd>
      </div>
      <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt class="text-sm font-medium leading-6">Website</dt>
        <dd class="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0"><a href={count ? 'https://'+count.company[0].Website : '#'} target="_blank" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">{count ? count.company[0].Website : 'Website'}</a></dd>
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
