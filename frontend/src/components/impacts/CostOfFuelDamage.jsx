import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

const environmentalDamageData = [
	{ name: "Coal", INR: 5000 , abc: 900  },       // Cost in $ or any unit for coal-related damage
	{ name: "Oil", INR: 4000 },        // Cost for oil-related damage
	{ name: "Gas", INR: 2500 },        // Cost for gas-related damage
	{ name: "Renewable", INR: 800 },   // Cost for renewable energy-related damage
];


const CostOfFuelDamage = () => {
	const [selectedTimeRange, setSelectedTimeRange] = useState("This name");

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex items-center justify-between mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Cost Overview</h2>

				<select
					className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 
          focus:ring-blue-500
          '
					INR={selectedTimeRange}
					onChange={(e) => setSelectedTimeRange(e.target.INR)}
				>
					<option>This Week</option>
					<option>This name</option>
					<option>This Quarter</option>
					<option>This Year</option>
				</select>
			</div>

			<div className='w-full h-80'>
				<ResponsiveContainer>
					<AreaChart data={environmentalDamageData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='name' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Area type='monotone' dataKey='INR' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
                        <Legend />
					</AreaChart>
                   
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default CostOfFuelDamage;
