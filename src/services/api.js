import axios from "axios";


const API_URL = "https://money-pie-2.fly.dev/api/v1";


export async function getUserByEmail(email) {
  const response = await fetch(`${API_URL}/users/email/${email}`);
 
  if (!response.ok) {
    throw new Error('Utilisateur introuvable');
  }
 
  return response.json();
}
 
export async function getUserById(userId) {
  const response = await fetch(`https://money-pie-2.fly.dev/api/v1/users/${userId}`);
 
  if (!response.ok) {
    throw new Error('Utilisateur introuvable');
  }
 
  return response.json();
}
export async function signupUser(payload) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
 
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de l'inscription");
  }
 
  return response.json();
}
 
export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des utilisateurs');
  }
  return response.json();
}
 
export const getTransactions = async (userId = DEFAULT_USER_ID) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Erreur récupération transactions :', error);
    throw error;
  }
};
 
export const addTransaction = async (transactionData, userId = DEFAULT_USER_ID) => {
  try {
    if (!transactionData.userId) transactionData.userId = userId;
 
    const response = await axios.post(`${API_URL}/users/${userId}/transactions`, transactionData);
    return response.data;
  } catch (error) {
    console.error('Erreur ajout transaction :', error);
    throw error;
  }
};
 
export const updateTransaction = async (userId = DEFAULT_USER_ID, id, data) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur modification transaction :', error);
    throw error;
  }
};
 
export const deleteTransaction = async (userId = DEFAULT_USER_ID, transactionId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur suppression transaction :', error);
    throw error;
  }
};
 
// ─────────────────────────────────────────
// PROFILE (Hannela)
// ─────────────────────────────────────────
 
export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur récupération utilisateur :', error);
    throw error;
  }
};
 
export const updateUser = async (userId, data) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur mise à jour utilisateur :', error);
    throw error;
  }
};
 
export const getAddresses = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/addresses`);
    return response.data;
  } catch (error) {
    console.error('Erreur récupération adresses :', error);
    throw error;
  }
};
 
export const updateAddress = async (userId, data) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}/addresses`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur mise à jour adresse :', error);
    throw error;
  }
};
 
export const getSchoolDetails = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/school-details`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
 
export const updateSchoolDetails = async (userId, data) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}/school-details`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur mise à jour école :', error);
    throw error;
  }
};
 
export const getBankingDetails = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/banking-details`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
 
export const updateBankingDetails = async (userId, data) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}/banking-details`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur mise à jour bancaire :', error);
    throw error;
  }
};
 


 
export async function deleteAddress(userId, addressType) {
  const response = await fetch(`${API_URL}/users/${userId}/addresses/${addressType}`, {
    method: 'DELETE',
  });
 
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'adresse");
  }
 
  return response;
}
 