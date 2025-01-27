import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const stateData = [
	{ name: "Maharashtra", powerPlants: 45, value: 12000, renewables: 35 }, // values in tons, % for renewables
	{ name: "Gujarat", powerPlants: 38, value: 9800, renewables: 50 },
	{ name: "Tamil Nadu", powerPlants: 42, value: 8700, renewables: 60 },
	{ name: "Uttar Pradesh", powerPlants: 50, value: 14500, renewables: 20 },
	{ name: "Rajasthan", powerPlants: 30, value: 8000, renewables: 55 },
	{ name: "Karnataka", powerPlants: 28, value: 7200, renewables: 65 },
	{ name: "West Bengal", powerPlants: 40, value: 11000, renewables: 25 },
	{ name: "Madhya Pradesh", powerPlants: 35, value: 9500, renewables: 40 },
	{ name: "Andhra Pradesh", powerPlants: 36, value: 8700, renewables: 50 },
	{ name: "Punjab", powerPlants: 22, value: 5600, renewables: 30 },
	{ name: "Haryana", powerPlants: 18, value: 4800, renewables: 25 },
	{ name: "Bihar", powerPlants: 27, value: 7700, renewables: 20 },
	{ name: "Chhattisgarh", powerPlants: 33, value: 9700, renewables: 30 },
	{ name: "Odisha", powerPlants: 40, value: 12500, renewables: 35 },
	{ name: "Kerala", powerPlants: 15, value: 3200, renewables: 75 },
	{ name: "Jharkhand", powerPlants: 25, value: 8500, renewables: 15 },
	{ name: "Assam", powerPlants: 18, value: 4100, renewables: 20 },
	{ name: "Telangana", powerPlants: 28, value: 7200, renewables: 45 },
	{ name: "Delhi", powerPlants: 10, value: 2400, renewables: 10 },
	{ name: "Himachal Pradesh", powerPlants: 8, value: 1200, renewables: 80 },
];


const StateEmission = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Emmision By States</h2>

			<div className='h-80'>
				<ResponsiveContainer>
					<BarChart data={stateData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey='name' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Bar dataKey={"value"} fill='#8884d8'>
							{stateData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default StateEmission;
