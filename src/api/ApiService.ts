import axios from "axios";
const BASE_URL = "https://dummyjson.com/products";

export class ApiService {
  public static async getItems(limit = "10", query: string, pageNum: number) {
    const skip = +limit * pageNum;
    const url = `${BASE_URL}/search?q=${query}&limit=${limit}&skip=${skip}`;
    return axios.get(url);
  }

  public static async getItem(id: string) {
    const url = `${BASE_URL}/${id}`;
    return axios.get(url);
  }
}
