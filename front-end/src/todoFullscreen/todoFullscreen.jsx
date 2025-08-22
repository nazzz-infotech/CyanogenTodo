import { useNavigate, useParams } from "react-router-dom";
import { queryFormId, toggle, deleteTodo } from "../api/api";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { Helmet } from "react-helmet";
import {
  Box,
  createTheme,
  Slider,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import "./todoFullscreen.scss";

function TodoFullscreen() {
  const { id } = useParams();
  const [todoTitle, setTodoTitle] = useState("");
  const [todoContent, setTodoContent] = useState("");
  const [isError, setIsError] = useState(false);
  const [sixtyPercentOfWindow, setSixtyPercentOfWindow] = useState(
    window.innerWidth * 0.6
  ); // get the 60% width of window
  // route without HTML
  const navigate = useNavigate();

  const queryById = async () => {
    try {
      const todo = await queryFormId(id);
      console.log("Todo Read Successfully", todo);
      setTodoTitle(todo.title);
      setTodoContent(todo.content);
      console.log(todo);
    } catch (e) {
      console.error(e);
      setIsError(true);
      toast.error("Error Reading Todo", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    queryById();
  }, [id]);

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

  /**
   * Theme Color and create a custom Theme
   */

  const addressBarColor = "#2273c4";

  const myTheme = createTheme({
    palette: {
      primary: {
        main: "#FFD700",
      },
      secondary: {
        main: "#8d590bff",
      },
    },
  });

  const checkTodo = () => {
    toggle(id)
      .then(() => {
        console.log("Todo Check !!!");
        navigate("/"); // go back to home
      })
      .catch((e) => {
        console.error(e);
        toast.error("Error in Todo Checking", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  const deleteBySlidingTodo = () => {
    deleteTodo(id)
      .then(() => {
        console.log("Todo Deleted Successfully !!!");
        navigate("/"); // go back to home
      })
      .catch((e) => {
        console.error(e);
        toast.error("Error in Deleting Todo", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  const editTodo = () => {
    navigate(`/update/${id}`); // only push the user to update page with id
  }

  const handleCheckProgressChange = (event, newValue) => {
    if (newValue === 100) {
      checkTodo();
    }
  };

  const handleDeleteProgressChange = (event, newValue) => {
    if (newValue === 100) {
      deleteBySlidingTodo();
    }
  };

  const handleEditProgressChange = (event, newValue) => {
    if (newValue === 100) {
      editTodo();
    }
  };

  function MainContent() {
    if (!isError) {
      return (
        <div className="main_fullscreenTodoDiv">
          <Typography component={"span"} variant={"h5"}>
            You have not done the {todoTitle}
          </Typography>
          <div className="px25" />
          <Typography component={"p"} variant={"body1"}>
            You have not done the {todoContent}
          </Typography>
          <div className="bottom_buttons">
            <Box width={sixtyPercentOfWindow}>
              <Typography component={"span"} variant="body1">
                Slide This to 100 for check
              </Typography>
              <Slider
                aria-label="Default"
                key={`slider-${1}`}
                defaultValue={1}
                max={100}
                min={1}
                marks
                valueLabelDisplay={"auto"}
                onChangeCommitted={handleCheckProgressChange}
                color="success"
              />
              <hr />
              <Typography component={"span"} variant="body2">
                Slide This to 100 for Delete
              </Typography>
              <Slider
                aria-label="Default"
                color="error"
                key={`slider-${1}`}
                defaultValue={1}
                max={100}
                min={1}
                marks
                valueLabelDisplay={"auto"}
                onChangeCommitted={handleDeleteProgressChange}
              />
              <hr />
              <Typography component={"span"} variant="body2">
                Slide This to 100 for Edit
              </Typography>
              <Slider
                aria-label="Default"
                key={`slider-${1}`}
                defaultValue={1}
                max={100}
                min={1}
                marks
                valueLabelDisplay={"auto"}
                onChangeCommitted={handleEditProgressChange}
                color="secondary"
              />
            </Box>
            <div className="px5" />
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <Helmet>
        {/* Theme color (address bar color on mobile Chrome, etc.) */}
        <meta name="theme-color" content={addressBarColor} />

        {/* iOS support (optional, for Safari) */}
        <link rel="apple-touch-icon" href="/app_icons/icon_192X192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Helmet>
      <ThemeProvider theme={myTheme}>
        <MainContent />
      </ThemeProvider>
      <ToastContainer />
    </>
  );
}

export default TodoFullscreen;
