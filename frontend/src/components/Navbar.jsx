<nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-500 rounded-lg flex items-center justify-center">
        <Heart className="text-white w-6 h-6"/>
      </div>
      <span className="text-2xl font-bold text-blue-900 tracking-tight">MediFlow</span>
    </div>

    {/* Menu desktop */}
    <div className="hidden md:flex items-center gap-10">
      <a href="#accueil" className="text-gray-700 font-medium hover:text-blue-700 transition">Accueil</a>
      <a href="#services" className="text-gray-700 font-medium hover:text-blue-700 transition">Services</a>
      <a href="#medecins" className="text-gray-700 font-medium hover:text-blue-700 transition">Médecins</a>
      <a href="#contact" className="text-gray-700 font-medium hover:text-blue-700 transition">Contact</a>
      <button className="bg-gradient-to-br from-blue-900 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition">
        Prendre RDV <ArrowRight className="w-5 h-5"/>
      </button>
    </div>

    {/* Menu mobile button */}
    <button className="md:hidden text-gray-700">
      {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
    </button>
  </div>

  {/* Mobile Menu */}
  {mobileMenuOpen && (
    <div className="md:hidden bg-white px-6 py-4 border-t border-gray-200 flex flex-col gap-3">
      <a href="#accueil" className="text-gray-700 font-medium">Accueil</a>
      <a href="#services" className="text-gray-700 font-medium">Services</a>
      <a href="#medecins" className="text-gray-700 font-medium">Médecins</a>
      <a href="#contact" className="text-gray-700 font-medium">Contact</a>
      <button className="bg-gradient-to-br from-blue-900 to-blue-500 text-white py-2 rounded-xl font-semibold mt-2 w-full">Prendre RDV</button>
    </div>
  )}
</nav>
