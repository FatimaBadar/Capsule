import React, {useState} from "react";
import UploadComponent from "./UploadComponent";
import "./Dashboard.css";

import { Button } from "primereact/button";
import GridViewComponent from "./GridViewComponent";

export default function DashboardComponent() {
  const [openUpload, setOpenUpload] = useState(false);

  const handleOpenUpload = (data) => {
    setOpenUpload(data);
  }

  return (
    <div>
      <section className="dashboard-hero-section">
        <div className="dashboard-hero-overlay">
          <div className="dashboard-hero-content">
            <h3>Your Dashboard</h3>
            <h1>Manage & View All Your Clothes Here</h1>

            <Button label="Add New Clothes" onClick={() => setOpenUpload(true)} />
          </div>
        </div>
      </section>

      {openUpload && (
      <UploadComponent onOpenUpload={handleOpenUpload}/>
      )}

      <GridViewComponent/>
    </div>
  );
}
