import React from 'react';

export const DashboardPage: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Total Sales (Today)</h3>
                    <p className="text-3xl font-bold text-gray-900">$1,234.56</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Transactions</h3>
                    <p className="text-3xl font-bold text-gray-900">45</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium mb-2">Top Product</h3>
                    <p className="text-3xl font-bold text-gray-900">Premium Coffee</p>
                </div>
            </div>
        </div>
    );
};
