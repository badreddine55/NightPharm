
import { useState } from "react"
import Logo from '../../assets/logo1-removebg-preview.png'
import LogoutButton from "../Function/LogoutButton";

export default function ProductManagement() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [products] = useState([
    { title: "Moringa", category: "Medicine", stock: "12", supplier: "Square", price: "89.95" },
    { title: "Antibiotic 250 mg", category: "Heart", stock: "19", supplier: "Acme", price: "34.16" },
    { title: "Headache Relief", category: "Head", stock: "09", supplier: "Beximco", price: "53.70" },
    { title: "Pharmacy", category: "Hand", stock: "14", supplier: "ACI", price: "28.57" },
    { title: "Magnesium", category: "Leg", stock: "10", supplier: "Uniliver", price: "56.34" },
  ])

  return (
    <div className="min-h-screen ">
              {/* Sidebar Menu */}
      <div
      className={`fixed inset-y-0 left-0 z-50 w-16 bg-white transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full">
        {/* Close button */}
        <button onClick={() => setIsMenuOpen(false)} className="p-4 hover:bg-gray-100">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="p-4">
          <div className="h-8 w-8 rounded-lg bg-blue-500"></div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 p-2">
          <button className="w-full p-2 rounded-lg hover:bg-gray-100">
            <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button className="w-full p-2 rounded-lg hover:bg-gray-100">
            <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
          <button className="w-full p-2 rounded-lg hover:bg-gray-100">
            <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </button>
          <button className="w-full p-2 rounded-lg hover:bg-gray-100">
            <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </nav>

        {/* Action Button */}
        <div className="p-4">
        <LogoutButton/>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <header className="sticky top-0 z-40 w-full h-18 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 ml-[19px]">
          {/* Button to open the menu - Always visible */}
          <button onClick={() => setIsMenuOpen(true)}>
            <span className="sr-only">Toggle navigation</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
          <img
src={Logo}
alt="NightPharm Logo"
className="w-auto h-10 mx-auto object-contain object-center"
/>
            <span className="font-semibold">NightPharm</span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative w-full max-w-sm">
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 bg-white pl-8 pr-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:w-[300px] lg:w-[300px]"
            />
          </div>
        </div>
      </div>
    </header>
      {/* Main Content */}
      <main className="container px-4 py-6">
        <div className="rounded-lg border bg-white shadow-sm ml-[50px]">
          <div className="p-4 ">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm"
                />
                <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-white hover:bg-primary/90">
                  Filter
                </button>
              </div>
              <button className="inline-flex items-center justify-center rounded-md bg-green-500 px-3 py-1 text-sm font-medium text-white hover:bg-green-600">
                + Add a new product
              </button>
            </div>

            <div className="rounded-lg border ">
              <div className="bg-muted/50 px-4 py-3 bg-gray-50/50 border-b last:border-0" >
                <h2 className="text-sm font-semibold">All products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Suppliers</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="px-4 py-3 text-sm">{product.title}</td>
                        <td className="px-4 py-3 text-sm">{product.category}</td>
                        <td className="px-4 py-3 text-sm">{product.stock}</td>
                        <td className="px-4 py-3 text-sm">{product.supplier}</td>
                        <td className="px-4 py-3 text-sm">${product.price}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="rounded-full p-1 hover:bg-gray-100">
                              <svg
                                className="h-4 w-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                            <button className="rounded-full p-1 hover:bg-gray-100">
                              <svg
                                className="h-4 w-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

