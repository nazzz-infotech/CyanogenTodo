// Import necessary modules and components from React, Material-UI, and other libraries.
import React, { useEffect, useState } from "react";
import "./home.scss"; // Import custom styles for the Home component.

// Import Material-UI components for building the user interface.
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Tooltip,
  AccordionActions,
  Fab,
  ButtonGroup,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  Drawer,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";

// Import Material-UI icons.
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import MenuIcon from "@mui/icons-material/Menu";
import { DeleteForever } from "@mui/icons-material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

// Import API functions to interact with the backend.
import {
  getTodos,
  createTestItem,
  dropDatabase,
  toggle,
  deleteTodo,
  allCheck,
  allUnCheck,
  subscribeToPush,
} from "../api/api";

// Import components for showing toast notifications.
import { Bounce, ToastContainer, toast } from "react-toastify";

// Import color palettes from Material-UI for custom styling.
import { green, red, blueGrey, brown } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

// Import Link component from react-router-dom for navigation.
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

/**
 * @component Home
 * @description The main component for displaying and managing the list of To-Do items.
 * It handles fetching, creating, updating, and deleting todos, and provides a responsive UI.
 */
function Home() {
  // State to store the array of todo items fetched from the API.
  const [todos, setTodos] = useState([]);
  // State to track the current window width for responsive UI changes.
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // State to control the visibility of the mobile navigation drawer.
  const [open, setOpen] = useState(false);

  // Derived constants to check if all todos are checked or unchecked.
  const allChecked =
    todos.length > 0 && todos.every((todo) => todo.checked === true);
  const allUnChecked =
    todos.length > 0 && todos.every((todo) => !todo.checked === true);

  /**
   * Toggles the state of the navigation drawer.
   * @param {boolean} newOpen - The new state for the drawer (true for open, false for closed).
   * @returns {Function} A function that updates the drawer's state.
   */
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Effect hook to listen for window resize events and update the windowWidth state.
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    // Add event listener for window resize.
    window.addEventListener("resize", handleResize);
    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount.

  /**
   * Fetches all todo items from the API and updates the component's state.
   */
  const fetchTodos = () => {
    getTodos().then(setTodos);
  };

  /**
   * Subscribe The User for notification
   */

  //for time notification todo
  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
        subscribeToPush();

        // event listener for notification
        addEventListener("load", async () => {
          // register service worker
          const sw = await navigator.serviceWorker.register("sw.js");
          console.log(sw);
        });
      });
    }
  }, []);

  /**
   * Calls the API to mark all todo items as checked and then refreshes the list.
   * Displays a success or error toast notification.
   */
  const checkAllTodos = () => {
    allCheck()
      .then(() => {
        fetchTodos();
        toast.success("All Todos Checked Successfully", {
          position: "bottom-right",
          autoClose: 1500,
          theme: "dark",
          transition: Bounce,
        });
      })
      .catch(() => {
        toast.error("Error Checking All Todos", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  /**
   * Calls the API to mark all todo items as unchecked and then refreshes the list.
   * Displays a success or error toast notification.
   */
  const uncheckAllTodos = () => {
    allUnCheck()
      .then(() => {
        fetchTodos();
        toast.success("All Todos Unchecked Successfully", {
          position: "bottom-right",
          autoClose: 1500,
          theme: "dark",
          transition: Bounce,
        });
      })
      .catch(() => {
        toast.error("Error Unchecking All Todos", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  /**
   * Toggles the 'checked' state of a single todo item by its ID.
   * @param {string} id - The unique identifier of the todo to toggle.
   */
  const toggleTodoState = (id) => {
    toggle(id)
      .then(() => {
        fetchTodos();
        toast.success("Todo Status Updated Successfully", {
          position: "bottom-right",
          autoClose: 600,
          theme: "dark",
          transition: Bounce,
        });
      })
      .catch(() => {
        toast.error("Error Updating Todo Status", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  /**
   * Deletes a single todo item by its ID. It first optimistically updates the UI
   * and then calls the API to delete the item from the database.
   * @param {string} id - The unique identifier of the todo to delete.
   */
  const deleteSingleTodo = async (id) => {
    // Optimistically update the UI by removing the todo from the list.
    await setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    // Call the API to delete the todo from the database.
    deleteTodo(id)
      .then(() => {
        fetchTodos(); // Re-fetch to ensure consistency.
        toast.success("Todo Deleted Successfully", {
          position: "bottom-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
      })
      .catch(() => {
        fetchTodos(); // Re-fetch to revert optimistic update on error.
        toast.error("Error Deleting Todo", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  /**
   * Calls the API to create a new "test" todo item and then refreshes the list.
   * Displays a success or error toast notification.
   */
  const createTestItemWithToast = () => {
    createTestItem()
      .then(() => {
        fetchTodos();
        toast.success("Test Todo Created Successfully", {
          position: "bottom-right",
          autoClose: 1700,
          theme: "dark",
          transition: Bounce,
        });
      })
      .catch(() => {
        toast.error("Error Creating Test Todo", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  /**
   * Calls the API to delete all todo items from the database and refreshes the list.
   * Displays a success or error toast notification.
   */
  const dropDatabaseWithToast = () => {
    dropDatabase()
      .then(() => {
        fetchTodos();
        toast.success("All Todos Deleted Successfully", {
          position: "bottom-right",
          autoClose: 1700,
          theme: "dark",
          transition: Bounce,
        });
      })
      .catch(() => {
        toast.error("Error Deleting All Todos", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      });
  };

  // Effect hook to fetch todos when the component initially mounts.
  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Custom Material-UI theme for the application.
  const theme = createTheme({
    palette: {
      primary: {
        main: "#4527a0", // Deep purple
      },
      secondary: {
        main: "#660069", // Deep magenta
      },
    },
  });

  // JSX content for the navigation drawer, used on smaller screens.
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItemButton onClick={fetchTodos}>
          <ListItemIcon>
            <RefreshIcon />
          </ListItemIcon>
          <ListItemText>Refresh Todos</ListItemText>
        </ListItemButton>
        <ListItemButton onClick={createTestItemWithToast}>
          <ListItemIcon>
            <img
              src="add_diamond_24dp_757575_FILL1_wght400_GRAD0_opsz24.svg"
              alt="Add Test Todo"
            />
          </ListItemIcon>
          <ListItemText>Create Test Item</ListItemText>
        </ListItemButton>
        <ListItemButton onClick={dropDatabaseWithToast}>
          <ListItemIcon>
            <DeleteForever />
          </ListItemIcon>
          <ListItemText>Delete All Todos</ListItemText>
        </ListItemButton>
        <Divider />
        <ButtonGroup
          variant="contained"
          aria-label="all todo actions button group"
          sx={{ flexDirection: "column", marginTop: 2 }}
          fullWidth
        >
          <div style={{ padding: 1 }}>
            <Button
              sx={
                allChecked
                  ? {
                      backgroundColor: green[600],
                      "&:hover": { backgroundColor: green[700] },
                    }
                  : {
                      backgroundColor: blueGrey[600],
                      "&:hover": { backgroundColor: blueGrey[700] },
                    }
              }
              onClick={checkAllTodos}
            >
              All Todo Done
            </Button>
            <Divider />
            <Button
              sx={
                allUnChecked
                  ? {
                      backgroundColor: green[600],
                      "&:hover": { backgroundColor: green[700] },
                    }
                  : {
                      backgroundColor: blueGrey[600],
                      "&:hover": { backgroundColor: blueGrey[700] },
                    }
              }
              onClick={uncheckAllTodos}
            >
              All Todo Not Done
            </Button>
          </div>
        </ButtonGroup>
      </List>
    </Box>
  );

  /**
   * Renders the action items for the main toolbar (AppBar).
   * @returns {JSX.Element} A fragment containing buttons for various actions.
   */
  const toolbarItems = () => {
    return (
      <>
        <ButtonGroup
          variant="contained"
          aria-label="all todo actions button group"
        >
          <Button
            sx={
              allChecked
                ? {
                    backgroundColor: green[600],
                    "&:hover": { backgroundColor: green[700] },
                  }
                : {
                    backgroundColor: blueGrey[600],
                    "&:hover": { backgroundColor: blueGrey[700] },
                  }
            }
            onClick={checkAllTodos}
          >
            All Todo Done
          </Button>
          <Button
            sx={
              allUnChecked
                ? {
                    backgroundColor: green[600],
                    "&:hover": { backgroundColor: green[700] },
                  }
                : {
                    backgroundColor: blueGrey[600],
                    "&:hover": { backgroundColor: blueGrey[700] },
                  }
            }
            onClick={uncheckAllTodos}
          >
            All Todo Not Done
          </Button>
        </ButtonGroup>
        <span className="px5" />
        <Tooltip title="Refresh All Todos">
          <IconButton onClick={fetchTodos}>
            <RefreshIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Create a test todo">
          <IconButton onClick={createTestItemWithToast}>
            <img
              src="add_diamond_24dp_FFFFFF_FILL1_wght400_GRAD0_opsz24.svg"
              alt="Add Test Todo"
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete All Todos">
          <IconButton onClick={dropDatabaseWithToast}>
            <DeleteForever sx={{ color: "#fff" }} />
          </IconButton>
        </Tooltip>
      </>
    );
  };

  function getDateChipColor(date) {
    let nowDate = new Date();
    let formatted = nowDate.toISOString().split("T")[0]; // YYYY-MM-DD
    console.log(formatted);

    if (date < formatted) {
      return "error"; // entered date is in the past
    } else if (date === formatted) {
      return "warning"; // entered date is today
    } else {
      return "success"; // entered date is in the future
    }
  }

  function getDateTimeChips(time, date) {
    if (time !== "None" && date !== "None") {
      return (
        <>
          <Chip color={getDateChipColor(date)} label={date} />
          <div className="px5" />
          <Chip color={"primary"} label={time} />
        </>
      );
    }
  }

  // The main render method for the Home component.
  return (
    <ThemeProvider theme={theme}>
      <>
        {/* Drawer for mobile navigation */}
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>

        {/* Main application bar */}
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              {/* Responsive: Show menu icon on small screens */}
              {windowWidth < 694 && (
                <>
                  <IconButton onClick={toggleDrawer(true)}>
                    <MenuIcon sx={{ color: "white" }} />
                  </IconButton>
                  <div className="px5" />
                </>
              )}
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Cyanogen Todo
              </Typography>
              {/* Responsive: Show full toolbar items on large screens */}
              {windowWidth >= 694 && toolbarItems()}
            </Toolbar>
          </AppBar>
        </Box>
        <br />

        {/* Main content area for displaying todos */}
        <div className="main_div">
          {todos.length !== 0 ? (
            // If there are todos, map over them and render an Accordion for each.
            <div>
              {todos.map((todo) => (
                <Accordion key={todo._id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography
                      component="span"
                      variant="h5"
                      sx={
                        // Apply line-through style if the todo is checked.
                        todo.checked
                          ? {
                              textDecoration: "line-through",
                              backgroundColor: "#77c083ff",
                            }
                          : null
                      }
                    >
                      {todo.title}
                    </Typography>
                    <div className="spacer" />
                    {getDateTimeChips(todo.time, todo.date)}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography component="div" variant="body1">
                      {todo.content}
                    </Typography>
                  </AccordionDetails>
                  <hr />
                  <AccordionActions className="action_panel">
                    <span className="px5" />
                    {/* Link to the update page for this todo */}
                    <Link to={`/update/${todo._id}`}>
                      <Tooltip title="Edit" placement="top">
                        <Fab
                          sx={{
                            backgroundColor: brown[500],
                            "&:hover": { backgroundColor: brown[700] },
                            color: "common.white",
                          }}
                        >
                          <EditIcon />
                        </Fab>
                      </Tooltip>
                    </Link>
                    <span className="px5" />
                    {/* Button to delete this todo */}
                    <Tooltip title="Delete" placement="top">
                      <Fab
                        color="primary"
                        onClick={() => deleteSingleTodo(todo._id)}
                      >
                        <DeleteIcon />
                      </Fab>
                    </Tooltip>
                    <span className="px5" />
                    {/* Conditional button to mark todo as done or not done */}
                    {todo.checked ? (
                      <Tooltip title="Mark as Not Done" placement="top-end">
                        <Fab
                          sx={{
                            color: "common.white",
                            bgcolor: green[700],
                            "&:hover": { bgcolor: green[900] },
                          }}
                          onClick={() => toggleTodoState(todo._id)}
                        >
                          <CheckBoxIcon />
                        </Fab>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Mark as Done" placement="top-end">
                        <Fab
                          sx={{
                            color: "common.white",
                            bgcolor: red[600],
                            "&:hover": { bgcolor: red[700] },
                          }}
                          onClick={() => toggleTodoState(todo._id)}
                        >
                          <CheckBoxOutlineBlankIcon />
                        </Fab>
                      </Tooltip>
                    )}
                  </AccordionActions>
                </Accordion>
              ))}
            </div>
          ) : (
            // If there are no todos, display a message.
            <div className="no_todos_div">
              <Typography component="span" variant="h4">
                No Todos yet.
              </Typography>
            </div>
          )}
        </div>

        {/* Container for toast notifications */}
        <ToastContainer />

        {/* Floating Action Button to navigate to the create page */}
        <div className="fab_container">
          <Tooltip title="New Todo" placement="right-end">
            <Link to="/create">
              <Fab color="secondary">
                <img
                  src="add_task_24dp_FFFFFF_FILL1_wght400_GRAD0_opsz24.svg"
                  alt="New Task Icon"
                />
              </Fab>
            </Link>
          </Tooltip>
        </div>
      </>
    </ThemeProvider>
  );
}

export default Home;
