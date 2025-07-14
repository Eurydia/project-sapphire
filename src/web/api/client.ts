import axios from 'axios'

const API_URL = 'http://localhost:52690/api'
export const API_CLIENT = axios.create({ baseURL: API_URL })
