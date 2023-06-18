import { useState, useEffect} from "react"
import * as React from "react"
import SaveIcon from '@mui/icons-material/Save'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import {Box,Button, IconButton, Typography, OutlinedInput} from "@mui/material"
import { TableVirtuoso } from "react-virtuoso"
import TableSortLabel from '@mui/material/TableSortLabel'
import { forwardRef } from "react"
import SearchIcon from '@mui/icons-material/Search'

const VirtualTable = forwardRef(({ columns, data, nrReasonList }, tableRef) => {

  const [filteredProperty, setFilteredProperty] = useState() // State for tracking the currently filtered property
  const [temporaryData, setTemporaryData] = useState([...data]) // State for storing the filtered data temporarily
  const [filterValues, setFilterValues] = useState({
    // State for storing filter values for different properties
    depCode: "",
    formattedBodyNo: "",
    formattedAssyNo: "",
    vinNo: "",
    colorData: {
      colorExtCode: ""
    },
    modelCode: "",
    termId: "",
    partName: "",
    spotCode: "",
    spotgunName: "",
    arcnutboltCode: "",
    arcnutboltgunName: "",
    defectName: "",
    defRankCode: "",
    formattedDefectHour: "",
    defectType: "",
    defrespName: "",
    subResp: ""
  });
  const [columnSorted, setColumnSorted] = useState(() =>
    // State for tracking the sorting order of columns
    columns.reduce((obj, column) => {
      obj[column.field] = 0;
      return obj;
    }, {})
  )
  const [removedRows, setRemovedRows] = useState([]);
  const nonSortable = ['save', 'action', 'nrReasons']; // Array of non-sortable columns

  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.field}
            variant="head"
            align="center"
            sx={{
              backgroundColor: "#c6ffc8",
              minWidth: column.minWidth,
              width: column.width,
              margin: 0,
              padding: 0,
              fontSize: "0.9em",
              fontWeight: "700",
              minHeight: "20px",
              height: column.height,
              borderInlineEnd: "1px #4f4f4f solid",
            }}
          >
            {/* Check if the column is sortable */}
            {!nonSortable.includes(column.field) ? (
              <>
                {/* Display the column name with sorting functionality */}
                <TableSortLabel
                  active={Boolean(columnSorted[column.field])}
                  direction={columnSorted[column.field] === -1 ? 'asc' : 'desc'}
                  onClick={() => handleSortClick(column.field)}
                  sx={{ flexDirection: 'column' }}
                >
                  {column.headerName}
                </TableSortLabel>
  
                {/* Display search icon for the column */}
                <IconButton
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: (filterValues[column.field === "colorData" ? column.field.colorExtCode : column.field]) ? "red" : null
                  }}
                  onClick={() => {
                    setFilteredProperty(column.field);
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </>
            ) : (
              // If the column is non-sortable, just display the column name
              <div>{column.headerName}</div>
            )}
  
            {/* Render search box for the filtered column */}
            {filteredProperty === column.field && (
              <Box sx={{
                position: "absolute",
                display: 'flex',
                justifyContent: 'center',
                marginBlockStart: 1.5,
                padding: 1,
                backgroundColor: "#99c99b",
                width: "300px",
                alignItems: "center"
              }}>
                <OutlinedInput
                  sx={{
                    width: { xs: "5em", md: "8em" },
                    backgroundColor: "white",
                    flex: 1,
                    height: '100%',
                    marginRight: 3,
                  }}
                  size="small"
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  name={column.field}
                  value={column.field === "colorData" ? filterValues[column.field.colorExtCode] : filterValues[column.field]}
                  onChange={handleFilterChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setTemporaryData([...filterData(data)]);
                      setFilteredProperty(null);
                    }
                  }}
                />
                {/* Render search button */}
                <Button
                  sx={{ border: "1px solid black", color: "black", backgroundColor: "red", ":hover": { backgroundColor: "red" } }}
                  onClick={() => {
                    setTemporaryData([...filterData(data)]);
                    setFilteredProperty(null);
                  }}
                >
                  SEARCH
                </Button>
              </Box>
            )}
          </TableCell>
        ))}
      </TableRow>
    );
  }
  function rowContent(index, row, nrReasonList) {
    return (
      <React.Fragment key={index}>
        {columns.map((column) => (
          <TableCell
            key={column.field}
            align={column.align}
            overflow="hidden"
            sx={{
              minWidth: column.minWidth,
              width: "10vw",
              border: "1px solid #4f4f4f",
              padding: 0,
              backgroundColor: row.depId == 94 ? "#c6ffc8" : "#C07F00",
              color: column.color === undefined ? "#302e2d" : column.color,
              fontSize: "0.8em",
              fontWeight: "600",
              height: column.height,
            }}
          >
            {(() => {
              if (column.field === "colorData") {
                // Render a colored box for the "colorData" column
                return (
                  <Box
                    sx={{
                      backgroundColor: row.colorData.rgbCode,
                      borderRadius: 1,
                      fontWeight: 700,
                    }}
                  >
                    {row.colorData.colorExtCode}
                  </Box>
                );
              } else if (column.field === "nrReasons") {
                // Render a dropdown select element for the "nrReasons" column
                return (
                  <select
                    defaultValue={""}
                    onChange={(e) => (row[column.field] = e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      width: "95%",
                      height: "1.5em",
                      fontSize: "0.7rem",
                    }}
                  >
                    <option value="" disabled hidden></option>
                    {nrReasonList.map((obj) => (
                      <option key={obj.nrId} value={obj.nrReasonAbb}>
                        {obj.nrReasonAbb}
                      </option>
                    ))}
                  </select>
                );
              } else if (column.field === "save") {
                // Render a "Save" button for the "save" column
                return (
                  <div style={{ width: "35px", margin: "auto" }}>
                    <Button
                      onClick={() => alert(row)}
                      sx={{
                        color: "white",
                        backgroundColor: "black",
                        height: "2em",
                        minWidth: "10px",
                        width: "35px",
                        padding: 0,
                        ":hover": {
                          color: "white",
                          backgroundColor: "#c4342d",
                        },
                      }}
                    >
                      <SaveIcon />
                    </Button>
                  </div>
                );
              } else if (column.field === "action") {
                // Render action buttons for the "action" column
                return (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <Button
                      sx={{
                        color: "white",
                        backgroundColor: "red",
                        height: "2em",
                        minWidth: "10px",
                        width: "30px",
                        ":hover": {
                          color: "white",
                          backgroundColor: "#010203",
                        },
                      }}
                    >
                      <CreateIcon />
                    </Button>
  
                    <Button
                      onClick={() => removeRow(row.id)}
                      sx={{
                        color: "white",
                        backgroundColor: "red",
                        height: "2em",
                        minWidth: "10px",
                        width: "30px",
                        ":hover": {
                          color: "white",
                          backgroundColor: "#010203",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                );
              } else {
                return row[column.field];
              }
            })()}
          </TableCell>
        ))}
      </React.Fragment>
    );
  }
  
  const scrollerRefCallback = (ref) => {
    tableRef.current = ref; // Assign the provided ref to tableRef.current
  }
  const removeRow = (rowId) => {
    setTemporaryData((prevData) => {
      const updatedRows = [...prevData];
      const indexOfRemove = updatedRows.findIndex((obj) => obj.id === rowId);
  
      updatedRows.splice(indexOfRemove, 1); // Remove the row with the specified rowId from updatedRows
      setTemporaryData(filterData(updatedRows)); // Update temporaryData by applying filters to updatedRows
  
      setRemovedRows(prev => [...prev, rowId])
      return [
        ...updatedRows
      ]
    })
  }
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "colorData") {
      // If the filter name is "colorData", update the colorExtCode value of filterValues.colorData
      setFilterValues((prevValues) => ({
        ...prevValues,
        colorData: {
          colorExtCode: value,
        },
      }));
    } else {
      // For other filter names, update the corresponding filter value in filterValues
      setFilterValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  }
  const filterData = (rows) => {
    const filterProperties = Object.keys(filterValues);
  
    if (data === "empty") return []; // If the data is empty, return an empty array
  
    const filteredData = rows.filter((row) =>
      filterProperties.every((property) => {
        if (property === "colorData") {
          // If the property is "colorData", apply colorExtCode filter
          const colorExtCode = filterValues[property].colorExtCode.toLowerCase();
          return (
            !filterValues[property] ||
            (row[property] &&
              row[property].colorExtCode
                .toString()
                .toLowerCase()
                .includes(colorExtCode))
          );
        } else {
          // For other properties, apply general text filter
          const filterValue = filterValues[property].toLowerCase();
          return (
            !filterValues[property] ||
            (row[property] && row[property].toString().toLowerCase().includes(filterValue))
          );
        }
      })
    );
  
    return filteredData.filter((row) => !removedRows.includes(row.id)) // Return the filtered data
  }
  function sortByProperty(list, property, reverse = false) {
    return list.slice().sort((a, b) => {
      const valueB = property === 'colorData' ? b.colorData.colorExtCode : b[property];
      const valueA = property === 'colorData' ? a.colorData.colorExtCode : a[property];
  
      if (valueA < valueB) {
        return reverse ? 1 : -1;
      }
      if (valueA > valueB) {
        return reverse ? -1 : 1;
      }
      return 0;
    });
  }
  const handleSortClick = (fieldName) => {
    const status = columnSorted[fieldName];
    const newStatus = status === 1 ? -1 : status + 1;
  
    setColumnSorted((prev) => {
      const updatedColumnSorted = { ...prev };
  
      // Set the values of other fields to 0
      Object.keys(updatedColumnSorted).forEach((key) => {
        if (key !== fieldName) {
          updatedColumnSorted[key] = 0;
        }
      });
  
      // Update the value associated with the fieldName
      updatedColumnSorted[fieldName] = newStatus;
  
      return updatedColumnSorted;
    });
  }
  
  useEffect(() => {
    setTemporaryData(filterData([...data]))
    setTemporaryData((prevData) =>
      prevData.filter((row) => !removedRows.includes(row.id))
    )
  }, [data])
  useEffect(() => {
    // Find the property that has a non-zero value in columnSorted
    const sortingProperty = Object.keys(columnSorted).find((property) => columnSorted[property] !== 0);
  

    if (sortingProperty) {
      // Sort the temporaryData based on the sortingProperty and sort order
      const sortedData = sortByProperty(temporaryData, sortingProperty, columnSorted[sortingProperty] === -1);
      setTemporaryData([...sortedData])
    } else {
      // If no sortingProperty is found, set temporaryData to the original data
      setTemporaryData(filterData([...data]))
      setTemporaryData((prevData) =>
        prevData.filter((row) => !removedRows.includes(row.id))
    )
    }
    

  }, [columnSorted])
  
  

  return  (<>
    <TableVirtuoso
    width={"100%"}
    scrollerRef={scrollerRefCallback}
    data={temporaryData}
    fixedHeaderContent={fixedHeaderContent}
    itemContent={(index, row) => rowContent(index, row, nrReasonList)}
  />
  <Box sx={{backgroundColor:"#9cdb9e" , display:"flex" , justifyContent:"end" , borderBlock:"1px solid black"  }}>
        <Typography sx={{marginInlineEnd:1 , fontSize:"0.7rem"}}> 
           Total Rows:{temporaryData.length}   
        </Typography>
  </Box>
  </>
  )
})

export default VirtualTable