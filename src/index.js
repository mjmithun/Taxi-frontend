import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import SignIn from "./signin";
import Main from './Main.jsx';
import Driver from './Driver.jsx';
import Car from './Car.jsx';
import AddTrip from './AddTrip.jsx';
import Invoice from './invoice.jsx';
import AddDrivers from './AddDrivers.jsx';
import AddCar from './AddCar.jsx';
import AddExpense from './AddExpense.jsx';
import Trips from './Trips.jsx';
import Redirect from './Redirect.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import EndTrip from './EndTrip.jsx';
import Review from './Review.jsx';
import ReviewTrip from './ReviewForm.jsx';
import Accounts from './Accounts.jsx';
import AddAccounts from './AddAccounts.jsx';
import AccountDetails from './components/AccountDetails.jsx'; // ✅ Import AccountDetails

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/redirect" element={<Redirect />} />

        {/* Admin Routes */}
        <Route path="/main" element={<ProtectedRoute element={<Main />} allowedRoles={['admin']} />} />
        <Route path="/driver" element={<ProtectedRoute element={<Driver />} allowedRoles={['admin']} />} />
        <Route path="/car" element={<ProtectedRoute element={<Car />} allowedRoles={['admin']} />} />
        <Route path="/addtrip" element={<ProtectedRoute element={<AddTrip />} allowedRoles={['admin']} />} />
        <Route path="/reviewtrip" element={<ProtectedRoute element={<Review />} allowedRoles={['admin']} />} />
        <Route path="/finalizetrip/:tripId" element={<ProtectedRoute element={<ReviewTrip />} allowedRoles={['admin']} />} />
        <Route path="/endtrip/:tripId" element={<ProtectedRoute element={<EndTrip />} allowedRoles={['admin', 'driver']} />} />
        <Route path="/edittrip/:tripId" element={<ProtectedRoute element={<AddTrip />} allowedRoles={['driver', 'admin']} />} />
        <Route path="/invoice" element={<ProtectedRoute element={<Invoice />} allowedRoles={['admin']} />} />
        <Route path="/adddriver" element={<ProtectedRoute element={<AddDrivers />} allowedRoles={['admin']} />} />
        <Route path="/addaccounts" element={<ProtectedRoute element={<AddAccounts />} allowedRoles={['admin']} />} />
        <Route path="/addcar" element={<ProtectedRoute element={<AddCar />} allowedRoles={['admin']} />} />
        <Route path="/addexpense" element={<ProtectedRoute element={<AddExpense />} allowedRoles={['admin']} />} />

        {/* Driver and Admin Routes */}
        <Route path="/trips" element={<ProtectedRoute element={<Trips />} allowedRoles={['driver', 'admin']} />} />
        <Route path="/accounts" element={<ProtectedRoute element={<Accounts />} allowedRoles={['driver', 'admin']} />} />

        {/* ✅ New Account Details Route */}
        <Route path="/accountdetails/:year/:month" element={<ProtectedRoute element={<AccountDetails />} allowedRoles={['admin']} />} />

      </Routes>
    </Router>
  </React.StrictMode>
);
