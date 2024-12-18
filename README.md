import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import "./home.css";
import iconSearch from "../images/map icons/search-normal.svg";
import iconMobile from "../images/kind of miss/Frame-3.svg";
import iconFile from "../images/kind of miss/Frame-2.svg";
import iconUser from "../images/kind of miss/Frame-1.svg";
import iconCar from "../images/kind of miss/Frame.svg";
import iconBox from "../images/kind of miss/shopping-bag 1.svg";
import axios from "axios";

const Home = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    region: "",
    city: "",
    date: null,
    type: 1,
    limit: 15,
    page: 1,
  });
  const [markers, setMarkers] = useState([]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const datePickerRef = useRef(null);
  const navigate = useNavigate();

  const headers = {
      Accept: "application/json",
      password:"$2y$12$lKLPBP1GlcywPnqPZceE4OcTWQNMrTgoshgoz91DrvvuTFMGiUI32",
      lang:"en"
  };


 
  const fetchDropdownData = useCallback(async () => {
    try {
      const categoriesResponse = await axios.get(
        "https://ta3mim.momyyaz.online/api/v1/taemem-types",
        {
          headers: headers,
        }
      );
      setCategories(categoriesResponse.data?.data || []);
  
      const statusesResponse = await axios.get(
        "https://ta3mim.momyyaz.online/api/v1/taemem-status",
        {
          headers: headers,
        }
      );
      setStatuses(statusesResponse.data?.data || []);
  
      const regionsResponse = await axios.get(
        "https://ta3mim.momyyaz.online/api/v1/regions",
        {
          headers: headers,
        }
      );
      setRegions(regionsResponse.data?.data || []);
  
      const citiesResponse = await axios.get(
        "https://ta3mim.momyyaz.online/api/v1/cities",
        {
          headers: headers,
        }
      );
      setCities(citiesResponse.data?.data || []);
    } catch (err) {
      console.error("Dropdown fetch error:", err.response?.data || err.message);
      setError("Failed to load dropdown options.");
    }
  }, []);
  

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        type: filters.type,
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
        ...(filters.date && { date: filters.date.toISOString().split("T")[0] }),
        ...(filters.city && { city_id: filters.city }),
        ...(filters.region && { region_id: filters.region }),
        limit: filters.limit,
        page: filters.page,
      };

      const response = await axios.get(
        "https://ta3mim.momyyaz.online/api/v1/taemems",
        { headers, params }
      );
      setResults(response.data?.results || []);
      setMarkers(
        (response.data?.markers || []).map((marker) => ({
          position: [marker.lat, marker.lng],
          text: marker.title,
        }))
      );
    } catch (err) {
      console.error("API Fetch Error:", err.response?.data || err.message);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDropdownData();
    fetchData();
  }, [fetchDropdownData, fetchData]);

  const handleButtonClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleIconClick = (category) => {
    setSelectedCategory(category);
  };

  const handleContinueClick = () => {
    switch (selectedCategory) {
      case "هواتف وأجهزة":
        navigate("/deviceDetails");
        break;
      case "وثائق ومستندات":
        navigate("/filesDetails");
        break;
      case "أشخاص":
        navigate("/personDetails");
        break;
      case "سيارات ومركبات":
        navigate("/carsDetails");
        break;
      case "مصنوعات وأشياء متنوعة":
        navigate("/thingsDetails");
        break;
      default:
        break;
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      date,
    }));
  };

  const applyFilters = () => {
    console.log(filters);
  };

  return (
    <>
      {/* Header */}
      <header className="home">
        <h1 className="title">تعميم</h1>
        <h4>منصتك المثلى للعثور على المفقودات والإعلان عن المعثورات</h4>
        <p>ساهم في إعادة المفقودات إلى أصحابها</p>

        <button
          className={`add-new-btn ${isPopupVisible ? "active" : ""}`}
          onClick={handleButtonClick}
        >
          أضف تعميم
          <img src={iconSearch} alt="Add Icon" className="button-icon mx-2" />
        </button>

        {isPopupVisible && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <h2>اختر الفئة التي ترغب بالإعلان عنها</h2>
              <p className="mb-5">لمساعدتنا في تقديم إعلانك بشكل أفضل</p>

              <div className="popup-icons">
                {[{ icon: iconMobile, label: "هواتف وأجهزة" },
                  { icon: iconFile, label: "وثائق ومستندات" },
                  { icon: iconUser, label: "أشخاص" },
                  { icon: iconCar, label: "سيارات ومركبات" },
                  { icon: iconBox, label: "مصنوعات وأشياء متنوعة" }]
                  .map(({ icon, label }, index) => (
                    <div
                      key={index}
                      className={`popup-icon-box ${
                        selectedCategory === label ? "selected" : ""
                      }`}
                      onClick={() => handleIconClick(label)}
                    >
                      <img
                        src={icon}
                        alt={`Icon ${index + 1}`}
                        className="icon-img"
                      />
                      <span className="icon-description">{label}</span>
                    </div>
                  ))}
              </div>

              <button
                className="follow-button"
                onClick={handleContinueClick}
                disabled={!selectedCategory}
                style={{
                  backgroundColor: selectedCategory ? "#0000ff" : "#ccc",
                  cursor: selectedCategory ? "pointer" : "not-allowed",
                }}
              >
                متابعة
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Filters Section */}
      <div className="filters-container">
        <div className="filter-group">
        <select
        name="category"
        value={filters.category}
        className="filter-select"
        onChange={handleFilterChange}
      >
        <option value="">اختر الفئة</option>
        {categories.map((type) => (
          <option key={type.id} value={type.id}>
            {type.title}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        name="status"
        className="filter-select"
        value={filters.status}
        onChange={handleFilterChange}
      >
        <option value="">اختر الحالة</option>
        {statuses.map((status) => (
          <option key={status.id} value={status.id}>
            {status.title}
          </option>
        ))}
      </select>

      <select
          name="region"
          className="filter-select"
          value={filters.region}
          onChange={handleFilterChange}
        >
          <option value="">المنطقة</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>

        <select
          name="city"
          className="filter-select"
          value={filters.city}
          onChange={handleFilterChange}
        >
          <option value="">المدينة</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

          {/* Date Picker */}
          <div className="date-picker-container">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="calendar-icon"
              onClick={() => setIsCalendarOpen(true)}
            />
            <DatePicker
              selected={filters.date}
              onChange={handleDateChange}
              placeholderText="التاريخ"
              className="filter-select date-picker-input"
              open={isCalendarOpen}
              onClickOutside={() => setIsCalendarOpen(false)}
              ref={datePickerRef}
              popperModifiers={{
                preventOverflow: {
                  enabled: true,
                  boundariesElement: "viewport",
                },
                offset: {
                  enabled: true,
                  offset: "0, 10",
                },
              }}
              calendarClassName="calendar-up"
            />
          </div>

          <button className="filter-button" onClick={applyFilters}>
            ابحث الان
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
     <div className="results-list" style={{ width: '30%', overflowY: 'scroll', maxHeight: '80vh', padding: '10px', borderRight: '1px solid #ccc' }}>
            {results.length > 0 ? (
              results.map((result,idx) => (
                <div key={idx} className={`result-card ${result.color}`} style={{ padding: '15px', marginBottom: '10px', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
                  <p>{result.id}</p>
                  <img src={result.image} alt="" />
                  <h4>{result.title}</h4>
                  <p>{result.code}</p>
                  <p>{result.taemem_type}</p>
                </div>
              ))
            ) : (
              <p>لا توجد نتائج لعرضها</p>
            )}
    </div>

    <div style={{ width: '70%', padding: '10px' }}>
      <MapContainer center={[24.7136, 46.6753]} zoom={6} className="map-full" style={{ height: '80vh' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {markers.length > 0 ? (
          markers.map((marker, idx) => (
            <Marker key={idx} position={marker.position}>
              <Popup>{marker.text}</Popup>
            </Marker>
          ))
        ) : (
          <p>لا توجد علامات لعرضها</p>
        )}
      </MapContainer>
    </div>
</div>



  </>
  );
};

export default Home;
