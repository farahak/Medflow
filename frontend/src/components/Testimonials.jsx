<section className="bg-gray-50 py-24 px-6">
  <div className="max-w-7xl mx-auto text-center mb-16">
    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">Ce Que Disent Nos Patients</h2>
  </div>

  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {testimonials.map((t, i) => (
      <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200">
        <div className="flex gap-1 mb-4">
          {[...Array(t.rating)].map((_, j) => (
            <Star key={j} className="w-4 h-4 text-yellow-400"/>
          ))}
        </div>
        <p className="text-gray-600 mb-4">"{t.content}"</p>
        <div>
          <div className="font-bold text-gray-900">{t.name}</div>
          <div className="text-sm text-gray-500">{t.role}</div>
        </div>
      </div>
    ))}
  </div>
</section>
