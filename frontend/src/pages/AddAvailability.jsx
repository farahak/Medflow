import React, { useState } from "react";

export default function AddAvailability() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      setMessage("Vous devez être connecté (médecin) !");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/appointments/availability/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          start_datetime: start,
          end_datetime: end
        }),
      });

      if (response.ok) {
        setMessage("Disponibilité ajoutée avec succès 🎉");
      } else {
        const err = await response.json();
        setMessage("Erreur : " + JSON.stringify(err));
      }

    } catch (error) {
      setMessage("Erreur lors de l'envoi : " + error.message);
    }
  };

  return (
    <div className="container">
      <h2>Ajouter une disponibilité (Médecin)</h2>

      <form onSubmit={handleSubmit}>
        <label>Début :</label>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />

        <label>Fin :</label>
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />

        <button type="submit">Ajouter</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
