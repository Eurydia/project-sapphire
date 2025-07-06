import axios from 'axios'

const API_URL = import.meta.env['VITE_API_URL']
console.debug(API_URL)
export const API_CLIENT = axios.create({ baseURL: API_URL })
