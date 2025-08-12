import { Box, Button, Divider, Fab, TextField, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { queryFormId, update } from "../api/api";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Most Of the thing are form create include scss (a specific file don't need)
function Update() {
  //value functions
  const [title, setTitleValue] = useState("");
  const [content, setContentValue] = useState("");
  const [pickerDateAndTime, setDateAndTime] = useState(null);
  const { id } = useParams();

  //value handling functions
  const handleTitleChange = (event) => {
    setTitleValue(event.target.value);
  };
  const handleContentChange = (event) => {
    setContentValue(event.target.value);
  };
  //route navigation without HTML
  const navigate = useNavigate();

  const queryById = () => {
    // query / find the todo by id
    queryFormId(id)
      .then((todo) => {
        setTitleValue(todo.title);
        setContentValue(todo.content);

        // Convert "yyyy-mm-dd" + "HH:mm" into a Dayjs object
        const dateTimeString = `${todo.date} ${todo.time}`;
        const parsedDate = dayjs(dateTimeString, "YYYY-MM-DD HH:mm");
        setDateAndTime(parsedDate);
        console.log(todo);
      })
      .catch(() => {
        console.error(`Error in fetching todo by id. ID :- ${id}`);
        toast.error(`Error in fetching todo by id. ID :- ${id}`, {
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

  useEffect(() => {
    // run this on every time when page is load
    queryById();
  }, [id]);

  const updateTodo = () => {
  if (!pickerDateAndTime || !dayjs.isDayjs(pickerDateAndTime)) {
    toast.error("Invalid date and time selected");
    return;
  }

  // Format for your backend (if needed)
  const date = pickerDateAndTime.format("YYYY-MM-DD");
  const time = pickerDateAndTime.format("hh:mm A"); // hh:mm for 12-hour + AM/PM

  console.log(`Date: ${date}, Time: ${time}`); // Example: Date: 08/12/2025, Time: 08:04 PM

  update(id, title, content, time, date)
    .then(() => {
      toast.success("Todo Updated Successfully !", {
        position: "bottom-right",
        autoClose: 1200,
        theme: "dark",
        transition: Bounce,
      });
      navigate("/");
    })
    .catch(() => {
      toast.error("Error updating / editing todo", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
    });
};


  const [sixtyPercentOfWindow, setSixtyPercentOfWindow] = useState(
    window.innerWidth * 0.6
  ); //60% width

  useEffect(() => {
    function updateWidth() {
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
    // custom theme
    palette: {
      primary: {
        main: "#4527a0",
      },
      secondary: {
        main: "#047c22ff",
      },
    },
  });

  function containsNumbers(str) {
    return /\d/.test(str); // \d matches any digit (0-9)
  }

  function getDateTimePicker() {
    if (containsNumbers(pickerDateAndTime)) {
      return (
        <>
          <div className="create_divider"></div> {/* Spacer / Divider */}
          <Divider />
          <div className="create_divider"></div> {/* Spacer / Divider */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              disablePast
              label="Pick Date and Time"
              value={pickerDateAndTime}
              enableAccessibleFieldDOMStructure={false}
              onChange={(newValue) => setDateAndTime(newValue)}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          </LocalizationProvider>
        </>
      );
    }
  }

  return (
    <ThemeProvider theme={myTheme}>
      <div className="create_bg">
        <div className="main_div_create">
          <div className="create_panel">
            <Box
              sx={{
                width: sixtyPercentOfWindow,
                padding: 3.2,
                border: "1.5px solid grey",
                borderRadius: "6px",
              }}
            >
              <form
                action={() => {
                  updateTodo();
                }}
              >
                <TextField
                  fullWidth
                  required
                  label="Title"
                  id="fullWidth"
                  variant="filled"
                  value={title}
                  onChange={handleTitleChange}
                />
                <div className="create_divider"></div>
                <TextField
                  fullWidth
                  label="Content"
                  id="fullWidth"
                  variant="outlined"
                  multiline
                  maxRows={10}
                  value={content}
                  onChange={handleContentChange}
                />
                {getDateTimePicker()}
                <div className="create_divider"></div> {/* Spacer / Divider */}
                <hr />
                <div className="create_divider"></div>
                <Button variant="contained" fullWidth type="submit">
                  Edit / Update
                </Button>
              </form>
            </Box>
            <div className="fab_container">
              <Tooltip title="Go Back To Home" placement="right-start">
                <Link to="/">
                  <Fab color="secondary">
                    <ArrowBackIcon />
                  </Fab>
                </Link>
              </Tooltip>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Update;
