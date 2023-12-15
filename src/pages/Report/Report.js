import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReportList from "./ReportList";
import ReportDetail from "./ReportDetail";
import Sanction from "./Sanction/Sanction";
import SanctionList from "./Sanction/SanctionList";
import Request from "./Request/Request";
import RequestList from "./Request/RequestList";

const Report = () => {
    return (
        <div className="container">
        <Router>
          <Routes>
            <Route path="/" element={<ReportList />} />
            <Route path="/detail/:seq" element={<ReportDetail />} />
            <Route path="/sanction" element={<Sanction />} />
            <Route path="/sanctionList" element={<SanctionList/>}/>
            <Route path="/request" element={<Request/>}/>
            <Route path="/requestList" element={<RequestList/>}/>
          </Routes>
        </Router>
      </div>
    );
};

export default Report;