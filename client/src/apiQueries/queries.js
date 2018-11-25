import axios from "axios";

export const getSnippetById = async id => {
  try {
    const response = await axios.get(
      `https://us-central1-snippet-sharing.cloudfunctions.net/getSnippet?id=${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createSnippet = async obj => {
  try {
    const response = await axios.post(
      "https://us-central1-snippet-sharing.cloudfunctions.net/createSnippet",
      obj
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSnippet = async id => {
  try {
    const response = await axios.delete(
      `https://us-central1-snippet-sharing.cloudfunctions.net/deleteSnippet?id=${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateSnippet = async (id, obj) => {
  try {
    const response = await axios.put(
      `https://snippet-sharing.firebaseio.com/snippets/${id}`,
      obj
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
