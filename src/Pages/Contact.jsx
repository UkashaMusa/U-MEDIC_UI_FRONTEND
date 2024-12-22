import { assets } from '../assets/assets'
import {Link} from 'react-router-dom'

const Contact = () => {

  return (
    <div>
      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className=' font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className=' text-gray-500'>
          54709 Willms Station <br />Suite 350, Washington, USA
          </p>
          <p className=' text-gray-500'> 
          Tel: (+250) 792-402-035 <br />
          Email: umusa7677@gmail.com
          </p>
          <p className=' font-semibold text-lg text-gray-600'>CAREERS AT PRESCRIPTO</p>
          <p className=' text-gray-500'>Learn more about our teams and job openings.</p>
          <Link to='https://www.careerjet.com/jobad/us057b63e6996723a696428bf1455ebee3' target='blank' className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</Link>
        </div>
      </div>
    </div>
  )
}

export default Contact