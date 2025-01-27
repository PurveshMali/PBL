import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = () => {
	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='flex flex-col sm:flex-row items-center mb-6'>
				<img
					src="https://imgs.search.brave.com/ULAYhDRwYGxF8zO7TOVBH7OnpgV2IP7I-oUB_g1sJcw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8yMC83Ni9t/YW4tYXZhdGFyLXBy/b2ZpbGUtdmVjdG9y/LTIxMzcyMDc2Lmpw/Zw"
					alt='Profile'
					className='rounded-full w-20 h-20 object-cover mr-4'
				/>

				<div>
					<h3 className='text-lg font-semibold text-gray-100'>Purvesh Mali</h3>
					<p className='text-gray-400'>purvesh@gmail.com</p>
				</div>
			</div>

			<button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'>
				Edit Profile
			</button>
            <button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 ml-2 rounded transition duration-200 w-full sm:w-auto'>
				Log Out
			</button>
		</SettingSection>
	);
};
export default Profile;
