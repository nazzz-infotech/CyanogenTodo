import { Box, Button, Fab, TextField, Tooltip } from "@mui/material";
import React, { useState, useEffect } from "react";
import { queryFormId, update } from "../api/api";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams } from "react-router-dom";

// Most Of the thing are form create include scss (a specific file don't need)
function Update() {
  //value functions
  const [title, setTitleValue] = useState("");
  const [content, setContentValue] = useState("");
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

  const queryById = () => { // query / find the todo by id
    queryFormId(id)
      .then((todo) => {
        setTitleValue(todo.title);
        setContentValue(todo.content);
        console.log(todo.title);
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

  useEffect(() => { // run this on every time when page is load
    queryById();
  }, [id]);

  const updateTodo = () => { // update / edit todo
    update(title, content, id).then(() => {
      console.log("Todo Created");
      toast.success("Todo Updated Successfully !", {
        position: "bottom-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      navigate("/");
    }).catch(() => {
      console.log("Error updating / editing todo");
      toast.error("Error updating / editing todo", {
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
    window.innerWidth * 0.60
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

  const myTheme = createTheme({ // custom theme
    palette: {
      primary: {
        main: "#4527a0",
      },
      secondary: {
        main: "#047c22ff",
      },
    },
  });

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
                <div className="create_divider"></div>
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