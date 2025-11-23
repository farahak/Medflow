import React, { useState } from "react";
import api from "../api/axios.js";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // remove empty fields for clean body
    const body = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
    );

    try {
      const res = await api.post("users/signup/", body);

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      alert("Compte créé !");
      console.log("Created user:", res.data);

    } catch (err) {
      console.log(err);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} />
      <input name="first_name" placeholder="Prénom" onChange={handleChange} />
      <input name="last_name" placeholder="Nom" onChange={handleChange} />

      <select name="role" onChange={handleChange}>
        <option value="patient">Patient</option>
        <option value="medecin">Médecin</option>
      </select>

      {formData.role === "medecin" && (
        <>
          <input name="specialty" placeholder="Specialty" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
        </>
      )}

      {formData.role === "patient" && (
        <>
          <input name="date_of_birth" type="date" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
        </>
      )}

      <button type="submit">Créer le compte</button>
    </form>
  );
}
