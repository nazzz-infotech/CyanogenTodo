import {
  Box,
  Button,
  Checkbox,
  Divider,
  Fab,
  FormControlLabel,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "./create.scss";
import { createNew } from "../api/api";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

// Create New Todo Page
function Create() {
  //value functions
  const [title, setTitleValue] = useState(""); // Title
  const [content, setContentValue] = useState(""); // Content
  const [isBackToHome, setBackToHome] = useState(false); // is back to home after todo creation (not for adding to database)
  const [isTimeAndDate, setTimeAndDate] = useState(false); // use the time and date if needed
  const [pickerDateAndTime, setDateAndTime] = useState(dayjs()); // time (get the current time)

  //value handling functions
  const handleTitleChange = (event) => {
    setTitleValue(event.target.value);
  };
  const handleContentChange = (event) => {
    setContentValue(event.target.value);
  };
  const handleGoBackToHome = (event) => {
    setBackToHome(event.target.checked);
  };
  const handleTimeAndDate = (event) => {
    setTimeAndDate(event.target.checked);
  };

  //route navigation without HTML
  const navigate = useNavigate();

  const createNewTodo = () => {
    let time = "None";
    let date = "None";
    if (isTimeAndDate) {
      time = pickerDateAndTime.format("hh:mm A");
      console.log(`Selected time: ${time}`);

      date = pickerDateAndTime.format("YYYY-MM-DD");
      console.log(`Selected date: ${date}`);
    }
    // main create function
    createNew(title, content, time, date)
      .then(() => {
        console.log("Todo Created !");
        toast.success("Todo Created Successfully !", {
          position: "bottom-right",
          autoClose: 900,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        if (isBackToHome) {
          // if it is true
          navigate("/"); // back to home page
        }
      })
      .catch(() => {
        // throw a error
        console.log("Error in todo creation");
        toast.error("Error in todo creation", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  const [sixtyPercentOfWindow, setSixtyPercentOfWindow] = useState(
    window.innerWidth * 0.6
  ); // get the 60% width of window

  useEffect(() => {
    function updateWidth() {
      // update the width
      setSixtyPercentOfWindow(window.innerWidth * 0.6);
    }

    // Add event listener
    window.addEventListener("resize", updateWidth);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []); // The empty array [] ensures this effect runs only once on mount

  const myTheme = createTheme({
    // custom material theme
    palette: {
      primary: {
        main: "#4527a0",
      },
      secondary: {
        main: "#075697ff",
      },
    },
  });

  function returnDateTimePicker() {
    if (isTimeAndDate) {
      return (
        <>
          <div className="create_divider"></div> {/* Spacer / Divider */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              disablePast
              label="Pick Date and Time"
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
              value={pickerDateAndTime}
              onChange={(newValue) => setDateAndTime(newValue)}
            />
          </LocalizationProvider>
          <div className="create_divider"></div> {/* Spacer / Divider */}
        </>
      );
    }
  }

  return (
    <ThemeProvider theme={myTheme}>
      {" "}
      {/* Theme Provider for set the custom theme to the app / page */}
      <div className="create_bg">
        {" "}
        {/* Main Div for background and center content */}
        <div className="main_div_create">
          {" "}
          {/*Div for good-looking background */}
          <div className="create_panel">
            {" "}
            {/* Main Content Panel Div */}
            <Box
              sx={{
                width: sixtyPercentOfWindow,
                padding: 3.2,
                border: "1.5px solid grey",
                borderRadius: "6px",
              }}
            >
              <form // form for the app
                action={() => {
                  createNewTodo(); // create the todo on submit
                }}
              >
                {/* Title textfield */}
                <TextField
                  fullWidth
                  required
                  label="Title"
                  id="fullWidth"
                  variant="filled"
                  value={title}
                  onChange={handleTitleChange}
                />
                <div className="create_divider"></div> {/* Spacer / Divider */}
                <TextField
                  fullWidth
                  label="Content"
                  id="fullWidth"
                  variant="outlined"
                  multiline
                  maxRows={isTimeAndDate ? 4 : 10}
                  value={content}
                  onChange={handleContentChange}
                />
                <div className="create_divider"></div> {/* Spacer / Divider */}
                <Divider /> {/*MUI Divider*/}
                <div className="create_divider"></div> {/* Spacer / Divider */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isTimeAndDate}
                      onChange={handleTimeAndDate}
                      color="secondary"
                    />
                  }
                  label="Use Date And Time"
                />
                {returnDateTimePicker()}
                <hr />
                {/* Go Back to home after todo creation checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isBackToHome}
                      onChange={handleGoBackToHome}
                    />
                  }
                  label="Go Back To Home after todo creation"
                />
                {/* Create Button and 16px spacer / divider */}
                <div className="create_divider"></div>
                <Button variant="contained" fullWidth type="submit">
                  Create
                </Button>
              </form>
            </Box>
            <div className="fab_container">
              {" "}
              {/* Back To home FAB Container */}
              <Tooltip title="Go Back To Home" placement="right-start">
                {" "}
                {/* Tooltip */}
                <Link to="/">
                  {" "}
                  {/* Home Route Link */}
                  <Fab color="secondary">
                    {" "}
                    {/* Fab */}
                    <ArrowBackIcon /> {/* Back Arrow Icon */}
                  </Fab>
                </Link>
              </Tooltip>
            </div>
            <ToastContainer /> {/* Toast Container */}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Create; // Export Create Function
