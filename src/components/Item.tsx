import { Link, useParams, useSearchParams } from "react-router-dom";
import { Product } from "../pages/SearchPage.tsx";
import { useEffect, useState } from "react";
import { ApiService } from "../api/ApiService.ts";

export const Item = () => {
  const [searchParams] = useSearchParams();
  const [customItem, setCustomItem] = useState<Product>();
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const q = searchParams.get("q") ?? "";
  const limit = searchParams.get("limit") ?? "";
  const page = searchParams.get("page") ?? "";

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      ApiService.getItem(params.id)
        .then((data) => {
          setCustomItem(data.data);
        })
        .catch((error) => console.log("Fetch error: ", error))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  return (
    <>
      {loading ? (
        <div className="">Loading...</div>
      ) : params.id ? (
        <div className="flex flex-col px-10">
          <Link
            className="mb-6 bg-cyan-200 text-black"
            to={`/search?q=${q ? q : ""}&limit=${limit ? limit : ""}&page=${
              page ? page : ""
            }`}
          >
            Close
          </Link>
          <img src={customItem?.images[0]} alt="Italian Trulli" />
          <p>Brand: {customItem?.brand}</p>
          <p>Category: {customItem?.description}</p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
