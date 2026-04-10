import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { getUser, updateUser, getAddresses, updateAddress, getSchoolDetails, updateSchoolDetails, getBankingDetails, updateBankingDetails, deleteAddress } from '../services/api';

// Composants réutilisables du formulaire, label et champ générique
function FieldLabel({ text, required = false, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-base md:text-lg font-medium mb-1">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function Field({ id, prefix = '', label, required = false, value, onChange, type = 'text', isEditing, profileCompleted }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isPhone = id === 'phone';
  const isAccountInfo = id === 'accountInfo';
  const isLoanInfo = id === 'loanInfo';
  const fieldId = prefix ? `${prefix}-${id}` : id;
  return (
    <div className="mb-4">
      <FieldLabel text={label} htmlFor={fieldId} required={required && (isEditing || !profileCompleted)} />
      {isEditing ? (
        <div className="relative">
          <input
            id={fieldId}
            name={fieldId}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            value={value}
            placeholder={isPassword ? 'Nouveau mot de passe' : isAccountInfo ? 'Ex. : 815-12345-1234567' : isLoanInfo ? 'Ex. : 12345-678' : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border-2 border-gray-200 px-3 py-2 rounded-lg text-sm md:text-base pr-10 hover:border-purple-400 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          {isPassword && (
            <button
              type="button"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-600 hover:text-gray-900">
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
          {isPassword && <p className="mt-1 text-sm md:text-base text-gray-600 ml-3">Laisser vide pour conserver le mot de passe actuel</p>}
        </div>
      ) : (
        <p className={`text-base md:text-lg ${value ? 'text-gray-700' : 'text-gray-600 italic'}`}>
          {isPassword ? '•••••••' : type === 'date' ? formatDateForDisplay(value) || 'Non renseigné' : value || 'Non renseigné'}
        </p>
      )}
    </div>
  );
}

// Champs d'adresse réutilisables pour l'adresse personnelle et au travail
const PROVINCES = ['QC', 'ON', 'NL', 'NS', 'PE', 'NB', 'MB', 'SK', 'AB', 'BC', 'YT', 'NT', 'NU'];
function AddressFields({ address, onChange, isEditing, profileCompleted, prefix }) {
  const update = (field, value) => onChange({ ...address, [field]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
      <Field
        prefix={prefix}
        id="streetNr"
        label="Numéro civique"
        required
        value={address.streetNumber}
        onChange={(value) => update('streetNumber', formatStreetNumber(value))}
        isEditing={isEditing}
        profileCompleted={profileCompleted}
      />
      <Field
        prefix={prefix}
        id="street"
        label="Rue"
        required
        value={address.streetName}
        onChange={(value) => update('streetName', formatStreetName(value))}
        isEditing={isEditing}
        profileCompleted={profileCompleted}
      />
      <Field
        prefix={prefix}
        id="city"
        label="Ville"
        required
        value={address.city}
        onChange={(value) => update('city', formatCityName(value))}
        isEditing={isEditing}
        profileCompleted={profileCompleted}
      />
      <div className="mb-4">
        <FieldLabel htmlFor={`${prefix}-province`} text="Province" required={!profileCompleted || isEditing} />
        {isEditing ? (
          <select
            id={`${prefix}-province`}
            name={`${prefix}-province`}
            value={address.province}
            onChange={(e) => update('province', e.target.value)}
            className="w-full border-2 border-gray-200 px-3 py-2 rounded-lg text-sm md:text-base pr-10 hover:border-purple-400 focus:ring-2 focus:ring-purple-500 focus:outline-none">
            <option value="">Sélectionner...</option>
            {PROVINCES.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        ) : (
          <p className={`text-base md:text-lg  ${address.province ? 'text-gray-700' : 'text-gray-600 italic'}`}>{address.province || 'Non renseigné'}</p>
        )}
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <p className="text-gray-800 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
            Annuler
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

const EMPTY_PERSONAL_INFO = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  birthDate: '',
  isActive: true,
};

const EMPTY_PERSONAL_ADDRESS = {
  streetNumber: '',
  streetName: '',
  city: '',
  province: '',
  country: 'CA',
  type: 'PERSONAL',
};

const EMPTY_WORK_ADDRESS = {
  streetNumber: '',
  streetName: '',
  city: '',
  province: '',
  country: 'CA',
  type: 'WORK',
};

const EMPTY_SCHOOL_INFO = {
  schoolName: '',
  fieldOfStudy: '',
  startDate: '',
  projectedEndDate: '',
};

const EMPTY_BANKING_INFO = {
  institutionName: '',
  accountInfo: '',
  loanInfo: '',
  other: '',
};

const EMPTY_SECTION_ERRORS = {
  personalAddress: '',
  workAddress: '',
  school: '',
  banking: '',
};

const capitalizeWords = (value) => value.toLowerCase().replace(/(^\s*\w|[\s-]\w)/g, (char) => char.toUpperCase());
const formatPersonName = (value) => capitalizeWords(value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, ''));
const formatPersonPhone = (value) => {
  const digits = cleanPhone(value);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};
const cleanPhone = (value) => {
  let digits = (value || '').replace(/[^0-9]/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
};
const formatStreetName = (value) => {
  const withSpace = value.replace(/(\d+)(st|nd|rd|th|ère|ere|re|e)([a-zA-ZÀ-ÿ])/gi, '$1$2 $3').replace(/(\d+)(?!st|nd|rd|th|ère|ere|re|e)([a-zA-ZÀ-ÿ]{2,})/gi, '$1 $2');
  return capitalizeWords(withSpace.replace(/[^a-zA-ZÀ-ÿ0-9\s.'-]/g, ''));
};
const formatCityName = (value) => capitalizeWords(value.replace(/[^a-zA-ZÀ-ÿ\s'-.]/g, ''));
const formatStreetNumber = (value) => {
  const cleaned = value.replace(/[^0-9a-zA-Z\-]/g, '').toUpperCase();
  if (/^[0-9]+[a-zA-Z]?$/.test(cleaned) || /^[0-9]+-[0-9]*$/.test(cleaned) || cleaned === '') {
    return cleaned;
  }
  return value.slice(0, -1);
};
const formatSchoolName = (value) => capitalizeWords(value.replace(/[^a-zA-ZÀ-ÿ0-9\s\-'.&]/g, ''));
const formatFieldOfStudy = (value) => capitalizeWords(value.replace(/[^a-zA-ZÀ-ÿ0-9\s\-'./]/g, ''));
const formatBankingName = (value) => capitalizeWords(value.replace(/[^a-zA-ZÀ-ÿ0-9\s\-'.&]/g, ''));
const formatAccountNumber = (value) => {
  const digits = value.replace(/[^0-9]/g, '').slice(0, 15);

  if (digits.length <= 3) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 8)}-${digits.slice(8)}`;
};
const formatLoanInfo = (value) => {
  const digits = value.replace(/[^0-9]/g, '').slice(0, 8);

  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatOtherInfo = (value) => value.replace(/[^a-zA-ZÀ-ÿ0-9\s\-'.,:/()#]/g, '');

const formatDateForDisplay = (value) => {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
};

const isValidPhone = (value) => cleanPhone(value).length === 10;

// Charge les données du profil depuis le backend
function UpdateProfile() {
  const { user } = useContext(UserContext);
  const userId = user?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [error, setError] = useState('');
  const [showWorkAddress, setShowWorkAddress] = useState(false);

  const [workAddressExistsInBackend, setWorkAddressExistsInBackend] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({
    firstName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [personalInfo, setPersonalInfo] = useState(EMPTY_PERSONAL_INFO);

  const [personalAddress, setPersonalAddress] = useState(EMPTY_PERSONAL_ADDRESS);

  const [workAddress, setWorkAddress] = useState(EMPTY_WORK_ADDRESS);

  const [schoolInfo, setSchoolInfo] = useState(EMPTY_SCHOOL_INFO);
  const [bankingInfo, setBankingInfo] = useState(EMPTY_BANKING_INFO);
  const [sectionErrors, setSectionErrors] = useState(EMPTY_SECTION_ERRORS);

  const passwordCriteria = {
    length: personalInfo.password.length >= 8,
    uppercase: /[A-Z]/.test(personalInfo.password),
    lowercase: /[a-z]/.test(personalInfo.password),
    number: /\d/.test(personalInfo.password),
  };

  const hasWorkAddressData = !!workAddress.streetNumber || !!workAddress.streetName || !!workAddress.city || !!workAddress.province;

  const toISODate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString();
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  const isAddressComplete = (address) => {
    return address.streetNumber.trim() !== '' && address.streetName.trim() !== '' && address.city.trim() !== '' && address.province.trim() !== '';
  };

  const isSchoolComplete = (school) => {
    return school.schoolName.trim() !== '' && school.fieldOfStudy.trim() !== '' && school.startDate.trim() !== '';
  };

  const isBankingComplete = (banking) => {
    return banking.institutionName.trim() !== '' && banking.accountInfo.trim() !== '';
  };
const isAtLeast18 = (birthDate) => {
  if (!birthDate) return false;

  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 18;
};
  // Validation des champs obligatoires avant sauvegarde
  const validateForm = () => {
    const newErrors = {
      firstName: '',
      email: '',
      password: '',
      phone: '',
      birthDate: '',

    };

    let isValid = true;

    if (!personalInfo.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis.';
      isValid = false;
    } else if (personalInfo.firstName.trim().length < 3) {
      newErrors.firstName = 'Le prénom doit contenir au moins 3 caractères.';
      isValid = false;
    }

    if (!personalInfo.email.trim()) {
      newErrors.email = 'Le courriel est requis.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      newErrors.email = 'Veuillez entrer un courriel valide.';
      isValid = false;
    }

    if (personalInfo.phone.trim() !== '' && !isValidPhone(personalInfo.phone)) {
      newErrors.phone = 'Veuillez entrer un numéro de téléphone valide.';
      isValid = false;
    }

    if (personalInfo.password.trim() !== '') {
      const isPasswordValid = passwordCriteria.length && passwordCriteria.uppercase && passwordCriteria.lowercase && passwordCriteria.number;

      if (!isPasswordValid) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.';
        isValid = false;
      }
    }
if (!personalInfo.birthDate) {
  newErrors.birthDate = 'La date de naissance est requise.';
  isValid = false;
} else if (!isAtLeast18(personalInfo.birthDate)) {
  newErrors.birthDate = 'Vous devez avoir au moins 18 ans.';
  isValid = false;
}

    setErrors(newErrors);
    return isValid;
  };

  // Charge les données du profil depuis le backend
  async function loadProfileData() {
    try {
      const userData = await getUser(userId);

      if (userData) {
        setPersonalInfo({
          firstName: formatPersonName(userData.firstName || ''),
          lastName: formatPersonName(userData.lastName || ''),
          email: userData.email || '',
          password: '',
          phone: cleanPhone(userData.phone),
          birthDate: formatDateForInput(userData.birthDate),
          isActive: userData.isActive ?? true,
        });
      }

      const [addressesResult, schoolResult, bankingResult] = await Promise.allSettled([getAddresses(userId), getSchoolDetails(userId), getBankingDetails(userId)]);

      if (addressesResult.status === 'fulfilled' && Array.isArray(addressesResult.value)) {
        const addresses = addressesResult.value;

        const personal = addresses.find((address) => address.type === 'PERSONAL');
        const work = addresses.find((address) => address.type === 'WORK');

        if (personal) {
          setPersonalAddress({
            ...EMPTY_PERSONAL_ADDRESS,
            streetNumber: personal.streetNumber || '',
            streetName: personal.streetName || '',
            city: personal.city || '',
            province: personal.province || '',
            country: personal.country || 'CA',
          });
        } else {
          setPersonalAddress(EMPTY_PERSONAL_ADDRESS);
        }

        if (work) {
          setWorkAddress({
            ...EMPTY_WORK_ADDRESS,
            streetNumber: work.streetNumber || '',
            streetName: work.streetName || '',
            city: work.city || '',
            province: work.province || '',
            country: work.country || 'CA',
          });

          setWorkAddressExistsInBackend(true);
          setShowWorkAddress(true);
        } else {
          setWorkAddress(EMPTY_WORK_ADDRESS);
          setWorkAddressExistsInBackend(false);
          setShowWorkAddress(false);
        }
      } else if (addressesResult.status === 'rejected') {
        if (addressesResult.reason?.response?.status === 404) {
          setPersonalAddress(EMPTY_PERSONAL_ADDRESS);
          setWorkAddress(EMPTY_WORK_ADDRESS);
          setShowWorkAddress(false);
          setWorkAddressExistsInBackend(false);
        } else {
          console.error('Erreur récupération adresses :', addressesResult.reason);
        }
      }

      if (schoolResult.status === 'fulfilled' && schoolResult.value) {
        const schoolData = schoolResult.value;

        setSchoolInfo({
          schoolName: schoolData.schoolName || '',
          fieldOfStudy: schoolData.fieldOfStudy || '',
          startDate: schoolData.startDate ? formatDateForInput(schoolData.startDate) : '',
          projectedEndDate: schoolData.projectedEndDate ? formatDateForInput(schoolData.projectedEndDate) : '',
        });
      } else if (schoolResult.status === 'rejected') {
        if (schoolResult.reason?.response?.status === 404) {
          setSchoolInfo(EMPTY_SCHOOL_INFO);
        } else {
          console.error('Erreur récupération école :', schoolResult.reason);
        }
      }
      if (bankingResult.status === 'fulfilled' && bankingResult.value) {
        const bankingData = bankingResult.value;

        setBankingInfo({
          institutionName: bankingData.institutionName || '',
          accountInfo: bankingData.accountInfo || '',
          loanInfo: bankingData.loanInfo || '',
          other: bankingData.other || '',
        });
      } else if (bankingResult.status === 'rejected') {
        if (bankingResult.reason?.response?.status === 404) {
          setBankingInfo(EMPTY_BANKING_INFO);
        } else {
          console.error('Erreur récupération bancaire :', bankingResult.reason);
        }
      }

      const isCompleted = !!userData?.firstName && !!userData?.email;
      setProfileCompleted(isCompleted);
    } catch (error) {
      console.error('Erreur chargement profil :', error);
      setError('Erreur lors du chargement du profil.');
    }
  }

  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  useEffect(() => {
    setSectionErrors((prev) => ({
      personalAddress: isAddressComplete(personalAddress) ? '' : prev.personalAddress,
      workAddress: isAddressComplete(workAddress) ? '' : prev.workAddress,
      school: isSchoolComplete(schoolInfo) ? '' : prev.school,
      banking: isBankingComplete(bankingInfo) ? '' : prev.banking,
    }));
  }, [personalAddress, workAddress, schoolInfo, bankingInfo]);

  // Sauvegarde les informations du profil, des adresses, de l'école et des renseignements bancaires
  const handleSave = async () => {
    if (!userId) {
      setError('Utilisateur introuvable.');
      return;
    }

    const isFormValid = validateForm();
    const newSectionErrors = { ...EMPTY_SECTION_ERRORS };

    let areSectionsValid = true;

    if (!isAddressComplete(personalAddress)) {
      newSectionErrors.personalAddress = "Veuillez remplir tous les champs requis de l'adresse personnelle.";
      areSectionsValid = false;
    }

    if (showWorkAddress && hasWorkAddressData && !isAddressComplete(workAddress)) {
      newSectionErrors.workAddress = "Veuillez remplir tous les champs requis de l'adresse au travail.";
      areSectionsValid = false;
    }

    if (!isSchoolComplete(schoolInfo)) {
      newSectionErrors.school = 'Veuillez remplir tous les champs requis des renseignements scolaires.';
      areSectionsValid = false;
    }

    if (!isBankingComplete(bankingInfo)) {
      newSectionErrors.banking = 'Veuillez remplir tous les champs requis des renseignements bancaires.';
      areSectionsValid = false;
    }

    setSectionErrors(newSectionErrors);

    if (!isFormValid || !areSectionsValid) {
      return;
    }

    try {
      await updateUser(userId, {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        password: personalInfo.password || undefined,
        phone: personalInfo.phone,
        birthDate: personalInfo.birthDate ? toISODate(personalInfo.birthDate) : null,
        isActive: personalInfo.isActive,
      });

      await updateAddress(userId, {
        ...personalAddress,
      });

      if (showWorkAddress && hasWorkAddressData) {
        await updateAddress(userId, { ...workAddress });
      }

      await updateSchoolDetails(userId, {
        schoolName: schoolInfo.schoolName,
        fieldOfStudy: schoolInfo.fieldOfStudy,
        startDate: toISODate(schoolInfo.startDate),
        projectedEndDate: schoolInfo.projectedEndDate ? toISODate(schoolInfo.projectedEndDate) : null,
      });

      await updateBankingDetails(userId, {
        institutionName: bankingInfo.institutionName,
        accountInfo: bankingInfo.accountInfo,
        loanInfo: bankingInfo.loanInfo,
        other: bankingInfo.other,
      });
      setIsEditing(false);

      try {
        await loadProfileData();
      } catch (reloadError) {
        console.error('Erreur rechargement profil :', reloadError);
      }

      setError('');
      setSuccessMessage('Votre profil a été mis à jour avec succès!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      console.error('Erreur sauvegarde profil :', error);
      setError('Une erreur est survenue lors de la sauvegarde.');
    }
  };
  // Réinitialise les erreurs et recharge les données initiales si l'utilisateur annule
  const handleCancel = async () => {
    setErrors({ firstName: '', email: '', password: '', phone: '' });
    setSectionErrors(EMPTY_SECTION_ERRORS);
    setError('');

    if (userId) {
      await loadProfileData();
    }

    setIsEditing(false);
  };
  // Supprime l'adresse de travail du backend et de l'interface
  const handleDeleteWorkAddress = async () => {
    if (!userId) return;

    try {
      if (workAddressExistsInBackend) {
        await deleteAddress(userId, 'WORK');
        setWorkAddressExistsInBackend(false);
      }

      setWorkAddress(EMPTY_WORK_ADDRESS);

      setShowWorkAddress(false);
      setSectionErrors((prev) => ({ ...prev, workAddress: '' }));
      setError('');
    } catch (error) {
      console.error('Erreur suppression adresse travail :', error);
      setError("Impossible de supprimer l'adresse au travail.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <main className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {showDeleteModal && (
        <ConfirmModal message="Voulez-vous vraiment supprimer l'adresse au travail ? Cette action est irréversible." onConfirm={handleDeleteWorkAddress} onCancel={() => setShowDeleteModal(false)} />
      )}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-2">
        <h1 className="text-2xl md:text-4xl font-bold text-violet-900">Détail du profil</h1>

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="bg-purple-600 text-white px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded shadow hover:bg-purple-700 self-start">
            Mettre à jour
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={handleCancel} className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              Annuler
            </button>
            <button onClick={handleSave} className="bg-purple-600 text-white px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded shadow hover:bg-purple-700">
              Sauvegarder
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm md:text-base mb-4">{error}</p>}
      {successMessage && (
        <div className="flex justify-center mb-4">
          <div className="text-green-700 font-bold text-sm md:text-base">{successMessage}</div>
        </div>
      )}

      {/* Renseignements personnels*/}
      <section className="bg-white shadow-md border border-gray-300 rounded p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Renseignements personnels</h2>

        {(isEditing || !profileCompleted) && (
          <p className="text-sm md:text-base text-gray-700 mb-4">
            Les champs marqués d'un <span className="text-red-500 font-bold">*</span> sont obligatoires.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <div>
            <Field
              prefix="personal"
              id="firstName"
              label="Prénom"
              required
              value={personalInfo.firstName}
              isEditing={isEditing}
              profileCompleted={profileCompleted}
              onChange={(newValue) => setPersonalInfo({ ...personalInfo, firstName: formatPersonName(newValue) })}
            />

            {errors.firstName && <p className="text-red-500 text-sm md:text-base mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Field
              prefix="personal"
              id="lastName"
              label="Nom"
              value={personalInfo.lastName}
              isEditing={isEditing}
              onChange={(newValue) => setPersonalInfo({ ...personalInfo, lastName: formatPersonName(newValue) })}
            />
          </div>
          <div>
            <Field
              prefix="personal"
              id="email"
              label="Courriel"
              required
              value={personalInfo.email}
              isEditing={isEditing}
              profileCompleted={profileCompleted}
              onChange={(newValue) => setPersonalInfo({ ...personalInfo, email: newValue })}
            />

            {errors.email && <p className="text-red-500 text-sm md:text-base mt-1">{errors.email}</p>}
          </div>
          <div>
            <Field
              prefix="personal"
              id="phone"
              label="Téléphone"
              value={formatPersonPhone(personalInfo.phone)}
              isEditing={isEditing}
              onChange={(newValue) => setPersonalInfo({ ...personalInfo, phone: cleanPhone(newValue) })}
            />
            {errors.phone && <p className="text-red-500 text-sm md:text-base mt-1">{errors.phone}</p>}
          </div>
       <div>
  <Field
    prefix="personal"
    id="birthDate"
    label="Date de naissance"
    type="date"
    value={personalInfo.birthDate}
    isEditing={isEditing}
    onChange={(newValue) =>
      setPersonalInfo({ ...personalInfo, birthDate: newValue })
    }
  />
  {errors.birthDate && (
    <p className="text-red-500 text-sm md:text-base mt-1">
      {errors.birthDate}
    </p>
  )}
</div>
          <div>
            <Field
              prefix="personal"
              id="password"
              label="Mot de passe"
              type="password"
              value={personalInfo.password}
              isEditing={isEditing}
              profileCompleted={profileCompleted}
              onChange={(newValue) => setPersonalInfo({ ...personalInfo, password: newValue })}
            />

            {errors.password && <p className="text-red-500 text-sm md:text-base mt-1">{errors.password}</p>}
          </div>
        </div>
      </section>

      {/* Adresses*/}
      <section className="bg-white shadow-md border border-gray-300 rounded p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Adresses</h2>

        <p className="text-lg md:text-xl font-semibold text-purple-700 mb-3">Adresse personnelle</p>
        {sectionErrors.personalAddress && <p className="text-red-500 text-sm md:text-base mb-3">{sectionErrors.personalAddress}</p>}

        <AddressFields prefix="personal" address={personalAddress} onChange={setPersonalAddress} isEditing={isEditing} profileCompleted={profileCompleted} />

        {isEditing && (
          <div className="mb-4 mt-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showWorkAddress"
                checked={showWorkAddress}
                onChange={(e) => {
                  setShowWorkAddress(e.target.checked);
                  if (!e.target.checked) {
                    setSectionErrors((prev) => ({ ...prev, workAddress: '' }));
                  }
                }}
                className="w-4 h-4 accent-purple-600"
              />
              <label htmlFor="showWorkAddress" className="text-lg md:text-xl font-semibold text-purple-700 cursor-pointer">
                Adresse au travail
              </label>
            </div>

            <p className="ml-6 mt-1 text-sm md:text-base text-gray-600">À remplir uniquement si applicable</p>
          </div>
        )}

        {isEditing && showWorkAddress && (
          <>
            {sectionErrors.workAddress && <p className="text-red-500 text-sm md:text-base mb-3">{sectionErrors.workAddress}</p>}
            <AddressFields prefix="work" address={workAddress} onChange={setWorkAddress} isEditing={isEditing} profileCompleted={profileCompleted} />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 text-sm font-medium text-red-500 border border-red-300 rounded hover:bg-red-600 hover:text-white transition">
                Supprimer l'adresse au travail
              </button>
            </div>
          </>
        )}

        {!isEditing && workAddressExistsInBackend && (
          <>
            <p className="text-base md:text-lg font-semibold text-purple-700 mb-3">Adresse au travail</p>
            <AddressFields prefix="work" address={workAddress} onChange={() => {}} isEditing={false} profileCompleted={profileCompleted} />
          </>
        )}
      </section>

      {/* Établissement scolaire*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white shadow-md border border-gray-300 rounded p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Établissement scolaire</h2>
          {sectionErrors.school && <p className="text-red-500 text-sm md:text-base mb-3">{sectionErrors.school}</p>}
          <div className="grid grid-cols-1 gap-1">
            <div>
              <Field
                prefix="school"
                id="schoolName"
                label="Nom de l'école"
                required
                value={schoolInfo.schoolName}
                isEditing={isEditing}
                profileCompleted={profileCompleted}
                onChange={(newValue) => setSchoolInfo({ ...schoolInfo, schoolName: formatSchoolName(newValue) })}
              />
            </div>

            <div>
              <Field
                prefix="school"
                id="fieldOfStudy"
                label="Programme"
                required
                value={schoolInfo.fieldOfStudy}
                isEditing={isEditing}
                profileCompleted={profileCompleted}
                onChange={(newValue) => setSchoolInfo({ ...schoolInfo, fieldOfStudy: formatFieldOfStudy(newValue) })}
              />
            </div>

            <div>
              <Field
                prefix="school"
                id="startDate"
                label="Date de début"
                required
                type="date"
                value={schoolInfo.startDate}
                isEditing={isEditing}
                profileCompleted={profileCompleted}
                onChange={(newValue) => setSchoolInfo({ ...schoolInfo, startDate: newValue })}
              />
            </div>

            <div>
              <Field
                prefix="school"
                id="projectedEndDate"
                label="Date de fin prévue"
                type="date"
                value={schoolInfo.projectedEndDate}
                isEditing={isEditing}
                onChange={(newValue) => setSchoolInfo({ ...schoolInfo, projectedEndDate: newValue })}
              />
            </div>
          </div>
        </section>

        {/* Renseignements bancaires */}
        <section className="bg-white shadow-md border border-gray-300 rounded p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Renseignements bancaires</h2>
          {sectionErrors.banking && <p className="text-red-500 text-sm md:text-base mb-3">{sectionErrors.banking}</p>}
          <div className="grid grid-cols-1 gap-1">
            <Field
              prefix="banking"
              id="institutionName"
              label="Nom de l'institution"
              required
              value={bankingInfo.institutionName}
              isEditing={isEditing}
              profileCompleted={profileCompleted}
              onChange={(newValue) => setBankingInfo({ ...bankingInfo, institutionName: formatBankingName(newValue) })}
            />

            <div>
              <Field
                prefix="banking"
                id="accountInfo"
                label="Info du compte"
                required
                value={bankingInfo.accountInfo}
                isEditing={isEditing}
                profileCompleted={profileCompleted}
                onChange={(newValue) => setBankingInfo({ ...bankingInfo, accountInfo: formatAccountNumber(newValue) })}
              />
            </div>

            <div>
              <Field
                prefix="banking"
                id="loanInfo"
                label="Info de prêt"
                value={bankingInfo.loanInfo}
                isEditing={isEditing}
                onChange={(newValue) => setBankingInfo({ ...bankingInfo, loanInfo: formatLoanInfo(newValue) })}
              />
            </div>

            <div>
              <Field
                prefix="banking"
                id="other"
                label="Autre"
                value={bankingInfo.other}
                isEditing={isEditing}
                onChange={(newValue) => setBankingInfo({ ...bankingInfo, other: formatOtherInfo(newValue) })}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default UpdateProfile;