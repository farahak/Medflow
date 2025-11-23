<section className="bg-white py-24 px-6">
  <div className="max-w-7xl mx-auto text-center mb-16">
    <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold text-sm mb-2">Pourquoi Nous Choisir</span>
    <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-gray-900">Une Expérience Patient Exceptionnelle</h2>
    <p className="text-gray-500 text-lg max-w-2xl mx-auto">Des solutions innovantes pour simplifier votre parcours de soins</p>
  </div>

  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    {features.map((f, i) => (
      <div key={i} className="bg-white border border-gray-200 p-8 rounded-2xl text-center transform transition hover:-translate-y-2 hover:shadow-lg hover:border-blue-500 cursor-pointer">
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
          <f.icon className="w-7 h-7 text-blue-700"/>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">{f.title}</h3>
        <p className="text-gray-500 text-sm">{f.description}</p>
      </div>
    ))}
  </div>
</section>
