import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Doctors from './Pages/Doctors';
import Login from './Pages/Login';
import About from './Pages/About';
import Contact from './Pages/Contact';
import MyProfile from './Pages/MyProfile';
import MyAppointement from './Pages/MyAppointement';
import Appointement from './Pages/Appointement';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function App() {
  const paypalOptions = {
    "client-id": "AR2RNc4JIcMx2V5Qb9YIRMUE9iZuSf1TC7PiolkPc6ugEYibyKL_0ljvHnFUbJOSnNmGott2XtiHcu_z", // Ensure no spaces
    vault: true,
    intent: "capture",
  };

  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <ToastContainer />
      <PayPalScriptProvider options={paypalOptions}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-appointment" element={<MyAppointement />} />
          <Route path="/appointment/:docId" element={<Appointement />} />
        </Routes>
      </PayPalScriptProvider>
      <Footer />
    </div>
  );
}

export default App;
