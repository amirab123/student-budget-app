import React, { useState, useEffect, useContext } from "react";
import { getTransactions } from "../services/api";
import { UserContext } from "../context/UserContext";

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const userId = user?.id;

  const [transactions, setTransactions] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const data = await getTransactions(userId);
      setTransactions(data);
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    setRevenues(transactions.filter(t => t.type === "Revenue"));
    setExpenses(transactions.filter(t => t.type === "Expense"));
  }, [transactions]);

  const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const balance = totalRevenue - totalExpenses;

  const formatAmount = (value) =>
    Number(value).toLocaleString("fr-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const revenuePercent = totalRevenue + totalExpenses === 0 ? 0 : (totalRevenue / (totalRevenue + totalExpenses)) * 100;
  const expensePercent = 100 - revenuePercent;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-violet-900 mb-6">Dashboard Budgétaire</h1>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Total Revenus</h3>
          <p className="text-xl font-bold text-green-600">{formatAmount(totalRevenue)} $</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Total Dépenses</h3>
          <p className="text-xl font-bold text-red-600">{formatAmount(totalExpenses)} $</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-gray-500 text-sm">Balance</h3>
          <p className={`text-xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            {balance >= 0 ? `+${formatAmount(balance)} $` : `${formatAmount(balance)} $`}
          </p>
        </div>
      </div>

      {/* Graphique simple barre */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Répartition Revenus / Dépenses</h2>
        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden flex">
          <div
            className="bg-green-500 h-full transition-all"
            style={{ width: `${revenuePercent}%` }}
          ></div>
          <div
            className="bg-red-500 h-full transition-all"
            style={{ width: `${expensePercent}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Revenus {revenuePercent.toFixed(1)}%</span>
          <span>Dépenses {expensePercent.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}