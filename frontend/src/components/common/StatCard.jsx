import React from 'react'
import { motion } from "framer-motion";
import { Icon } from 'lucide-react';

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
			className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 shadow-[0_30px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl'
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_35%)]' />
			<div className='relative px-5 py-5 sm:p-6'>
				<span className='flex items-center text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>
					<Icon size={18} className='mr-2' style={{ color }} />
					{name}
				</span>
				<p className='mt-3 text-3xl font-semibold tracking-tight text-white'>{value}</p>
			</div>
		</motion.div>
  )
}

export default StatCard
