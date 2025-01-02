import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../contexts/AppContext';
import { assets } from '../assets/assets';
import RelatedDoc from '../components/RelatedDoc';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointement = () => {
  const { docId } = useParams();
  const { doctors, currencySynbols, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState('');
  const dayOfTheWeek = ['SUN', 'MON', 'TUE', 'WEN', 'THU', 'FRI', 'SAT'];
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate()

  const getAvailableSlot = async () => {
    setDocSlot([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // Getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      // Setting end time of the date
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      // Setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = `${day}-${month}-${year}`
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          // Add slots to arrays
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });

        }



        // Incrementing the time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlot((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book an appointment');
      return navigate('/login');
    }

    try {
      // Validate `docSlot` and `slotIndex`
      if (!docSlot.length || !docSlot[slotIndex]) {
        toast.error('Invalid or unavailable slot data');
        return;
      }

      // Ensure `slotTime` is selected
      if (!slotTime) {
        toast.error('Please select a time slot');
        return;
      }

      // Extract date details
      const date = docSlot[slotIndex][0]?.datetime;
      if (!date) {
        toast.error('Invalid slot date');
        return;
      }

      const day = date.getDate();
      const month = date.getMonth() + 1; // Months are 0-based
      const year = date.getFullYear();
      const slotDate = `${day}-${month}-${year}`;

      // API call
      const response = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        getDoctorsData(); // Refresh doctors' data
        navigate('/my-appointment'); // Redirect to appointments page
      } else {
        // Handle unsuccessful booking
        const errorMessage = response?.data?.message || 'Slot booking failed';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };


  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  useEffect(() => {
    console.log(docSlot)
  }, [docSlot])

  useEffect(() => {
    getAvailableSlot();

  }, [docInfo])

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId])

  return docInfo && (
    <div>
      {/* -------Doctors Details-------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        {/* -----Doctors Information : name ,Degree and experience */}
        <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name}
            <img src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/* -----Doctors About short discriptions */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>
              About <img className='w-3' src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>

          </div>
          <p className='text-gray-600 font-medium mt-4'> Appointment fee:   <span className='text-gray-800'>{currencySynbols}{docInfo.fees}</span></p>

        </div>
      </div>
      {/* Booking Slots for The Date and Time  */}
      <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlot.length && docSlot.map((items, index) => (
            <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white ' : 'border border-gray-200'}`}>
              <p>{items[0] && dayOfTheWeek[items[0].datetime.getDay()]}</p>
              <p>{items[0] && items[0].datetime.getDate()}</p>

            </div>

          ))}
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlot.length && docSlot[slotIndex].map((item, index) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light  flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase()}
            </p>

          ))

          }
        </div>
        <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6">
          Book an Appointment
        </button>
      </div>

      <RelatedDoc docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointement