import axios from "axios";

const apiUrl = "http://localhost:5000"; // Api url

// Create Test Item API call
export const createTestItem = async () => {
  try {
    const res = await axios.post(`${apiUrl}/createtestitem`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err; // ← THIS allows .catch() to work
  }
};

// Drop (delete all) API call
export const dropDatabase = async () => {
  try {
    const res = await axios.delete(`${apiUrl}/drop`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//Query All (get all todos)
export function getTodos() {
  return axios
    .get(`${apiUrl}/todos`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Failed to fetch todos:", err);
      return [];
    });
}

// Check / Uncheck the todo
export const toggle = async (id) => {
  try {
    const res = await axios.patch(`${apiUrl}/toggle/${id}`);
    console.log(res.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// delete a single todo
export const deleteTodo = async (id) => {
  try {
    const res = await axios.delete(`${apiUrl}/delete/${id}`);
    console.log(res.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// check all todos
export const allCheck = async () => {
  try {
    const res = await axios.patch(`${apiUrl}/checkall`);
    console.log(res.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// uncheck all todos
export const allUnCheck = async () => {
  try {
    const res = await axios.patch(`${apiUrl}/uncheckall`);
    console.log(res.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// create new todo
export const createNew = async (title, content, time, date) => {
  try {
    const postData = {
      title: title,
      content: content === "" ? title : content,
      date: date,
      time: time,
    };
    const res = await axios.post(`${apiUrl}/new`, postData);
    console.log(res.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// find / query todo from id
export const queryFormId = async (id) => {
  try {
    const res = await axios.get(`${apiUrl}/queryfromid/${id}`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// update / edit todo
export const update = async (id, title, content, time, date) => {
  try {
    const postData = {
      _id: id,
      title: title,
      content: content === "" ? title : content,
      time: time,
      date: date,
    };
    const res = await axios.put(`${apiUrl}/update`, postData);
    console.log(res.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
