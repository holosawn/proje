import * as React from "react"
import {
  Box,
  OutlinedInput,
  Button,
  CssBaseline,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import prepareData from "./PrepareData"
import { IconButton , styled} from "@mui/material"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import VirtualTable from "../ReUsableComponents/VirtualTable"
import { useNavigate } from 'react-router-dom'

const StyledButton = styled(Button)(({theme}) => ({
    border:"1px solid black",
    color:"black",
    margin:"0.3em",
    padding:0,
    [theme.breakpoints.up("xs")]: {
      height:"3rem",
      width:"6vw"
		},
    [theme.breakpoints.up("md")]: {
      height:"3rem",
      width:"16vw"
		},
		[theme.breakpoints.up("lg")]: {
      height:"6rem",
      width:"8.5em"
		},
		[theme.breakpoints.up("xl")]: {
      height:"6rem",
      width:"10em"
		},
}))

const DefectPage = () => {
  const navigate = useNavigate()
  const [data, setData] = useState("empty"); // state to store origin data
  const [temporaryData, setTemporaryData] = useState("empty"); // state to store processed data
  const [filterValues, setFilterValues] = useState({ //state to store filter values
    formattedBodyNo: "",
    formattedAssyNo: "",
  });
  const intervalRef = useRef(null); // state to store interval for scroll buttons 
  const tableRef = useRef();  //hook to hols Virtual Table

  useEffect(() => {
    // Make a request to login and then get user data
    axios
      .post("/login")
      .then(() => axios.get("/user"))
      .then((res) => {
        // Prepare the data using the prepareData function
        const temp = prepareData(res.data.DefectList.data[0]);
        setData(temp);
        setTemporaryData(temp.rows);
      });
  }, []);
  
  // Define the columns for the table
  const columns = [
    { field: "depCode", headerName: "Bildiren", minWidth: 56, align: "center" },
    { field: "formattedBodyNo", headerName: "Body", minWidth: 37, align: "center" },
    { field: "formattedAssyNo", headerName: "Assy", minWidth: 30, align: "center" },
    { field: "vinNo", headerName: "Vin", minWidth: 120, width: "12vw", align: "center" },
    { field: "colorData", headerName: "Renk", minWidth: 35, align: "center" },
    { field: "modelCode", headerName: "Mdl", minWidth: 35, align: "center" },
    { field: "termId", headerName: "Sicil", minWidth: 45, align: "center" },
    { field: "partName", headerName: "Parca", minWidth: 160, height: 45, color: "red", width: "15vw" },
    { field: "spotCode", headerName: "Spot", minWidth: 35, align: "center" },
    { field: "spotgunName", headerName: "Gun", minWidth: 50, align: "center" },
    { field: "arcnutboltgunName", headerName: "Arc", minWidth: 50 },
    { field: "arcnutboltCode", headerName: "ArcGun", minWidth: 60 },
    { field: "defectName", headerName: "Hata", minWidth: 160, width: "12vw" },
    { field: "defrankCode", headerName: "Rank", minWidth: 45 },
    { field: "formattedDefectHour", headerName: "Saat", minWidth: 60, align: "center" },
    { field: "defectType", headerName: "Hata Türü", minWidth: 60, align: "center" },
    { field: "defrespName", headerName: "Hata Sor", minWidth: 60, align: "center" },
    { field: "subResp", headerName: "Alt Sorumlu", minWidth: 60 },
    { field: "nrReasons", headerName: "NR REASONS", minWidth: 115, align: "center" },
    { field: "save", headerName: "Kaydet", minWidth: 40, align: "center" },
    { field: "action", headerName: "İşlem", minWidth: 63 },
  ];
  
  // Handle the change event for filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
  
      //changing filterValues
    setFilterValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  
  // Filter the data based on the filter values
  const filterData = (rows) => {
    const filterProperties = Object.keys(filterValues);
  
    // If data is empty, return an empty array
    if (data === "empty") return [];
  
    const filteredData = rows.filter((row) =>
      filterProperties.every((property) => {
        return property === "colorData" ?
          !filterValues[property] ||
          row[property].colorExtCode.toString().toLowerCase().includes(filterValues[property].colorExtCode.toLowerCase()) :
          !filterValues[property] ||
          row[property].toString().toLowerCase().includes(filterValues[property].toLowerCase());
      })
    );
    return filteredData;
  };// Remove a row from the data based on the provided rowId
  const removeRow = (rowId) => {
    setData((prevData) => {
      const updatedRows = [...prevData.rows];
      const indexOfRemove = updatedRows.findIndex((obj) => obj.id === rowId);
  
      updatedRows.splice(indexOfRemove, 1);
      setTemporaryData(filterData(updatedRows));
  
      return {
        ...prevData,
        rows: updatedRows,
      };
    });
  }
  
      // Handle the mouse click event for scrolling the table
  const handleMouseClick = (direction) => {
    if (tableRef.current) {
      tableRef.current.scrollBy({
        top: direction === "up" ? -64 : 64,
        behavior: "smooth",
      });
    }
  }
  
  // Handle the mouse down event for continuous scrolling of the table
  const handleMouseDown = (direction) => {
    if (tableRef.current) {
      const scrollStep = direction === "up" ? -16 : 16;
  
      let scrollInterval = setInterval(() => {
        const newScrollTop = tableRef.current.scrollTop + scrollStep;
        tableRef.current.scrollTop = newScrollTop;
      }, 16);
  
      intervalRef.current = scrollInterval;
    }
  }
  
  // Handle the mouse up event to stop continuous scrolling
  const handleMouseUp = () => {
    clearInterval(intervalRef.current);
  }


  return data === "empty" ? (
    <h1>Loading...</h1>
  ) : (
    <Paper style={{ height: "80vh", width: "100%", padding: 0, margin: 0, backgroundColor: "#c6ffc8" }}>
      <CssBaseline />
  
      {/*Rendering Virtual Table*/}
      <VirtualTable
        columns={columns}
        data={temporaryData}
        nrReasonList={data.nrReasonList}
        ref={tableRef}
        setData={setData}
      />
  
      <Box sx={{ display: "flex", justifyContent: "center", backgroundColor: "white" }}>
        <Box sx={{ display: "flex", flexDirection: "column-reverse", justifyContent: "center", mr: 1 }}>

          {/* Filter by Body No */}
          <Box sx={{ display: "flex", alignItems: "center", margin: 0 }}>
            <Typography sx={{ color: "black", width: "7em", fontWeight: 700 }}>
              BODY NO
            </Typography>
            <OutlinedInput
              sx={{ width: { xs: "5em", md: "8em" } }}
              size="small"
              type="text"
              id="formattedBodyNo"
              name="formattedBodyNo"
              value={filterValues.formattedBodyNo}
              onChange={handleFilterChange}
            />
            <Button
              sx={{ border: "1px solid black", color: "black", width: "6em" }}
              onClick={() => setTemporaryData(filterData(data.rows))}
            >
              ARA
            </Button>
          </Box>
  
          {/* Filter by Assy No */}
          <Box sx={{ display: "flex", alignItems: "center", margin: 0 }}>
            <Typography sx={{ color: "black", width: "7em", fontWeight: 700 }}>
              MONTAJ NO
            </Typography>
            <OutlinedInput
              sx={{ width: { xs: "5em", md: "8em" } }}
              size="small"
              type="text"
              id="formattedAssyNo"
              name="formattedAssyNo"
              value={filterValues.formattedAssyNo}
              onChange={handleFilterChange}
            />
            <Button
              sx={{ border: "1px solid black", color: "black", width: "6em" }}
              onClick={() => setTemporaryData(filterData(data.rows))}
            >
              ARA
            </Button>
          </Box>
        </Box>
  
        {/* Scroll Buttons */}
        <Box sx={{ display: "flex", flexDirection: "column", margin: 1, flexWrap: "wrap" }}>
          {/* Scroll Up Button */}
          <Box sx={{ backgroundColor: "red", borderRadius: "0.2em", marginBlockStart: 1 }}>
            <IconButton
              sx={{ width: "3.5em", height: "1.6em" }}
              color="secondary"
              onMouseDown={() => handleMouseDown("up")}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => handleMouseClick("up")}
            >
              <KeyboardArrowUpIcon />
            </IconButton>
          </Box>
  
          {/* Scroll Down Button */}
          <Box sx={{ backgroundColor: "red", borderRadius: "0.2em", marginBlockStart: 0.2 }}>
            <IconButton
              sx={{ width: "3.5em", height: "1.6em" }}
              color="secondary"
              onMouseDown={() => handleMouseDown("down")}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => handleMouseClick("down")}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
        </Box>
  
        {/* Navigation Buttons */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, justifyContent: "center" }}>
          {/* First Row of Buttons */}
          <Box sx={{ flexDirection: "row" }}>
            <StyledButton>
              ARAÇ LİSTESİ
            </StyledButton>
            <StyledButton>
              MANUAL HATA
            </StyledButton>
            <StyledButton>
              ÇOKLU HATA
            </StyledButton>
          </Box>
  
          {/* Second Row of Buttons */}
          <Box sx={{ flexDirection: "row" }}>
            <StyledButton>
              HATA LİSTESİ
            </StyledButton>
            <StyledButton>
              HATA KOPYA
            </StyledButton>
            <StyledButton onClick={() => navigate("/")}>
              ÇIKIŞ
            </StyledButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default DefectPage;
