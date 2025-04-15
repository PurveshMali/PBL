import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer } from "recharts";



const STATE_DATA = [
	{ id: 1, name: "Maharashtra", category: "Thermal", emissions: 250, powerCapacity: 10000, activePlants: 32 },
	{ id: 2, name: "Gujarat", category: "Solar", emissions: 75, powerCapacity: 12000, activePlants: 28 },
	{ id: 3, name: "Tamil Nadu", category: "Wind", emissions: 60, powerCapacity: 8000, activePlants: 25 },
	{ id: 4, name: "Rajasthan", category: "Solar", emissions: 90, powerCapacity: 9500, activePlants: 22 },
	{ id: 5, name: "Chhattisgarh", category: "Thermal", emissions: 280, powerCapacity: 11000, activePlants: 30 },
	{ id: 6, name: "Karnataka", category: "Hydro", emissions: 50, powerCapacity: 6000, activePlants: 18 },
	{ id: 7, name: "Uttar Pradesh", category: "Thermal", emissions: 300, powerCapacity: 13000, activePlants: 36 },
	{ id: 8, name: "West Bengal", category: "Thermal", emissions: 200, powerCapacity: 9000, activePlants: 27 },
	{ id: 9, name: "Punjab", category: "Biomass", emissions: 150, powerCapacity: 4500, activePlants: 14 },
	{ id: 10, name: "Kerala", category: "Hydro", emissions: 40, powerCapacity: 3500, activePlants: 10 },
];


const StateTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState(STATE_DATA);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = STATE_DATA.filter(
			(product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
		);

		setFilteredProducts(filtered);
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Power Plants List</h2>
				
					<div className='relative'>
					<input
						type='text'
						placeholder='Search...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Category
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								emmision
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								powerCapacity
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								activePlants
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredProducts.map((product) => (
							<motion.tr
								key={product.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
									<img
										src='https://as1.ftcdn.net/v2/jpg/01/10/63/64/1000_F_110636424_GTjxS2dhvoj9CbCg3gfgUt3ak4PJwy23.jpg'
										className='size-10 rounded-full'
									/>
									{product.name}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{product.category}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{product.emissions.toFixed(2)}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.powerCapacity}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.activePlants}</td>
								
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default StateTable;
