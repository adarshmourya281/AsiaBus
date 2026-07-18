import { useState, useRef, useEffect } from "react";
import { getCities, getCityAliases } from "../../services/cityService";
import bgImage from "../../assets/bg1.png";
import fromIcon from "../../assets/bus.png";
import toIcon from "../../assets/bus.png";
import dateIcon from "../../assets/date.png";

function Booking({ initialFrom, initialTo, initialDate, onSearch, isSearchPage }) {
  // Error state for validation
  const [fromError, setFromError] = useState("");
  const [toError, setToError] = useState("");
  const [dateError, setDateError] = useState("");
  // Suggestion visibility state
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [from, setFrom] = useState(initialFrom || "");
  const [to, setTo] = useState(initialTo || "");
  const [date, setDate] = useState(initialDate || "");
  /////

  const [sourceId, setSourceId] = useState(null);
  const [destinationId, setDestinationId] = useState(null);
  ///

  const dateRef = useRef(null);

  const [cities, setCities] = useState([]);
  const [filteredFromCities, setFilteredFromCities] = useState([]);
  const [filteredToCities, setFilteredToCities] = useState([]);
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      console.log("🔍 [fetchCities] Starting city and alias fetch...");
      
      // ✅ Fetch both APIs with graceful fallback for aliases
      const [citiesData, aliasesData] = await Promise.all([
        getCities(),
        getCityAliases().catch((error) => {
          console.warn("⚠️ [fetchCities] Alias API failed, continuing with cities only:", error.message);
          return null; // Fallback: continue without aliases
        }),
      ]);

      // ✅ STEP 1: Validate and extract cities array
      if (!Array.isArray(citiesData) || citiesData.length === 0) {
        console.error("❌ [fetchCities] Cities array is empty or invalid");
        setCities([]);
        setFilteredFromCities([]);
        setFilteredToCities([]);
        return;
      }

      console.log("✅ [fetchCities] Cities extracted:", {
        count: citiesData.length,
        sample: citiesData[0],
      });

      // ✅ STEP 2: Create alias map from cityId
      // API returns: [{ cityId: 31930, cityName: "Taveda", state: "Gujarat", alias: "Aachara" }]
      // We need: { 31930: ["Aachara", "AnotherAlias", ...], ... }
      const aliasMap = {};
      
      if (Array.isArray(aliasesData) && aliasesData.length > 0) {
        aliasesData.forEach((aliasItem) => {
          const { cityId, alias, cityName, state } = aliasItem;

          // ✅ Validate alias item structure
          if (!cityId || !alias) {
            console.warn("⚠️ [fetchCities] Invalid alias item (missing cityId or alias):", aliasItem);
            return;
          }

          // ✅ Group aliases by cityId (one cityId can have multiple aliases)
          if (!aliasMap[cityId]) {
            aliasMap[cityId] = [];
          }
          aliasMap[cityId].push(alias);

          console.log(
            `📍 [fetchCities] Mapped alias for cityId ${cityId} (${cityName}):`,
            alias
          );
        });

        console.log("📊 [fetchCities] Alias map created:", aliasMap);
      } else {
        console.log("ℹ️ [fetchCities] No aliases available (API failed or returned empty)");
      }

      // ✅ STEP 3: Merge cities with their aliases
      const mergedCities = citiesData.map((city) => {
        const { id, name, state } = city;

        // ✅ Get aliases for this city by its id
        const cityAliases = aliasMap[id] || [];

        console.log(`🔗 [fetchCities] City "${name}" (id: ${id}, state: ${state}):`, {
          aliasCount: cityAliases.length,
          aliases: cityAliases,
        });

        return {
          ...city,
          id,
          name,
          state,
          aliases: cityAliases, // Array of alias strings
        };
      });

      console.log("✨ [fetchCities] Merge complete:", {
        totalCities: mergedCities.length,
        citiesWithAliases: mergedCities.filter((c) => c.aliases.length > 0).length,
        sample: mergedCities[0],
      });

      // ✅ STEP 4: Update state
      setCities(mergedCities);
      setFilteredFromCities(mergedCities);
      setFilteredToCities(mergedCities);

      console.log("✅ [fetchCities] State updated successfully");

    } catch (error) {
      console.error("❌ [fetchCities] Fatal error:", error);
      
      // ✅ FALLBACK: Try to load cities without aliases
      try {
        console.log("🔄 [fetchCities] Attempting fallback: loading cities without aliases...");
        const citiesData = await getCities();
        
        if (Array.isArray(citiesData) && citiesData.length > 0) {
          const fallbackCities = citiesData.map((city) => ({
            ...city,
            aliases: [],
          }));
          
          console.log("✅ [fetchCities] Fallback successful: cities loaded without aliases");
          setCities(fallbackCities);
          setFilteredFromCities(fallbackCities);
          setFilteredToCities(fallbackCities);
        } else {
          console.error("❌ [fetchCities] Fallback failed: no cities data");
        }
      } catch (fallbackError) {
        console.error("❌ [fetchCities] Fallback completely failed:", fallbackError);
      }
    }
  };

  const handleFromChange = (e) => {
    const value = e.target.value;
    console.log("🔍 [handleFromChange] Input value:", value);
    console.log("🔍 [handleFromChange] Available cities:", cities.length);
    
    setFrom(value);
    
    if (value.trim() === "") {
      console.log("📌 [handleFromChange] Empty input, showing all cities");
      setFilteredFromCities(cities);
    } else {
      const search = value.toLowerCase();
      console.log("🔎 [handleFromChange] Searching for:", search);

      const filtered = cities.filter((city) => {
        const { name, state, aliases } = city;
        
        // ✅ Search across: name, state, and aliases
        const nameMatch = name?.toLowerCase().includes(search) || false;
        const stateMatch = state?.toLowerCase().includes(search) || false;
        
        // ✅ Check if any alias matches (aliases is an array of strings)
        const aliasMatch = Array.isArray(aliases) && aliases.some((alias) =>
          alias?.toLowerCase().includes(search)
        );

        console.log(
          `🔍 [handleFromChange] City: "${name}" (${state})`,
          {
            nameMatch,
            stateMatch,
            aliasMatch,
            aliases,
          }
        );

        return nameMatch || stateMatch || aliasMatch;
      });

      console.log("✅ [handleFromChange] Filtered results:", filtered.length);
      setFilteredFromCities(filtered);
    }
    setShowFromSuggestions(true);
  };


  const handleToChange = (e) => {
    const value = e.target.value;
    console.log("🔍 [handleToChange] Input value:", value);
    console.log("🔍 [handleToChange] Available cities:", cities.length);
    
    setTo(value);
    
    if (value.trim() === "") {
      console.log("📌 [handleToChange] Empty input, showing all cities");
      setFilteredToCities(cities);
    } else {
      const search = value.toLowerCase();
      console.log("🔎 [handleToChange] Searching for:", search);

      const filtered = cities.filter((city) => {
        const { name, state, aliases } = city;
        
        // ✅ Search across: name, state, and aliases
        const nameMatch = name?.toLowerCase().includes(search) || false;
        const stateMatch = state?.toLowerCase().includes(search) || false;
        
        // ✅ Check if any alias matches (aliases is an array of strings)
        const aliasMatch = Array.isArray(aliases) && aliases.some((alias) =>
          alias?.toLowerCase().includes(search)
        );

        console.log(
          `🔍 [handleToChange] City: "${name}" (${state})`,
          {
            nameMatch,
            stateMatch,
            aliasMatch,
            aliases,
          }
        );

        return nameMatch || stateMatch || aliasMatch;
      });

      console.log("✅ [handleToChange] Filtered results:", filtered.length);
      setFilteredToCities(filtered);
    }
    setShowToSuggestions(true);
  };

  // ✅ RESOLVE CITY: Match typed city name against cities list to extract ID
  const resolveCityId = (cityName, isSources = true) => {
    if (!cityName || !Array.isArray(cities) || cities.length === 0) {
      return null;
    }

    const search = cityName.toLowerCase().trim();

    // ✅ First, try exact name match
    const exactMatch = cities.find(
      (city) => city.name?.toLowerCase() === search
    );
    if (exactMatch) {
      console.log(`✅ [resolveCityId] Exact match found for "${cityName}":`, exactMatch.id);
      return exactMatch.id;
    }

    // ✅ Second, try partial name match
    const partialNameMatch = cities.find(
      (city) => city.name?.toLowerCase().includes(search)
    );
    if (partialNameMatch) {
      console.log(`✅ [resolveCityId] Partial name match found for "${cityName}":`, partialNameMatch.id);
      return partialNameMatch.id;
    }

    // ✅ Third, try state match
    const stateMatch = cities.find(
      (city) => city.state?.toLowerCase().includes(search)
    );
    if (stateMatch) {
      console.log(`✅ [resolveCityId] State match found for "${cityName}":`, stateMatch.id);
      return stateMatch.id;
    }

    // ✅ Fourth, try alias match
    const aliasMatch = cities.find((city) =>
      Array.isArray(city.aliases) && city.aliases.some(
        (alias) => alias?.toLowerCase() === search || alias?.toLowerCase().includes(search)
      )
    );
    if (aliasMatch) {
      console.log(`✅ [resolveCityId] Alias match found for "${cityName}":`, aliasMatch.id);
      return aliasMatch.id;
    }

    console.warn(`⚠️ [resolveCityId] No match found for city name: "${cityName}"`);
    return null;
  };

  // ✅ SEARCH HANDLER
  const handleSearch = () => {
    let valid = true;
    if (!from) {
      setFromError("Please fill the source city");
      valid = false;
    } else {
      setFromError("");
    }
    if (!to) {
      setToError("Please fill the destination city");
      valid = false;
    } else {
      setToError("");
    }
    if (!date) {
      setDateError("Please select a date");
      valid = false;
    } else {
      setDateError("");
    }

    if (valid && onSearch) {
      // ✅ Resolve city IDs if they are null (user typed manually)
      let finalSourceId = sourceId;
      let finalDestinationId = destinationId;

      if (!finalSourceId) {
        console.log("🔍 [handleSearch] sourceId is null, attempting to resolve from 'from' input...");
        finalSourceId = resolveCityId(from, true);
      }

      if (!finalDestinationId) {
        console.log("🔍 [handleSearch] destinationId is null, attempting to resolve from 'to' input...");
        finalDestinationId = resolveCityId(to, false);
      }

      console.log("✅ [handleSearch] Final search data:", {
        from,
        to,
        sourceId: finalSourceId,
        destinationId: finalDestinationId,
        date,
      });

      onSearch({
        from,
        to,
        sourceId: finalSourceId,
        destinationId: finalDestinationId,
        date,
      });
    }
  };

  // 🔁 SWAP
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setSourceId(destinationId);
    setDestinationId(sourceId);
  };

  // 📅 TODAY
  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  };

  // 📅 TOMORROW
  const setTomorrow = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    setDate(t.toISOString().split("T")[0]);
  };

  return (
    <div className={`relative w-full flex justify-center px-2 sm:px-3 md:px-4 z-0
      ${isSearchPage ? "py-3 sm:py-4 md:py-5" : "pt-16 pb-16 sm:pt-24 sm:pb-20 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32"}
    `}>

      {/* ✅ Background ONLY for Home */}
      {!isSearchPage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </>
      )}

      {/* ✅ CONTENT */}
      <div className="relative w-full max-w-6xl px-2 sm:px-3 md:px-4 z-10">

        {/* CARD */}
        <div className={`rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl px-3 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5
          ${isSearchPage ? "bg-white" : "bg-white/95 backdrop-blur-md"}
        `}>

          {/* MAIN FLEX CONTAINER - Stack vertically on mobile */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-3 md:gap-0">

            {/* FROM */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-1/3 px-2 sm:px-3 py-2">
              <img src={fromIcon} alt="from" className="w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
              <div className="w-full">
                <p className="text-xs text-gray-500 font-medium">From</p>
                <div className="relative w-full">


                  <input
                    value={from}
                    onChange={e => { handleFromChange(e); setFromError(""); }}
                    onFocus={() => {
                      if (from.trim() === "") {
                        setFilteredFromCities(cities);
                      }
                      setShowFromSuggestions(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowFromSuggestions(false), 100);
                    }}
                    placeholder="Source city"
                    className="w-full font-semibold outline-none text-sm sm:text-base bg-transparent"
                  />
                  {fromError && <p className="text-xs text-red-500 mt-1">{fromError}</p>}

                  {showFromSuggestions && filteredFromCities.length > 0 && (
                    <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-full max-h-48 sm:max-h-60 overflow-y-auto z-50">
                      {filteredFromCities.map((city) => (
                        <div
                          key={city.id}
                          onMouseDown={() => {
                            setFrom(city.name);
                            setSourceId(city.id);

                            setFilteredFromCities([]);
                            setShowFromSuggestions(false);
                          }}
                          className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                        >
                          {city.name}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Divider - hidden on mobile */}
            <div className="hidden md:block w-px h-12 md:h-10 lg:h-12 bg-gray-200" />

            {/* SWAP */}
            <div className="flex justify-center w-full md:w-auto">
              <button
                onClick={handleSwap}
                className="bg-gray-50 hover:bg-gray-100 w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-md hover:shadow-lg transition text-lg font-bold text-red-500 flex-shrink-0"
              >
                ⇄
              </button>
            </div>

            {/* Divider - hidden on mobile */}
            <div className="hidden md:block w-px h-12 md:h-10 lg:h-12 bg-gray-200" />

            {/* TO */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-1/3 px-2 sm:px-3 py-2">
              <img src={toIcon} alt="to" className="w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" />
              <div className="w-full">
                <p className="text-xs text-gray-500 font-medium">To</p>
                <div className="relative w-full">


                  <input
                    value={to}
                    onChange={e => { handleToChange(e); setToError(""); }}
                    onFocus={() => {
                      if (to.trim() === "") {
                        setFilteredToCities(cities);
                      }
                      setShowToSuggestions(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowToSuggestions(false), 100);
                    }}
                    placeholder="Destination city"
                    className="w-full font-semibold outline-none text-sm sm:text-base bg-transparent"
                  />
                  {toError && <p className="text-xs text-red-500 mt-1">{toError}</p>}

                  {showToSuggestions && filteredToCities.length > 0 && (
                    <div className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-full max-h-48 sm:max-h-60 overflow-y-auto z-50">
                      {filteredToCities.map((city) => (
                        <div
                          key={city.id}
                          onMouseDown={() => {
                            setTo(city.name);
                            setDestinationId(city.id);

                            setFilteredToCities([]);
                            setShowToSuggestions(false);
                          }}
                          className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
                        >
                          {city.name}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Divider - hidden on mobile */}
            <div className="hidden md:block w-px h-10 bg-gray-200" />

            {/* DATE */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 w-full md:w-1/3 px-2 sm:px-3 py-2">

              {/* Date */}
              <div className="flex items-center gap-2 sm:gap-3 w-full">
                <img
                  src={dateIcon}
                  alt="date"
                  className="w-5 sm:w-6 h-5 sm:h-6 cursor-pointer flex-shrink-0"
                  onClick={() => {
                    if (dateRef.current?.showPicker) {
                      dateRef.current.showPicker();
                    } else {
                      dateRef.current.click();
                    }
                  }}
                />

                <div className="w-full">
                  <p className="text-xs text-gray-500 font-medium">Date</p>

                  <input
                    ref={dateRef}
                    type="date"
                    value={date}
                    onChange={e => { setDate(e.target.value); setDateError(""); }}
                    className="w-full font-semibold outline-none text-xs sm:text-sm md:text-base bg-transparent"
                  />
                  {dateError && <p className="text-xs text-red-500 mt-1">{dateError}</p>}
                </div>
              </div>

              {/* Today / Tomorrow */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={setToday}
                  className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-red-100 text-red-600 hover:bg-red-200 transition whitespace-nowrap"
                >
                  Today
                </button>
                <button
                  onClick={setTomorrow}
                  className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-red-100 text-red-600 hover:bg-red-200 transition whitespace-nowrap"
                >
                  Tomorrow
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SEARCH BUTTON */}
        <div className="flex justify-center mt-3 sm:mt-4 md:mt-6">
          <button
            onClick={handleSearch}
            className={`w-full sm:w-auto px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 rounded-full text-sm sm:text-base md:text-lg shadow-lg transition text-white font-semibold bg-red-600 hover:bg-red-700 active:scale-95`}
          >
            🔍 Search Buses
          </button>
        </div>

      </div>
    </div>
  );
}

export default Booking;