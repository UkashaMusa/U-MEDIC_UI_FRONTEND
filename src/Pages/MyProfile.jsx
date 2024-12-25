import { useState } from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: 'Edward Vincent',
    image: assets.profile_pic,
    email: 'richardjameswap@gmail.com',
    phoneN0: '+1  123 456 7890',
    address: {
      line1: '57th Cross, Richmond ',
      line2: 'Circle, Church Road, London',
    },
    gender: 'Male',
    dob: '2000-01-20'
  })

  const [isEdit, setEdit] = useState(false);

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>
      <img className='w-36 rounded' src={userData.image} alt="" />
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
            isEdit ? <input value={userData.phoneN0} onChange={e => setUserData(prev => ({ ...prev, phoneN0: e.target.value }))} type="text" /> : <p>{userData.phoneN0}</p>
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
            <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setEdit(false)}>Save Information</button>
            : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={() => setEdit(true)}>Edit</button>
        }
      </div>
    </div>
  )
}

export default MyProfile