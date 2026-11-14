import Axios from 'axios'

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT, //asi se llama a la variable, es diferente a nest
  headers: { 'Content-type': 'application/json' },
})

export default axios
