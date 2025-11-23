<footer className="bg-gray-900 text-white py-24 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
    {/* Logo */}
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-500 rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-white"/>
        </div>
        <span className="text-2xl font-bold">MediFlow</span>
      </div>
      <p className="text-gray-400 text-sm">Plateforme digitale de santé innovante pour une meilleure prise en charge médicale.</p>
    </div>

    {/* Navigation */}
    <div>
      <h4 className="font-bold mb-4 text-lg">Navigation</h4>
      <div className="flex flex-col gap-2">
        {['Accueil','Services','Médecins','À Propos','Contact'].map(l => (
          <a key={l} href="#" className="text-gray-400 hover:text-white transition text-sm">{l}</a>
        ))}
      </div>
    </div>

    {/* Specialités */}
    <div>
      <h4 className="font-bold mb-4 text-lg">Spécialités</h4>
      <div className="flex flex-col gap-2">
        {['Cardiologie','Pédiatrie','Chirurgie','Dermatologie','Dentisterie'].map(s => (
          <a key={s} href="#" className="text-gray-400 hover:text-white transition text-sm">{s}</a>
        ))}
      </div>
    </div>

    {/* Contact */}
    <div>
      <h4 className="font-bold mb-4 text-lg">Contact</h4>
      <p className="text-gray-400 text-sm">📞 +216 20 000 000</p>
      <p className="text-gray-400 text-sm">✉ info@mediflow.tn</p>
      <p className="text-gray-400 text-sm">📍 Tunis, Tunisie</p>
    </div>
  </div>
  <div className="text-center text-gray-500 text-sm">© 2025 MediFlow. Tous droits réservés.</div>
</footer>
