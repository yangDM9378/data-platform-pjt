import axios from 'axios'

export default axios.create({
  baseURL: '/auth',
  withCredentials: true
})