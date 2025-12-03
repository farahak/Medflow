import React, { useState } from "react";
import api from "../api/axios.js";
import "./signup.module.css"; // <= AJOUTE TON FICHIER CSS ICI

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "patient",
    specialty: "",
    phone: "",
    date_of_birth: ""
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        submitData.append(key, formData[key]);
      }
    });

    if (formData.role === "medecin" && photo) {
      submitData.append("photo", photo);
    }

    try {
      const res = await api.post("users/signup/", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      alert("Compte créé !");
    } catch (err) {
      console.log(err);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleSubmit}>
        <h2>Créer un compte</h2>

        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" placeholder="Mot de passe" type="password" onChange={handleChange} required />
        <input name="first_name" placeholder="Prénom" onChange={handleChange} required />
        <input name="last_name" placeholder="Nom" onChange={handleChange} required />

        <select name="role" onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="medecin">Médecin</option>
          <option value="receptionist">Réceptionniste</option>
        </select>

        {formData.role === "medecin" && (
          <>
            <input name="specialty" placeholder="Spécialité" onChange={handleChange} />
            <input name="phone" placeholder="Téléphone" onChange={handleChange} />

            <div className="photo-upload">
              <label htmlFor="photo">Photo de profil</label>
              <input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} />

              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="photo-preview" />
              )}
            </div>
          </>
        )}

        {formData.role === "patient" && (
          <>
            <input name="date_of_birth" type="date" onChange={handleChange} />
            <input name="phone" placeholder="Téléphone" onChange={handleChange} />
          </>
        )}

        {formData.role === "receptionist" && (
          <input name="phone" placeholder="Téléphone" onChange={handleChange} />
        )}

        <button type="submit" className="btn-animated">Créer le compte</button>
      </form>
    </div>
  );
}
