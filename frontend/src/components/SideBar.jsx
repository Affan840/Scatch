"use client"

import { useState, useEffect } from "react"
import { Filter, Menu, X } from "lucide-react"
import { useProducts } from "../contexts"

const SideBar = () => {
  const {filterProducts, sortProducts } = useProducts();
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return (
    <>
            { isMobile && (
        <div  onClick={() => setIsOpen(!isOpen)} className="flex sm:w-60 items-center justify-start mt-8">
          <button
            className=" text-black flex md:hidden py-2 rounded-full transition duration-300 ease-in-out items-center"
          >
            <Menu />
          </button>
        </div>
      )}
      <div
        className={`${
          isMobile
            ? `fixed top-0 left-0 h-full w-72 z-50 pt-32 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "w-1/4"
        } flex flex-col py-4 items-start font-semibold`}
      >
        <X size={26} className={`absolute md:hidden top-4 right-4 z-50 text-black cursor-pointer ${!isOpen && "hidden"}`}  onClick={() => setIsOpen(false)} />
        <div className="flex md:items-start md:flex-col  gap-2 px-4">
          <h3 className="block w-fit mb-2 text-xl">Sort by</h3>
          <form action="/shop"  onChange={(e) => {
                sortProducts(e.target.value)
              }}>
            <select className="border-[1px] px-2 py-1 outline-none cursor-pointer" name="sortby" id="">
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="low-to-high">Price: Low to High</option>
              <option  value="high-to-low">Price: High to Low</option>
            </select>
          </form>
        </div>
      </div>
    </>
  )
}

export default SideBar

