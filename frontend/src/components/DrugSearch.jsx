import React, { useState } from 'react';
import './DrugSearch.css';

const DrugSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const searchDrug = async (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            setError('Veuillez entrer un nom de médicament');
            return;
        }

        setLoading(true);
        setError('');
        setResults([]);

        try {
            const response = await fetch(
                `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(searchTerm)}&limit=5`
            );

            if (!response.ok) {
                throw new Error('Médicament non trouvé');
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                setResults(data.results);
            } else {
                setError('Aucun résultat trouvé');
            }
        } catch (err) {
            setError('Erreur lors de la recherche. Veuillez réessayer.');
            console.error('FDA API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatText = (text) => {
        if (Array.isArray(text)) {
            return text.join(' ');
        }
        return text || 'Non disponible';
    };

    return (
        <section className="drug-search section">
            <div className="container">
                <div className="drug-search-header">
                    <h2 className="section-title">Drug Search</h2>
                    <p className="section-subtitle">
                        Official medication information from FDA database
                    </p>
                </div>

                <form onSubmit={searchDrug} className="search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            placeholder="Enter drug name (e.g., ibuprofen, aspirin...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {results.length > 0 && (
                    <div className="results-container">
                        {results.map((drug, index) => (
                            <div key={index} className="drug-card card">
                                <div className="drug-header">
                                    <h3 className="drug-name">
                                        {drug.openfda?.brand_name?.[0] || drug.openfda?.generic_name?.[0] || 'Medication'}
                                    </h3>
                                    {drug.openfda?.manufacturer_name?.[0] && (
                                        <p className="drug-manufacturer">
                                            Manufacturer: {drug.openfda.manufacturer_name[0]}
                                        </p>
                                    )}
                                </div>

                                {drug.indications_and_usage && (
                                    <div className="drug-section">
                                        <h4 className="drug-section-title">📋 Indications and Usage</h4>
                                        <p className="drug-section-content">
                                            {formatText(drug.indications_and_usage).substring(0, 300)}...
                                        </p>
                                    </div>
                                )}

                                {drug.warnings && (
                                    <div className="drug-section warning-section">
                                        <h4 className="drug-section-title">⚠️ Warnings</h4>
                                        <p className="drug-section-content">
                                            {formatText(drug.warnings).substring(0, 300)}...
                                        </p>
                                    </div>
                                )}

                                {drug.dosage_and_administration && (
                                    <div className="drug-section">
                                        <h4 className="drug-section-title">💊 Dosage and Administration</h4>
                                        <p className="drug-section-content">
                                            {formatText(drug.dosage_and_administration).substring(0, 200)}...
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DrugSearch;
