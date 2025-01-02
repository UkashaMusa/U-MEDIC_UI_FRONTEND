import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "../contexts/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const PayPalButtonsComponent = ({ appointmentId , getUserAppointments }) => {
  const { backendUrl , getDoctorsData} = useContext(AppContext);
  const [appointmentData, setAppointmentData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const token = localStorage.getItem('token')
  // Fetch appointment data from the backend
  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (!appointmentId) {
        toast.error("Appointment ID is missing!");
        setIsLoading(false); // Stop loading
        return;
      }

      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/finding-appointment`,
          { appointmentId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          setAppointmentData(data.appointment); // Successfully fetched appointment
        } else {
          toast.error(data.message || "Failed to fetch appointment data.");
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
        toast.error("Unable to fetch appointment data. Please try again.");
      } finally {
        setIsLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchAppointmentData();
  }, [appointmentId, backendUrl, token]);

  const createOrder = (data, actions) => {
    if (!appointmentData) {
      toast.error("Unable to create order. Appointment data is missing.");
      return;
    }

    if (!appointmentData.docData || !appointmentData.docData.fees) {
      toast.error("Doctor's fees are missing in appointment data.");
      return;
    }

    console.log("Appointment Data:", appointmentData); // Debugging

    try {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: appointmentData.docData.fees, // Doctor's fees
              currency_code: "USD", // Adjust the currency as needed
            },
          },
        ],
      }).then(orderID => {
        console.log("Order Created with ID:", orderID); // Debugging
        return orderID;
      });
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      toast.error("Failed to create PayPal order. Please try again.");
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      toast.success("Payment completed successfully!");

      console.log(details)

      if (details.status === "COMPLETED") {
        const {data} = await axios.post(`${backendUrl}/api/user/complete-payment`,
          { appointmentId },
          { headers: { Authorization: `Bearer ${token}` } })

         if (data.success){
          toast(data.message)
          localStorage.setItem('detailsStatus',details.status)
          getUserAppointments()
          getDoctorsData()
         }
      }else{
        toast("can't make that request")
      }

    } catch (error) {
      console.error("Payment verification failed:", error);

    }
  };

  const onError = (error) => {
    console.error("PayPal error:", error);
    toast.error("An error occurred with the payment. Please try again.");
  };

  return (
    <div>
      {isLoading ? (
        <p></p>
      ) : !appointmentData ? (
        <p></p>
      ) : (
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "checkout",
          }}
        />
      )}
    </div>
  );
};

export default PayPalButtonsComponent;