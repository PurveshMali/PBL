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
	const [selectedTimeRange, setSelectedTimeRange] = useState("This Week");

	return (
		<motion.div
			className='mb-8 rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<p className='text-[11px] uppercase tracking-[0.35em] text-slate-400'>Cost impact</p>
					<h2 className='mt-2 text-xl font-semibold text-white'>Cost Overview</h2>
				</div>

				<select
					className='rounded-full border border-white/10 bg-white/5 px-3 py-2 text-slate-200 outline-none focus:border-emerald-400/40 
          focus:ring-blue-500
          '
					value={selectedTimeRange}
					onChange={(e) => setSelectedTimeRange(e.target.value)}
				>
					<option>This Week</option>
					<option>This Month</option>
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
							contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "16px" }}
							itemStyle={{ color: "#E2E8F0" }}
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
