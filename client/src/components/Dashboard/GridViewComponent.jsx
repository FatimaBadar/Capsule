import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Container, CircularProgress, Alert } from "@mui/material";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { getAllClothes } from "../../services/clothingService";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext.jsx";

const API_URL = "http://localhost:3000/api/clothes";

export default function GridViewComponent() {
  const [loader, setLoader] = useState(false);
  const [clothes, setClothes] = useState([]);
  const [layout, setLayout] = useState("grid");
  const [imageBase64, setImageBase64] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const { user } = useAuth();

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
  };

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

  useEffect(() => {
    const fetchAllClothes = async () => {
      try {
        setLoader(true);
        console.log("Fetching all clothes...");
        const response = await axios.get(`${API_URL}/get-all-clothes`);
        if (response.data.statusCode === 200) {
          console.log("All clothes:", response.data.items);
          setClothes(response.data.items);
        }
      } catch (err) {
        console.error("Failed to fetch clothes:", err);
        showMessage("Failed to load wardrobe items. Please try again.", "error");
      } finally {
        setLoader(false);
      }
    };

    fetchAllClothes();
  }, []);

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

  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/wardrobe/${id}`);
      setClothes(clothes.filter(item => item._id !== id));
      showMessage('Item deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting item:', error);
      showMessage(error.response?.data?.message || 'Error deleting item', 'error');
    }
  };

  const gridItem = (item) => {
    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={item._id}>
        <div className="p-2 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-tag"></i>
              <span className="font-semibold">
                {Array.isArray(item.category) ? item.category.join(', ').toUpperCase() : item.category.toUpperCase()}
              </span>
            </div>
            <Button
              icon="pi pi-trash"
              className="p-button-danger p-button-sm"
              onClick={() => deleteItem(item._id)}
              tooltip="Delete item"
              style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
            />
          </div>
          <div className="flex flex-column align-items-center gap-3">
            <img
              src={item.imageBase64 ? item.imageBase64 : item.imageUrl}
              alt={item.title}
              className="w-5 shadow-2 border-round"
            />
            <div className="text-2xl font-bold">{item.title}</div>
            {item.color && (
              <div className="text-sm text-gray-600">Color: {item.color}</div>
            )}
            {item.style && (
              <div className="text-sm text-gray-600">Style: {Array.isArray(item.style) ? item.style.join(', ') : item.style}</div>
            )}
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

  // const listTemplate = (items) => {
  //   return (
  //     <div className="grid grid-nogutter">
  //               {items.map((item) => gridItem(item))}

  //       {/* {items.map((item, index) => itemTemplate(item, index))} */}
  //     </div>
  //   );
  // };
  const listTemplate = (items) => {
    return (
      <div className="grid grid-nogutter">
        {items.map((item) => gridItem(item))}
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
      
      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ 
            position: 'fixed', 
            top: '80px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 1000,
            minWidth: '300px'
          }}
          onClose={() => setMessage({ text: "", type: "" })}
        >
          {message.text}
        </Alert>
      )}
    </>
  );
}
