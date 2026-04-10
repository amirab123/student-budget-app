import React, { useState, useEffect, useContext } from "react";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../services/api";
import { UserContext } from "../context/UserContext";

const BudgetPage = () => {
  const { user } = useContext(UserContext);
  const userId = user?.id;
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [newRevenue, setNewRevenue] = useState({
    description: "",
    category: "",
    amount: "",
    isRecurring: false,
  });

  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "",
    amount: "",
    isRecurring: false,
  });
  const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorsRevenue, setErrorsRevenue] = useState({});
  const [errorsExpense, setErrorsExpense] = useState({});

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };


  const validate = (data, type = "revenue") => {
    let errors = {};

    if (!data.description.trim()) {
      errors.description = "La description est obligatoire";
    }

    if (!data.amount) {
      errors.amount = "Le montant est obligatoire";
    } else if (isNaN(data.amount)) {
      errors.amount = "Le montant doit être un nombre";
    } else if (Number(data.amount) < 0) {
      errors.amount = "Le montant doit être positif";
    }

    if (type === "expense") {
      if (!data.category || data.category.trim().length < 3) {
        errors.category = "Minimum 3 caractères";
      }
    }

    return errors;
  };
const formatAmount = (value) => {
  return Number(value).toLocaleString("fr-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getDefaultDates = (isRecurring = false) => {
    const startDate = new Date();
    const format = (d) => d.toISOString().split("T")[0];
    return { startDate: format(startDate), endDate: isRecurring ? format(startDate) : null };
  };
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const transactions = await getTransactions(userId);
      setRevenues(transactions.filter((t) => t.type === "Revenue"));
      setExpenses(transactions.filter((t) => t.type === "Expense"));
    };

    fetchData();
  }, [userId]);
  const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const balance = totalRevenue - totalExpenses;

const handleAddRevenue = async () => {
  if (!userId) {
    showToast("Utilisateur non défini ❌");
    return;
  }


  const errors = validate(newRevenue, "revenue");
  if (Object.keys(errors).length > 0) {
    setErrorsRevenue(errors);
    return;
  }
  setErrorsRevenue({});


  const { startDate, endDate } = getDefaultDates(newRevenue.isRecurring);


  const transaction = {
    ...newRevenue,
    amount: Number(newRevenue.amount),
    type: "Revenue",
    userId,
    startDate,
    endDate,
    frequency: newRevenue.frequency || 1, 
  };

  try {
    const added = await addTransaction(transaction, userId);

    if (!added || !added.id) {
      showToast("Erreur : transaction non ajoutée ❌");
      return;
    }

  
    setRevenues(prev => [...prev, added]);
    setNewRevenue({ description: "", category: "", amount: "", isRecurring: false, frequency: 1 });
    showToast("Revenu ajouté ✅");
  } catch (error) {
    console.error("Erreur ajout revenu :", error);
    showToast("Erreur ajout revenu ❌");
  }
};

const handleAddExpense = async () => {
  if (!userId) {
    showlesToast("Utilisateur non défini ❌");
    return;
  }


  const errors = validate(newExpense, "expense");
  if (Object.keys(errors).length > 0) {
    setErrorsExpense(errors);
    return;
  }
  setErrorsExpense({});


  const { startDate, endDate } = getDefaultDates(newExpense.isRecurring);


  const transaction = {
    ...newExpense,
    amount: Number(newExpense.amount),
    type: "Expense",
    userId,
    startDate,
    endDate,
    frequency: newExpense.frequency || 1, 
  };

  try {
    const added = await addTransaction(transaction, userId);

    if (!added || !added.id) {
      showToast("Erreur : transaction non ajoutée ❌");
      return;
    }

 
    setExpenses(prev => [...prev, added]);
    setNewExpense({ description: "", category: "", amount: "", isRecurring: false, frequency: 1 });
    showToast("Dépense ajoutée ✅");
  } catch (error) {
    console.error("Erreur ajout dépense :", error);
    showToast("Erreur ajout dépense ❌");
  }
};

  const inputStyle = (error, value) =>
    `border rounded px-2 w-full outline-none transition-all
     ${
       error
         ? "border-red-500"
         : value
         ? "border-green-500"
         : "border-violet-500 focus:ring-2 focus:ring-violet-400"
     }`;
  const toggleFrequency = async (r, type) => {
    try {
      const isRecurring = Number(r.frequency) === 1;
      const updatedData = { frequency: isRecurring ? -1 : 1 };
      const updated = await updateTransaction(userId, r.id, updatedData);

      if (type === "Revenue") {
        setRevenues((prev) => prev.map((item) => (item.id === r.id ? updated : item)));
      }
      showToast("Récurrence mise à jour ✅");
    } catch (error) {
      console.error("ERREUR :", error.response?.data || error);
      showToast("Erreur mise à jour ❌");
    }
  };

  const openDeleteModal = (id, type) => {
    setTransactionToDelete({ id, type });
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteTransaction(userId, id);
      if (type === "Revenue") setRevenues(revenues.filter((r) => r.id !== id));
      else setExpenses(expenses.filter((e) => e.id !== id));
      showToast("Transaction supprimée ✅");
    } catch (error) {
      console.error(error);
      showToast("Erreur suppression ❌");
    }
  };
  
    const handleNewMonth = () => setShowConfirmModal(true);
  
    const confirmNewMonth = async () => {
      setShowConfirmModal(false);
      try {
        const recurringExpenses = expenses.filter((t) => t.frequency === 1);
        const nonRecurringExpenses = expenses.filter((t) => t.frequency === -1);
        const recurringRevenues = revenues.filter((t) => t.frequency === 1);
        const nonRecurringRevenues = revenues.filter((t) => t.frequency === -1);
  
        const allNonRecurring = [...nonRecurringExpenses, ...nonRecurringRevenues];
        await Promise.all(allNonRecurring.map((t) => deleteTransaction(userId, t.id)));
  
        setExpenses(recurringExpenses);
        setRevenues(recurringRevenues);
        showToast("Nouveau mois activé ✅ !");
      } catch (error) {
        console.error(error);
        showToast("Erreur !");
      }
    };
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
 
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <p className="text-lg font-semibold">
          Votre balance ce mois-ci :
        <span className={balance >= 0 ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
  {balance >= 0
    ? `+${formatAmount(balance)}`
    : formatAmount(balance)}
</span>
        </p>
        <button
          onClick={handleNewMonth}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
        >
          Nouveau mois
        </button>
     
 </div>
      <h1 className="text-xl font-bold mb-4 text-violet-900">Budget Mensuel</h1>
   

      {/* REVENUES */}
      <div className="mb-8">
        <h2 className="font-bold mb-2">Revenus</h2>

         <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Montant</th>
                <th className="p-2 text-left  hidden md:table-cell">Récurrent</th>
                <th className="p-2 text-left hidden md:table-cell "></th>
              </tr>
            </thead>
    <tbody>
            {revenues.map((r) => (
              <tr key={r.id}>
                <td className="p-2">{r.description}</td>
                <td className="p-2">{r.amount} $</td>
                   <td className="p-2 hidden md:table-cell">
                    <button
                      onClick={() => toggleFrequency(r, "Revenue")}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all
                        ${r.frequency === 1 ? "bg-green-500 border-green-600" : "bg-gray-200 border-gray-400"}`}
                      title={r.frequency === 1 ? "Récurrent" : "Non récurrent"}
                    >
                      {r.frequency === 1 && <span className="text-white text-xs">✓</span>}
                    </button>
                  </td>
                  <td className="p-2 hidden md:table-cell">
                    <button
                      onClick={() => openDeleteModal(r.id, "Revenue")}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Supprimer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 6h18v2H3V6zm2 3h14v13H5V9zm5-5h4v2h-4V4z" />
                      </svg>
                    </button>
                  </td>
              </tr>
            ))}

            {/* INPUT */}
            <tr>
              <td className="p-2">
                <input
                  className={inputStyle(errorsRevenue.description, newRevenue.description)}
                  value={newRevenue.description}
                  onChange={(e) =>
                    setNewRevenue({ ...newRevenue, description: e.target.value })
                  }
                  placeholder="Description"
                />
                {errorsRevenue.description && (
                  <p className="text-red-500 text-sm">{errorsRevenue.description}</p>
                )}
              </td>

              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  className={inputStyle(errorsRevenue.amount, newRevenue.amount)}
                  value={newRevenue.amount}
                  onChange={(e) =>
                    setNewRevenue({ ...newRevenue, amount: e.target.value })
                  }
                  placeholder="Montant"
                />
                {errorsRevenue.amount && (
                  <p className="text-red-500 text-sm">{errorsRevenue.amount}</p>
                )}
              </td>

              <td>
                <button onClick={handleAddRevenue} className="text-green-600 font-bold">
                  Ajouter
                </button>
              </td>

            </tr>
      </tbody>
        </table>
             </div>
                <p className="text-right font-semibold mt-2">Total des Revenus : {formatAmount(totalRevenue)} $</p>
      </div>

      {/* EXPENSES */}
      <div className="mb-8">
        <h2 className="font-bold mb-2">Dépenses</h2>

    
          <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Catégorie</th>
                <th className="p-2 text-left">Coût</th>
                <th className="p-2 text-left hidden md:table-cell">Récurrence</th>
                <th className="p-2 text-left hidden md:table-cell"></th>
              </tr>
            </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td className="p-2">{e.description}</td>
                <td className="p-2">{e.category}</td>
                <td className="p-2">{e.amount} $</td>
                    <td className="p-2 hidden md:table-cell">
                                    <select
                                      className={`border rounded px-2 py-1 transition-all
                                        ${e.frequency === 1 ? "bg-green-100 border-green-400" : "bg-gray-100 border-gray-300"}`}
                                      value={e.frequency === 1 ? "Mensuelle" : ""}
                                      title={e.frequency === 1 ? "Récurrence" : "Non Récurrence"}
                                      onChange={async (event) => {
                                        const freqValue = event.target.value === "Mensuelle" ? 1 : -1;
                                        setExpenses((prev) => prev.map((item) => (item.id === e.id ? { ...item, frequency: freqValue } : item)));
                                        try {
                                          await updateTransaction(userId, e.id, { ...e, frequency: freqValue });
                                          showToast("Récurrence mise à jour ✅");
                                        } catch (error) {
                                          console.error("Erreur update fréquence :", error);
                                        }
                                      }}
                                    >
                                      <option value="">-</option>
                                      <option value="Mensuelle">Mensuelle</option>
                                    </select>
                                  </td>
                                  <td className="p-2 hidden md:table-cell">
                                    <button
                                      onClick={() => openDeleteModal(e.id, "Expense")}
                                      className="text-red-500 hover:text-red-700 transition-colors"
                                      title="Supprimer"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 6h18v2H3V6zm2 3h14v13H5V9zm5-5h4v2h-4V4z" />
                                      </svg>
                                    </button>
                                  </td>
              </tr>
            ))}

    
            <tr>
              <td className="p-2">
                <input
                  className={inputStyle(errorsExpense.description, newExpense.description)}
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, description: e.target.value })
                  }
                  placeholder="Description"
                />
                {errorsExpense.description && (
                  <p className="text-red-500 text-sm">{errorsExpense.description}</p>
                )}
              </td>

              <td className="p-2">
                <input
                  className={inputStyle(errorsExpense.category, newExpense.category)}
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  placeholder="Catégorie"
                />
                {errorsExpense.category && (
                  <p className="text-red-500 text-sm">{errorsExpense.category}</p>
                )}
              </td>

              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  className={inputStyle(errorsExpense.amount, newExpense.amount)}
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  placeholder="Coût"
                />
                {errorsExpense.amount && (
                  <p className="text-red-500 text-sm">{errorsExpense.amount}</p>
                )}
              </td>

              <td>
                <button onClick={handleAddExpense} className="text-green-600 font-bold">
                  Ajouter
                </button>
              </td>
            </tr>
          </tbody>
        </table>
             <p className="text-right font-semibold mt-2">Total des Dépenses : {formatAmount(totalExpenses)} $</p>
      </div>
         </div>
   
         {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
        bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 animate-modal-pop">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Supprimer cette transaction ?</h2>
            <p className="text-gray-600 mb-6">Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  handleDelete(transactionToDelete.id, transactionToDelete.type);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-5 right-5 bg-violet-900 text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirmer le changement de mois</h2>
            <p className="text-gray-600 mb-6">Toutes les transactions non récurrentes seront supprimées.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">
                Annuler
              </button>
              <button onClick={confirmNewMonth} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;