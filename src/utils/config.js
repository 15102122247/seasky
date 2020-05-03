import axios from "axios";

async function getConfig() {
  const res = await axios
    .get("./config.json")
    .catch(_ => console.log("info: do not found config"));
  return res.data;
}

export { getConfig };
