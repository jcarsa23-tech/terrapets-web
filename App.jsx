import React, { useMemo, useState } from 'react'

const PRODUCTS = [
  {
    id: 1,
    name: 'Alimento Premium Perro 10kg',
    price: 18500,
    category: 'Perros',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80',
    description: 'Nutrición completa para perros adultos.',
  },
  {
    id: 2,
    name: 'Shampoo Canino Antipulgas',
    price: 4500,
    category: 'Higiene',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
    description: 'Limpieza profunda y cuidado del pelaje.',
  },
  {
    id: 3,
    name: 'Snack Natural para Gato',
    price: 3200,
    category: 'Gatos',
    image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80',
    description: 'Premios deliciosos y saludables.',
  },
  {
    id: 4,
    name: 'Juguete Mordedor Resistente',
    price: 3900,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    description: 'Ideal para entretenimiento diario.',
  },
  {
    id: 5,
    name: 'Arena Sanitaria 10L',
    price: 6200,
    category: 'Gatos',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80',
    description: 'Control de olores y absorción rápida.',
  },
  {
    id: 6,
    name: 'Collar Ajustable Azul',
    price: 2800,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80',
    description: 'Cómodo, ligero y fácil de ajustar.',
  },
]

const WHATSAPP_NUMBER = '50683639767'
const PHONE_NUMBER = '2102-9322'

function App() {
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    delivery: 'Envío a domicilio',
    address: '',
    notes: '',
  })

  const categories = ['Todos', ...new Set(PRODUCTS.map((p) => p.category))]

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchCategory = selectedCategory === 'Todos' || product.category === selectedCategory
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [selectedCategory, search])

  const currency = (value) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0,
    }).format(value)

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const whatsappUrl = useMemo(() => {
    const lines = ['Hola, quiero hacer este pedido:', '', 'Productos:']

    if (cart.length === 0) {
      lines.push('- Aún no hay productos en el carrito')
    } else {
      cart.forEach((item) => {
        lines.push(`- ${item.name} x ${item.quantity} = ${currency(item.price * item.quantity)}`)
      })
    }

    lines.push('', `Total: ${currency(totalPrice)}`, '', 'Datos del cliente:')
    lines.push(`Nombre: ${customer.name || 'No indicado'}`)
    lines.push(`Teléfono: ${customer.phone || 'No indicado'}`)
    lines.push(`Entrega: ${customer.delivery || 'No indicado'}`)
    lines.push(`Dirección: ${customer.address || 'No indicada'}`)
    lines.push(`Notas: ${customer.notes || 'Sin notas'}`)

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
  }, [cart, customer, totalPrice])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="bg-teal-600 px-4 py-2 text-center text-xs font-semibold text-white">
          Horario: Lunes a Sábado de 9:30 am a 7:00 pm
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-teal-600 md:text-3xl">
              TerraPets Clínica Veterinaria & Spa
            </h1>
            <p className="text-sm text-slate-500">Clínica Veterinaria & Spa • Pedidos por WhatsApp</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-2xl border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 md:inline-block"
            >
              WhatsApp
            </a>
            <a
              href="#carrito"
              className="rounded-2xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02]"
            >
              Carrito ({totalItems})
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-10">
        <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-500 p-8 text-white shadow-lg">
          <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
            Tu veterinaria y tienda
          </p>
          <h2 className="max-w-2xl text-4xl font-black leading-tight md:text-5xl">
            Agenda, compra y contáctanos desde una sola página
          </h2>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            Servicios veterinarios, grooming, acupuntura y venta de accesorios y alimentos para tu mascota.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#servicios"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-teal-700 transition hover:scale-[1.02]"
            >
              Ver servicios
            </a>
            <a
              href="#productos"
              className="rounded-2xl border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Ver productos
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/15 px-4 py-2">Teléfono: {PHONE_NUMBER}</span>
            <span className="rounded-full bg-white/15 px-4 py-2">WhatsApp: 8363-9767</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
          {[
            ['Pedidos rápidos', 'Tus clientes agregan productos y envían el pedido en segundos.'],
            ['Agenda por WhatsApp', 'Reservas directas para grooming y servicios veterinarios.'],
            ['100% responsive', 'Se ve bien en celular, tablet y computadora.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-black">Servicios</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              title="Grooming"
              text="Baño, corte y cuidado estético para tu mascota."
              url={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20agendar%20una%20cita%20de%20grooming`}
            />
            <ServiceCard
              title="Consulta por cita"
              text="Atención veterinaria profesional con previa cita."
              url={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20agendar%20una%20consulta%20veterinaria`}
            />
            <ServiceCard
              title="Terapia con acupuntura"
              text="Tratamientos alternativos para mejorar la salud de tu mascota."
              url={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20agendar%20una%20terapia%20con%20acupuntura`}
            />
            <div className="rounded-2xl bg-slate-50 p-4">
              <h3 className="text-lg font-bold">Venta de accesorios y alimentos</h3>
              <p className="mt-2 text-sm text-slate-600">
                Todo lo que tu mascota necesita en un solo lugar.
              </p>
              <a href="#productos" className="mt-3 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">
                Ver productos
              </a>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 md:grid-cols-[1.45fr_0.55fr] md:px-8">
        <section id="productos" className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black">Productos</h2>
                <p className="text-sm text-slate-500">Explora el catálogo y agrega al carrito.</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar producto"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      {product.category}
                    </span>
                    <span className="text-lg font-black text-slate-900">{currency(product.price)}</span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug">{product.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:scale-[1.01]"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside id="carrito" className="space-y-6">
          <div className="sticky top-28 space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black">Carrito</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {totalItems} items
                </span>
              </div>

              <div className="space-y-4">
                {cart.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    Aún no hay productos agregados.
                  </p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold leading-snug">{item.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{currency(item.price)} c/u</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs font-bold text-rose-600">
                          Quitar
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="h-8 w-8 rounded-xl border border-slate-200 text-lg font-bold">-</button>
                          <span className="min-w-8 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="h-8 w-8 rounded-xl border border-slate-200 text-lg font-bold">+</button>
                        </div>
                        <span className="font-black">{currency(item.quantity * item.price)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-5 rounded-2xl bg-slate-900 p-4 text-white">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>Total</span>
                  <span>{currency(totalPrice)}</span>
                </div>
                <p className="mt-2 text-xs text-white/70">
                  El pedido se enviará a WhatsApp para procesarlo manualmente.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-black">Tus datos</h2>
              <p className="mb-4 text-sm text-slate-500">
                Completa la información antes de enviar el pedido.
              </p>
              <div className="space-y-3">
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Nombre completo"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
                <input
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="Teléfono"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
                <select
                  value={customer.delivery}
                  onChange={(e) => setCustomer({ ...customer, delivery: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                >
                  <option>Envío a domicilio</option>
                  <option>Retiro en tienda</option>
                </select>
                <textarea
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Dirección"
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
                <textarea
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder="Notas del pedido"
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`block w-full rounded-2xl px-4 py-3 text-center text-sm font-black text-white transition ${
                    cart.length === 0 ? 'pointer-events-none bg-slate-300' : 'bg-green-600 hover:scale-[1.01]'
                  }`}
                >
                  Enviar pedido por WhatsApp
                </a>
              </div>
            </section>
          </div>
        </aside>
      </main>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 rounded-full bg-green-600 px-5 py-4 text-sm font-black text-white shadow-lg transition hover:scale-110"
      >
        WhatsApp
      </a>
    </div>
  )
}

function ServiceCard({ title, text, url }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white"
      >
        Agenda tu cita ahora
      </a>
    </div>
  )
}

export default App
