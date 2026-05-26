import { useState, useEffect } from 'react';
import { isAdult, isValidPostalCode, isValidName, isValidEmail } from './utils/module.js';


const STORAGE_KEY = 'registrations';

const initialFormData = {
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    ville: '',
    codePostal: '',
};



function validate(data) {
    const errors = {};

    if (!isValidName(data.nom))
        errors.nom = 'Nom invalide (lettres, accents et tirets uniquement).';

    if (!isValidName(data.prenom))
        errors.prenom = 'Prénom invalide (lettres, accents et tirets uniquement).';

    if (!isValidEmail(data.email))
        errors.email = 'Adresse e-mail invalide.';

    if (!data.dateNaissance) {
        errors.dateNaissance = 'La date de naissance est requise.';
    } else {
        const birth = new Date(data.dateNaissance);

            if (!isAdult({ birth }))
                errors.dateNaissance = 'Vous devez avoir au moins 18 ans.';

    }

    if (!isValidName(data.ville))
        errors.ville = 'Ville invalide (lettres, accents et tirets uniquement).';

    if (!isValidPostalCode(data.codePostal))
        errors.codePostal = 'Code postal invalide (5 chiffres).';

    return errors;
}



function saveToLocalStorage(entry) {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push({ ...entry, registeredAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}


function RegistrationForm() {
    const [formData, setFormData] = useState(initialFormData);
    const [touched, setTouched]   = useState({});
    const [toast, setToast]       = useState(null);

    const errors      = validate(formData);
    const isFormValid = Object.keys(errors).length === 0;


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        saveToLocalStorage(formData);
        setToast(`Bienvenue ${formData.prenom} ${formData.nom} ! Inscription réussie 🎉`);
        setFormData(initialFormData);
        setTouched({});
    };

    useEffect(() => {
        if (!toast) return;
        const id = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(id);
    }, [toast]);



    const fieldError  = (name) => touched[name] && errors[name];
    const inputClass  = (name) => fieldError(name) ? 'input-error' : '';

    return (
        <>
            {toast && (
                <div className="toast toast-success" role="alert">
                    {toast}
                </div>
            )}

            <form className="registration-form" aria-label="inscription" onSubmit={handleSubmit} noValidate>
                <h2>Formulaire d'inscription</h2>

                {/* Nom + Prénom */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nom">Nom</label>
                        <input
                            id="nom" name="nom" type="text"
                            value={formData.nom}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="Dupont"
                            className={inputClass('nom')}
                        />
                        {fieldError('nom') && (
                            <span className="form-error">{errors.nom}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="prenom">Prénom</label>
                        <input
                            id="prenom" name="prenom" type="text"
                            value={formData.prenom}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="Jean"
                            className={inputClass('prenom')}
                        />
                        {fieldError('prenom') && (
                            <span className="form-error">{errors.prenom}</span>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email">Adresse e-mail</label>
                    <input
                        id="email" name="email" type="email"
                        value={formData.email}
                        onChange={handleChange} onBlur={handleBlur}
                        placeholder="jean.dupont@email.com"
                        className={inputClass('email')}
                    />
                    {fieldError('email') && (
                        <span className="form-error">{errors.email}</span>
                    )}
                </div>

                {/* Date de naissance */}
                <div className="form-group">
                    <label htmlFor="dateNaissance">Date de naissance</label>
                    <input
                        id="dateNaissance" name="dateNaissance" type="date"
                        value={formData.dateNaissance}
                        onChange={handleChange} onBlur={handleBlur}
                        className={inputClass('dateNaissance')}
                    />
                    {fieldError('dateNaissance') && (
                        <span className="form-error">{errors.dateNaissance}</span>
                    )}
                </div>

                {/* Ville + Code postal */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="ville">Ville</label>
                        <input
                            id="ville" name="ville" type="text"
                            value={formData.ville}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="Paris"
                            className={inputClass('ville')}
                        />
                        {fieldError('ville') && (
                            <span className="form-error">{errors.ville}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="codePostal">Code postal</label>
                        <input
                            id="codePostal" name="codePostal" type="text"
                            value={formData.codePostal}
                            onChange={handleChange} onBlur={handleBlur}
                            placeholder="75001" maxLength={5}
                            className={inputClass('codePostal')}
                        />
                        {fieldError('codePostal') && (
                            <span className="form-error">{errors.codePostal}</span>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={!isFormValid}>
                    S'inscrire
                </button>
            </form>
        </>
    );
}

export default RegistrationForm;
