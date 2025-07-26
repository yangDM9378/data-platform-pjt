import axios from 'axios'

const structureApi = axios.create({
  baseURL: '/structure',
  withCredentials: true
})

export default structureApi