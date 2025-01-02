import { useContext, useEffect, useState } from "react"
import { AppContext } from '../contexts/AppContext'
import { toast } from "react-toastify"
import axios from "axios"
import PayPalButtonsComponent from "../components/PayPalButtonsComponent"


const MyAppointement = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [showPayPal, setShowPayPal] = useState(false);

  const [appointments, setAppointments] = useState([])

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
      if (data.success) {
        setAppointments(data.appointment.reverse())
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {

    try {
      console.log(appointmentId)

      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  //paypal payment 


  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">MyAppointement works</p>
      <div>
        {appointments.map((items, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b" key={index}>
            <div>
              <img className="w-36 bg-[#EAEFFF]" src={items.docData.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">{items.docData.name}</p>
              <p>{items.docData.speciality}</p>
              <p className="text-[#464646] font-medium mt-1">Address:</p>
              <p>{items.docData.address.line1}</p>
              <p>{items.docData.address.line2}</p>
              <p className=" mt-1"><span className="text-sm text-[#3C3C3C] font-medium">Date & Time: </span>{items.slotData} |  {items.slotTime}</p>
            </div>
            <div></div>


            <div className="flex flex-col gap-2 justify-end text-sm text-center relative">
              {!items.cancelled && items.payment && !items.isCompleted && <button className="sm:min-w-48 py-2 border rounded text-stone-500 by-indigo-50">paid</button>}
              {/* PayPal Button (conditionally rendered) */}
              {!items.cancelled && showPayPal && !items.isCompleted && (
               <div className="relative">
                  <PayPalButtonsComponent appointmentId={items._id} token={token} getUserAppointments={getUserAppointments} />
                </div>
                
              )}

              {/* Pay Online Button */}
              {!items.cancelled && !items.payment && !items.isCompleted && (
                <button
                  onClick={() => setShowPayPal(true)} // Show PayPal button when clicked
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 group relative"
                >
                  Pay Online
                </button>
              )}

              {/* Cancel Appointment Button */}
              {!items.cancelled && !items.isCompleted && (
                <button
                  onClick={() => cancelAppointment(items._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}

              {/* Appointment Cancelled Message */}
              {items.cancelled && !items.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment Cancelled
                </button>
              )}

              {
                items.isCompleted && <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">Completed</button>
              }
            </div>


          </div>
        ))}
      </div>

    </div>
  )
}

export default MyAppointement