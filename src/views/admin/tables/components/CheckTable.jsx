import React, { useMemo } from "react";
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import Checkbox from "components/checkbox";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PDFDocumentProxy } from 'pdfjs-dist';

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const PDFFile = "";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const CheckTable = (props) => {
  const { columnsData, tableData,currentTitle } = props;
 
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [pageNum,setpageNum] = React.useState(0);


  const toggleDrawer = () => {
      setIsOpen((prevState) => !prevState)
  }
  const initialState = {
    pageSize: 40, // Number of rows per page
  };
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  
  );
 
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
   
  } = tableInstance;

  const [file, setFile] = React.useState();
  //const [file, setFile] = React.useState("");
  const [numPages, setNumPages] = React.useState();
  const [varStyle,setvarStyle] = React.useState({});
  const [ valStyle,setvalStyle] = React.useState({});
 
  function UploadFile(file,page,variablebox,variablevalue,width,height){
   let pageLeft = variablebox[0][0];
   let pageTop = variablebox[0][1];
   let percLeft = (pageLeft/width) * 100;
   percLeft = percLeft.toFixed(2) +"%";
   let percTop = (pageTop/height) * 100;
   percTop = percTop.toFixed(2) +"%";
  let varWidth = variablebox[1][0] - pageLeft;
   varWidth = (varWidth/width)* 100;
   varWidth = varWidth.toFixed(2)+"%";
 
   let varHeight = variablebox[2][1]-variablebox[0][1];
   varHeight = (varHeight/height)*100;
   varHeight = varHeight.toFixed(2)+"%";
  
   let pageLeftval = variablevalue[0][0];
   let pageTopval = variablevalue[0][1];
   let percLeftval = (pageLeftval/width) * 100;
   percLeftval = percLeftval.toFixed(2) +"%";

   let percTopval = (pageTopval/height) * 100;
   console.log(percTopval)
   percTopval = percTopval.toFixed(2) +"%";

  let varWidthval = variablevalue[1][0] - pageLeftval;
  varWidthval = (varWidthval/width)* 100;
  varWidthval = varWidthval.toFixed(2)+"%";
 
   let varHeightval = variablevalue[2][1]-variablevalue[0][1];
   varHeightval = (varHeightval/height)*100;
   varHeightval = varHeightval.toFixed(2)+"%";

   let sttv = {
    position: 'absolute',
    top: percTopval,
    left: percLeftval,
    width: varWidthval, 
    height: varHeightval,
    backgroundColor: 'red',
    opacity: 0.5,
  }

   let stt = {
    position: 'absolute',
    top: percTop,
    left: percLeft,
    width: varWidth, 
    height: varHeight,
    backgroundColor: 'red',
    opacity: 0.5,
  }
  setvarStyle(stt);
  setvalStyle(sttv);
   onFileChange(file);
   setpageNum(page+1);
   toggleDrawer();
   
  }

  function onFileChange(event){
    const files  = event;
    console.log(files)
    const secondSlashIndex = files.indexOf("//", files.indexOf("//") + 2);
  const substringAfterSecondSlash = files.substring(secondSlashIndex + 2);
    setFile("http://127.0.0.1:8080//"+substringAfterSecondSlash);
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
   
    setNumPages(nextNumPages);
  }
  return (<>
    <Card extra={"w-full sm:overflow-auto p-4"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          {currentTitle}
        </div>

        <CardMenu />
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table
          {...getTableProps()}
          className="w-full"
          variant="simple"
          color="gray-500"
          mb="24px"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b border-gray-200 pr-16 pb-[10px] text-start dark:!border-navy-700"
                    key={index}
                  >
                    <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
             
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "Name") {
                      data = (
                        <div className="flex items-center gap-2">
                          <Checkbox />
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {cell.value[0]}
                            {cell.value[2]=="Unaudited"?<span class="inline-block rounded-full bg-blue-500 px-2 text-white text-xs">{cell.value[2]}</span>:""}
                            {cell.value[2]=="Audited"?<span class="inline-block rounded-full bg-green-500 px-2 text-white text-xs">{cell.value[2]}</span>:""}
                            {cell.value[3]?<span class="inline-block rounded-full bg-green-500 px-2 text-white text-xs">{cell.value[3]}</span>:""}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "Value") {
                      data = (
                        <div className="flex items-center">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {cell.value}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "Date") {
                      data = (
                        <a className="text-sm font-bold text-navy-700 dark:text-white">
                          {" "}
                          {cell.value}{" "} 
                        </a>
                      );
                    } 
                    else if (cell.column.Header === "Reported Date") {
                      data = (
                        <a className="text-sm font-bold text-navy-700 dark:text-white">
                          {" "}
                          {cell.value}{" "} 
                        </a>
                      );
                    }
                    else if (cell.column.Header === "Audit") {
                      data = (
                        <button class="rounded-full ..." onClick={() => UploadFile(cell.value[0],cell.value[1],cell.value[2],cell.value[3],cell.value[4],cell.value[5])}>View PDF</button>
                        
                      );
                    } 
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={index}
                        className="pt-[14px] pb-[16px] sm:text-[14px]"
                      >
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  
            <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction='bottom'
                className='h-2/5 overflow-scroll'
                size=""
            >
             {/*3269 777*/}
             {/*77px 30px*/}
            {/*h:684  w:468*/}
              <div>
                 <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options} >
                 <Page pageNumber={pageNum} scale={2}>
                 <div
                  style={varStyle}
                />
                <div style={valStyle}></div>
                  </Page>
          </Document>
          </div>
            </Drawer>
  </>
  
  );
};

export default CheckTable;
