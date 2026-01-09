"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

// Top 20 countries with flags and codes
const countries = [
  { code: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
]

interface PhoneInputProps {
  value: string
  countryCode: string
  onPhoneChange: (phone: string) => void
  onCountryChange: (code: string) => void
}

export default function PhoneInput({ value, countryCode, onPhoneChange, onCountryChange }: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [filteredCountries, setFilteredCountries] = useState(countries)

  useEffect(() => {
    const filtered = countries.filter(
      (country) => country.name.toLowerCase().includes(search.toLowerCase()) || country.code.includes(search),
    )
    setFilteredCountries(filtered)
  }, [search])

  const selectedCountry = countries.find((c) => c.code === countryCode) || countries[0]

  return (
    <div className="flex gap-2">
      {/* Country Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-3 bg-background border border-primary/20 rounded-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all flex items-center gap-2 min-w-[120px]"
        >
          <span className="text-xl">{selectedCountry.flag}</span>
          <span className="text-sm font-medium">{selectedCountry.code}</span>
          <ChevronDown className="w-4 h-4 ml-auto" />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

            {/* Dropdown */}
            <div className="absolute top-full mt-2 left-0 w-72 bg-card border border-primary/20 rounded-lg shadow-lg z-20 max-h-80 overflow-hidden">
              {/* Search */}
              <div className="p-3 border-b border-primary/20">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Country List */}
              <div className="overflow-y-auto max-h-60">
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onCountryChange(country.code)
                      setIsOpen(false)
                      setSearch("")
                    }}
                    className="w-full px-4 py-3 hover:bg-primary/10 transition-colors flex items-center gap-3 text-left"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-sm text-foreground flex-1">{country.name}</span>
                    <span className="text-sm text-muted-foreground">{country.code}</span>
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm">No countries found</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={value}
        onChange={(e) => onPhoneChange(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder="Enter phone number"
        className="flex-1 px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
      />
    </div>
  )
}
