
 
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

 import Footer from "../Components/Footer";

import budgetImg from '../assets/budget.jpg'
 
export default function HomePage() {
    const navigate = useNavigate()
    const [loaded, setLoaded] = useState(false)
 
    useEffect(() => {
     
        setLoaded(true)
    }, [])
 
    const stats = [
        { title: 'Revenus', value: 12500, color: 'from-purple-600 via-purple-700 to-purple-800' },
        { title: 'Dépenses', value: 8200, color: 'from-red-400 to-red-500' },
        { title: 'Épargne', value: 4300, color: 'from-green-400 to-green-500' },
    ]
 
    const monthlyData = [
        { month: 'Jan', value: 3000 },
        { month: 'Fév', value: 2500 },
        { month: 'Mar', value: 3200 },
        { month: 'Avr', value: 2800 },
        { month: 'Mai', value: 3500 },
    ]
 
    const expenseData = [
        { name: 'Loyer', value: 1200, color: 'bg-purple-600' },
        { name: 'Alimentation', value: 600, color: 'bg-purple-400' },
        { name: 'Transport', value: 300, color: 'bg-purple-300' },
        { name: 'Loisirs', value: 100, color: 'bg-purple-200' },
    ]
 
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
 
       
 
            <div className="flex-1">
 
           
                <div className="bg-white py-16 px-8 flex flex-col items-center text-center border-b border-gray-100">
 
               
                <div className="w-full max-w-[500px] min-w-[300px] mb-10 mx-auto">
  <img
    src={budgetImg}
    alt="Illustration de gestion budgétaire"
    className="w-full h-auto object-contain shadow-md rounded-lg 
               transition-transform duration-500 ease-out hover:scale-105 hover:rotate-1"
  />
</div>
 
                    <h1 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-tight">
                        Prenez le contrôle de vos finances
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                        Une solution simple et intuitive pour suivre vos dépenses, visualiser vos revenus et atteindre vos objectifs d'épargne.
                    </p>
 
                    <button
                        className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white px-10 py-3.5 rounded-xl font-semibold shadow-xl hover:brightness-110 hover:scale-105 transition-all"
                        onClick={() => navigate('/inscription')}
                    >
                     inscription
                    </button>
                </div>
 
     
                <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
 
               
             <div className="flex flex-col gap-6">
  {[
    { text: "Gérez vos revenus et dépenses facilement.", icon: "💰", desc: "Enregistrez vos transactions en quelques secondes." },
    { text: "Suivez vos objectifs d'épargne.", icon: "📈", desc: "Visualisez votre progression vers vos projets." },
    { text: "Analyse des dépenses automatiquement", icon: "📊", desc: "Recevez des graphiques clairs et des rapports instantanés pour mieux comprendre vos habitudes de dépenses." },
    { text: "Alertes et notifications", icon: "🔔", desc: "Soyez averti en cas de dépassement de budget ou pour vos rappels d’épargne." }
  ].map((item, i) => (
    <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 flex gap-6 items-center shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
        {item.icon}
      </div>
      <div>
        <p className="text-lg text-gray-900 font-bold mb-1">{item.text}</p>
        <p className="text-gray-600 text-sm">{item.desc}</p>
      </div>
    </div>
  ))}
</div>
 
               <div className="bg-white rounded-3xl border border-gray-100 p-10 flex flex-col gap-8 shadow-sm transition-all duration-700 ease-out hover:scale-105 hover:shadow-2xl">
  {/* Header */}
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-bold text-gray-900">Aperçu récent</h2>
    <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-3 py-1 rounded-full">MAI 2025</span>
  </div>

  {/* Statistiques */}
  <div className="grid grid-cols-3 gap-4">
    {stats.map((stat, i) => (
      <div
        key={i}
        className={`p-5 rounded-2xl text-center text-white shadow bg-gradient-to-br ${stat.color} 
                   transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:brightness-110`}
      >
        <h3 className="text-xs opacity-80 mb-2 uppercase tracking-wider">{stat.title}</h3>
        <p className="text-xl font-extrabold">{stat.value.toLocaleString('fr-FR')} $</p>
      </div>
    ))}
  </div>

  {/* Données mensuelles */}
  <div className="space-y-4">
    {monthlyData.map((item, i) => (
      <div key={i} className="flex items-center gap-4">
        <span className="w-12 text-sm font-bold text-gray-600">{item.month}</span>
        <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-800 shadow-inner transition-all duration-1000 ease-out hover:brightness-110"
            style={{ width: loaded ? `${(item.value / 4000) * 100}%` : '0%' }}
          ></div>
        </div>
        <span className="w-16 text-sm text-gray-500 font-medium text-right">{item.value.toLocaleString('fr-FR')} $</span>
      </div>
    ))}
  </div>

  {/* Catégories de dépenses */}
  <div className="flex justify-between items-center border-t border-gray-100 pt-8 mt-2">
    {expenseData.map((exp, i) => (
      <div key={i} className="flex flex-col items-center gap-2.5">
        <div className={`w-12 h-12 rounded-full ${exp.color} shadow-lg border-4 border-white 
                        transition-transform duration-300 ease-out hover:scale-110 hover:brightness-110`}></div>
        <span className="text-xs uppercase tracking-widest font-bold text-gray-500">{exp.name}</span>
      </div>
    ))}
  </div>

  {/* Boutons */}
  <div className="flex gap-4 mt-2">
    <button className="flex-1 bg-purple-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-purple-700 transition shadow-md hover:scale-105">
      Voir le rapport complet
    </button>
    <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition hover:scale-105">
      Exporter
    </button>
  </div>
</div>
 
                </div>
            </div>
              <Footer />
        </div>
    )
}
 
