import React, { useCallback, useEffect, useRef, useState } from "react";
import { ApiService } from "../api/ApiService.ts";
import { Link, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export interface Product {
  brand: "";
  category: "";
  description: "";
  discountPercentage: number;
  id: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
}

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState(() => {
    const storedSearchTerm = localStorage.getItem("searchTerm");
    return storedSearchTerm ? storedSearchTerm : "";
  });
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(0);
  const ref = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const limit = searchParams.get("limit") ?? "";

  useEffect(() => {
    if (searchTerm) {
      setSearchParams({
        q: searchTerm,
        limit: itemsPerPage,
        page: (currentPage + 1).toString(),
      });
      navigate(
        `/search?q=${q ? q : searchTerm ? searchTerm : ""}&limit=${
          limit ? limit : itemsPerPage
        }&page=${currentPage + 1}`
      );
    }
  }, [
    currentPage,
    itemsPerPage,
    limit,
    navigate,
    q,
    searchTerm,
    setSearchParams,
  ]);

  const loadSearchResults = useCallback(() => {
    setLoading(true);
    ApiService.getItems(itemsPerPage, searchTerm, currentPage)
      .then((data) => {
        setSearchResults(data?.data.products);
        setError(null);
      })
      .catch((error) => setError(error))
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    loadSearchResults();
  }, [loadSearchResults]);

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") handleSearch();
  };

  const handleSearch = () => {
    const currentRef = ref.current?.value;
    if (currentRef) {
      const value = currentRef.trim();
      setSearchTerm(value);
      setCurrentPage(0);
      setSearchParams({ ...searchParams, page: "1" });
      localStorage.setItem("searchTerm", value);
      loadSearchResults();
      setSearchParams({ q: currentRef, page: currentPage.toString() });
      navigate(
        `/search?q=${q ? q : currentRef ? currentRef : ""}&limit=${
          limit ? limit : itemsPerPage
        }&page=${currentPage + 1}`
      );
    } else {
      localStorage.setItem("searchTerm", "");
      setSearchTerm("");
      setCurrentPage(0);
      setSearchParams({ ...searchParams, page: "1" });
      loadSearchResults();
      navigate(
        `/search?q=${q ? q : currentRef ? currentRef : ""}&limit=${
          limit ? limit : itemsPerPage
        }&page=${currentPage + 1}`
      );
    }
  };

  const throwTestError = () => {
    throw new Error("Test error buuuaaaa!!!");
    setError(new Error("Test error buuuaaaa!!!"));
  };

  const handlePrev = () => {
    setCurrentPage((prevState) => prevState - 1);
    setSearchParams({
      ...searchParams,
      q: q ? q : searchTerm,
      limit: limit ? limit : itemsPerPage,
      page: currentPage.toString(),
    });
  };
  const handleNext = () => {
    setCurrentPage((prevState) => prevState + 1);
    setSearchParams({
      ...searchParams,
      q: q ? q : searchTerm,
      limit: limit ? limit : itemsPerPage,
      page: (currentPage + 2).toString(),
    });
  };
  const handleItemsCountChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setItemsPerPage(value);
    setSearchParams({ ...searchParams, limit: value });
  };

  return (
    <div className="flex flex-col text-white">
      <div style={{ marginBottom: "16px" }}>
        <input defaultValue={searchTerm} onKeyDown={handleEnter} ref={ref} />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
        <button onClick={throwTestError}>Throw Error</button>
      </div>
      <div className="flex w-full gap-3 my-6 justify-center">
        <button
          className={`bg-gray-500 ${!currentPage && "cursor-not-allowed"}`}
          type="button"
          onClick={handlePrev}
          disabled={!currentPage}
        >
          prev
        </button>
        <div className="flex items-center px-4">{currentPage + 1}</div>
        <select
          className="flex w-14"
          value={itemsPerPage}
          onChange={handleItemsCountChange}
        >
          <option value={"5"}>5</option>
          <option value={"10"}>10</option>
        </select>
        <button className="bg-gray-500" type="button" onClick={handleNext}>
          next
        </button>
      </div>
      {loading ? (
        <div className="">Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : !searchResults?.length ? (
        <div>No results. Please try different name</div>
      ) : (
        <ul>
          {searchResults.map((product: Product) => (
            <li key={product.id}>
              <Link
                to={`/${product.id}/search?q=${
                  q ? q : searchTerm ? searchTerm : ""
                }&limit=${limit ? limit : itemsPerPage}&page=${
                  currentPage + 1
                }`}
              >
                {product.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
