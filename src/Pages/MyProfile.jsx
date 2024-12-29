import { useContext, useState } from 'react'
import { AppContext } from '../contexts/AppContext';
import {assets} from '../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
   const {userData,setUserData, token, backendUrl, loadUserProfileData} = useContext(AppContext)

  const [isEdit, setEdit] = useState(false);
  const [image,setImage] = useState(false);

  const updateUserProfileData = async () =>{
    try {
      const formData = new FormData()

      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)

      image && formData.append('image',image)

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`, // Fixed typo
        formData,
        { headers: {  token: `${token}` } } // Better header format
      );
      if (data.success){
        toast.success(data.message)
        await loadUserProfileData
        setEdit(false)
        setImage(false)
        //
      }else{
        toast.error(data.message)
      }
      //
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }

  }

  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>
      {
        isEdit ? 
        <label htmlFor="image">
          <div className='inline-block relative cursor-pointer'>
            <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
            <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
          </div>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden />

        </label>
        : <img className='w-36 rounded' src={userData.image} alt="" />
      }

     
      {
        isEdit ? <input value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} type="text" /> : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
      }

      <hr className='bg-[#ADADAD] h-[1px] border-none' />

      <div>
        <p className='text-gray-600 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
          <p>Email id:</p>
          <p>{userData.email}</p>
          <p>Phone:</p>
          {
            isEdit ? <input value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} type="text" /> : <p>{userData.phone}</p>
          }
          <p>Address:</p>
          {
            isEdit ?
              <p>
                <input onChange={(e) => setUserData(prev => ({ ...prev ,address: {...prev.address, line1: e.target.value }}))} value={userData.address.line1} type="text" />
                <br />
                <input onChange={(e) => setUserData(prev => ({ ...prev ,address: {...prev.address, line2: e.target.value }}))} value={userData.address.line2} type="text" />
              </p> :
              <p>
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
          }

        </div>
      </div>
      <div>
        <p className='text-[#797979] underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
          <p className='font-medium'>Gender:</p>
          {isEdit ?
            <select onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            : <p className='text-gray-500'>{userData.gender}</p>
          }
          <p className='font-medium'>Birthday:</p>
          {
            isEdit ?
              <input type="date" onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} /> :
              <p className='text-gray-500'>{userData.dob}</p>
          }

        </div>
      </div>
      <div className='mt-10'>
        {
          isEdit ?
            <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={updateUserProfileData}>Save Information</button>
            : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile