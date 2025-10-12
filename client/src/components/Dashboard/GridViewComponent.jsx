import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { getAllClothes } from "../../services/clothingService";
import axios from "axios";
const API_URL = "http://localhost:3000/api/clothes";

export default function GridViewComponent() {
  const [loader, setLoader] = useState(false);
  const [clothes, setClothes] = useState([]);

  // const [clothes, setClothes] = useState([
  //   {
  //     id,
  //     code: "f230fh0g3",
  //     name: "Bamboo Watch",
  //     description: "clothes Description",
  //     image: 'dashboard-hero.png',
  //     price: 65,
  //     category: "Accessories",
  //     quantity: 24,
  //     inventoryStatus: "INSTOCK",
  //     rating: 5,
  //   },
  // ]);
  const [layout, setLayout] = useState("grid");

  useEffect(() => {
    try {
      setLoader(true);

      // const response = getAllClothes(tempClothesData);

      const response = fetchAllClothes();
      console.log("Response:", response);

      if (response.statusCode == "200") {
        setLoader(false);
        // setClothes(response.items);
      } else {
        setLoader(false);
      }

      setClothes("");
    } catch (error) {
      setLoader(false);
    }

    // ClothingService.getAllClothes().then((data) => setclothes(data.slice(0, 12)));
  }, []);

  const fetchAllClothes = async () => {
  try {
    console.log("Fetching all clothes...");
    const response = await axios.get(`${API_URL}/get-all-clothes`);
    if (response.data.statusCode === 200) {
      console.log("All clothes:", response.data.items);
      // Save in state to render list
      setClothes(response.data.items);
    }
  } catch (err) {
    console.error("Failed to fetch clothes:", err);
  }
};


  const getSeverity = (clothes) => {
    switch (clothes.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const gridItem = (clothes) => {
    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={clothes.id}>
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-tag"></i>
              <span className="font-semibold">{clothes.category}</span>
            </div>
            {/* <Tag
              value={clothes.inventoryStatus}
              severity={getSeverity(clothes)}
            ></Tag> */}
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img
              className="w-9 shadow-2 border-round"
              src={`../../../../server/uploads/${clothes._id}`}
              alt={clothes.title}
            />
            <div className="text-2xl font-bold">{clothes.title}</div>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (clothes, index) => {
    if (!clothes) {
      return;
    }
    return gridItem(clothes);
  };

  const listTemplate = (clothes) => {
    return (
      <div className="grid grid-nogutter">
        {clothes.map((clothes, index) => itemTemplate(clothes, index))}
      </div>
    );
  };

  return (
    <>
      {loader ? (
        <Container
          maxWidth={false}
          sx={{ display: "flex", width: "fit-content", mt: "20%" }}
        >
          <CircularProgress size={"70px"} />
        </Container>
      ) : (
        <div className="card">
          <DataView
            value={clothes}
            listTemplate={listTemplate}
            layout={layout}
            // header={header()}
          />
        </div>
      )}
    </>
  );
}
