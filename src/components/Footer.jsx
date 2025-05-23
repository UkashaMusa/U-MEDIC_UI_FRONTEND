import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid  grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* ---Left side --- */}
            <div>
                <img className='mb-5 w-40 ' src={assets.logo} alt="" />
                <p className='w-full md:1/2 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            {/* ---Middle side---- */}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600 '>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li className='hover:underline text-primary cursor-pointer'>Privacy policy</li>
                </ul>

            </div>
            {/* ---Right side --- */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600 '>
                    <li>+250-792-402-035</li>
                    <li className='text-primary hover:underline cursor-pointer'>info@umedic.com</li>
                </ul>

            </div>
        </div>
        {/* ----CopyRight--- text */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright © 2024 UMedic - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer;