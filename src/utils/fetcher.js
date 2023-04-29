const fetcher = async (url, options) => {
  try {
    // let { method, headers, body } = options;
    // if (!method) method = "GET";
    console.log("options", options);
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default fetcher;
