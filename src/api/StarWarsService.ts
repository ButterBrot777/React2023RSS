// SearchService.ts
import axios, { AxiosError } from "axios";

const BASE_URL = "https://swapi.dev/api/";

export class SearchService {
  public static async fetchSearchResults(resource: string, searchTerm: string) {
    try {
      const response = await axios.get(
        `${BASE_URL}${resource}/?search=${searchTerm}`
      );
      return response.data.results;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error("API request failed:", axiosError.message);

        if (axiosError.response?.status === 404) {
          throw new Error("Bad request. Please check URL params.");
        }
      }

      throw error;
    }
  }
}
