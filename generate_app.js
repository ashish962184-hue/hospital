const fs = require('fs');
const path = require('path');

const dirs = [
  'frontend/src/components',
  'frontend/src/pages',
  'frontend/src/layouts',
  'frontend/src/utils',
  'frontend/src/store',
  'backend/src/controllers',
  'backend/src/routes',
  'backend/src/models',
  'backend/src/middleware',
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

const files = {
  'frontend/tailwind.config.js': `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        teal: {
          50: '#f0fdfa',
          500: '#14b8a6',
          600: '#0d9488',
        }
      }
    },
  },
  plugins: [],
}
`,
  'frontend/postcss.config.js': `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
  'frontend/src/index.css': `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-900;
  }
}
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
`,
  'frontend/src/App.jsx': `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* Add more routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
`,
  'frontend/src/main.jsx': `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,
  'frontend/src/pages/Login.jsx': `
import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="glass p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-primary-900 mb-6">Hospital Management System</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" placeholder="admin@hospital.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" placeholder="••••••••" />
          </div>
          <button className="w-full bg-primary-600 text-white p-2 rounded-md hover:bg-primary-700 transition">Login</button>
        </form>
      </div>
    </div>
  );
};
export default Login;
`,
  'frontend/src/layouts/DashboardLayout.jsx': `
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity, Users, Calendar, FileText, Settings, LogOut } from 'lucide-react';

const Sidebar = () => (
  <div className="w-64 bg-primary-900 text-white min-h-screen p-4 flex flex-col">
    <div className="flex items-center space-x-2 mb-8 mt-2">
      <Activity className="h-8 w-8 text-teal-400" />
      <span className="text-xl font-bold">HealthSync</span>
    </div>
    
    <nav className="flex-1 space-y-2">
      <NavItem icon={<Activity />} label="Dashboard" to="/" active />
      <NavItem icon={<Calendar />} label="Appointments" to="/appointments" />
      <NavItem icon={<Users />} label="Patients" to="/patients" />
      <NavItem icon={<FileText />} label="Prescriptions" to="/prescriptions" />
      <NavItem icon={<Settings />} label="Settings" to="/settings" />
    </nav>
    
    <div className="border-t border-primary-700 pt-4 mt-auto">
      <button className="flex items-center space-x-3 p-2 w-full hover:bg-primary-800 rounded text-left">
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  </div>
);

const NavItem = ({ icon, label, to, active }) => (
  <Link to={to} className={\`flex items-center space-x-3 p-3 rounded-lg transition \${active ? 'bg-primary-800' : 'hover:bg-primary-800'}\`}>
    {React.cloneElement(icon, { className: 'h-5 w-5' })}
    <span>{label}</span>
  </Link>
);

const DashboardLayout = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4 flex justify-between items-center glass sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="bg-slate-100 p-2 rounded-full">
              <span className="text-sm font-medium text-slate-600">Admin User</span>
            </div>
          </div>
        </header>
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
`,
  'frontend/src/pages/AdminDashboard.jsx': `
import React from 'react';
import { Users, UserPlus, Calendar, IndianRupee } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', patients: 400, revenue: 2400 },
  { name: 'Tue', patients: 300, revenue: 1398 },
  { name: 'Wed', patients: 200, revenue: 9800 },
  { name: 'Thu', patients: 278, revenue: 3908 },
  { name: 'Fri', patients: 189, revenue: 4800 },
  { name: 'Sat', patients: 239, revenue: 3800 },
  { name: 'Sun', patients: 349, revenue: 4300 },
];

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      <p className={\`text-xs mt-2 \${trend > 0 ? 'text-teal-600' : 'text-red-500'}\`}>
        {trend > 0 ? '+' : ''}{trend}% from last week
      </p>
    </div>
    <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
      {icon}
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value="12,345" icon={<Users className="h-6 w-6"/>} trend={12} />
        <StatCard title="New Patients" value="142" icon={<UserPlus className="h-6 w-6"/>} trend={5} />
        <StatCard title="Appointments" value="89" icon={<Calendar className="h-6 w-6"/>} trend={-2} />
        <StatCard title="Revenue" value="$45,231" icon={<IndianRupee className="h-6 w-6"/>} trend={8} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Activity Overview</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Add more widgets like recent appointments table here */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Recent Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-medium">Patient</th>
                <th className="p-4 font-medium">Doctor</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 text-slate-800 font-medium">John Doe</td>
                <td className="p-4 text-slate-600">Dr. Sarah Smith</td>
                <td className="p-4 text-slate-600">May 29, 10:00 AM</td>
                <td className="p-4"><span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">Confirmed</span></td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 text-slate-800 font-medium">Jane Smith</td>
                <td className="p-4 text-slate-600">Dr. Michael Chen</td>
                <td className="p-4 text-slate-600">May 29, 11:30 AM</td>
                <td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pending</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
`,
  'backend/src/index.js': `
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hospital Management API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`,
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content.trim() + '\\n');
}
console.log("App scaffolded successfully.");
