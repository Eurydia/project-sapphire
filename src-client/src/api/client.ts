import axios from 'axios'

const API_URL = 'http://localhost:52690/api'
console.debug(API_URL)
export const API_CLIENT = axios.create({ baseURL: API_URL })
