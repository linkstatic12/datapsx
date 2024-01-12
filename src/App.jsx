import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {Provider} from 'react-redux'
import store from './redux/companyDetails/store'
import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
const App = () => {
  return (
    <Provider store={store}>
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="/" element={<Navigate to="/admin/data-tables" replace />} />
    </Routes>
    </Provider>
  );
};

export default App;
