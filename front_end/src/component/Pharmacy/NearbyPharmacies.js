import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import userLocationIcon from '../../assets/location.png';
import pharmacyIcon from '../../assets/pharmacy.png';
import hotelIcon from '../../assets/hotel.png';
import restaurantIcon from '../../assets/restaurant.png';

const NearbyPharmacies = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [mapZoom, setMapZoom] = useState(13); // Initial zoom level
  const [error, setError] = useState(null); // State to store any error messages
  const [selectedType, setSelectedType] = useState('pharmacy'); // State to manage the selected type

  // Define fetchPharmacies function
  const fetchPharmacies = async (lat, lng) => {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const query = `
      [out:json];
      node["amenity"="pharmacy"](around:100000,${lat},${lng});
      out body;
      >;
      out skel qt;
    `;

    try {
      const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(query)}`
      });
      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      return [];
    }
  };

  // Define fetchHotels function
  const fetchHotels = async (lat, lng) => {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const query = `
      [out:json];
      node["amenity"="hotel"](around:100000,${lat},${lng});
      out body;
      >;
      out skel qt;
    `;

    try {
      const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(query)}`
      });
      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return [];
    }
  };

  // Define fetchRestaurants function
  const fetchRestaurants = async (lat, lng) => {
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const query = `
      [out:json];
      node["amenity"="restaurant"](around:100000,${lat},${lng});
      out body;
      >;
      out skel qt;
    `;

    try {
      const response = await fetch(overpassUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(query)}`
      });
      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  };

  useEffect(() => {
    // Fetch user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Fetch pharmacies, hotels, and restaurants near the user's location
          const pharmaciesData = await fetchPharmacies(latitude, longitude);
          setPharmacies(pharmaciesData);

          const hotelsData = await fetchHotels(latitude, longitude);
          setHotels(hotelsData);

          const restaurantsData = await fetchRestaurants(latitude, longitude);
          setRestaurants(restaurantsData);

          // Calculate a new zoom level that is 30% more than the initial zoom level
          const newZoom = Math.min(18, mapZoom * 1.3); // Ensure the zoom level does not exceed the maximum allowed (18)
          setMapZoom(newZoom);
        },
        (error) => {
          console.error('Error fetching location:', error);
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permission denied. Please enable location services in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings.';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get user location timed out. Please try again later.';
              break;
            case error.UNKNOWN_ERROR:
              errorMessage = 'An unknown error occurred. Please try again later.';
              break;
            default:
              errorMessage = 'Unable to fetch your location. Please check your browser settings and try again.';
          }
          setError(errorMessage);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
      setError('Geolocation is not supported by your browser.');
    }
  }, []); // Empty dependency array ensures this runs only once on page load

  // Create a custom icon for user location
  const customUserIcon = L.icon({
    iconUrl: userLocationIcon, // Path to your custom icon image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
  });

  // Create a custom icon for pharmacies with a circular background
  const createCustomPharmacyIcon = () => {
    return L.divIcon({
      className: 'custom-icon',
      html: `
        <div style="
          background: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        ">
          <img src="${pharmacyIcon}" alt="Pharmacy" style="width: 20px; height: 20px;" />
        </div>
      `,
      iconSize: [32, 32], // Size of the icon
      iconAnchor: [16, 16], // Center the icon
    });
  };

  // Create a custom icon for hotels with a circular background
  const createCustomHotelIcon = () => {
    return L.divIcon({
      className: 'custom-icon',
      html: `
        <div style="
          background: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        ">
          <img src="${hotelIcon}" alt="Hotel" style="width: 20px; height: 20px;" />
        </div>
      `,
      iconSize: [32, 32], // Size of the icon
      iconAnchor: [16, 16], // Center the icon
    });
  };

  // Create a custom icon for restaurants with a circular background
  const createCustomRestaurantIcon = () => {
    return L.divIcon({
      className: 'custom-icon',
      html: `
        <div style="
          background: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        ">
          <img src="${restaurantIcon}" alt="Restaurant" style="width: 20px; height: 20px;" />
        </div>
      `,
      iconSize: [32, 32], // Size of the icon
      iconAnchor: [16, 16], // Center the icon
    });
  };

  // Custom zoom control with Google Maps-like icons
  const CustomZoomControl = () => {
    const map = useMap();

    useEffect(() => {
      const zoomControl = L.Control.extend({
        onAdd: function () {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          container.style.backgroundColor = 'white';
          container.style.borderRadius = '4px';
          container.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

          const zoomInButton = L.DomUtil.create('button', 'leaflet-control-zoom-in', container);
          zoomInButton.innerHTML = '+';
          zoomInButton.style.fontSize = '18px';
          zoomInButton.style.fontWeight = 'bold';
          zoomInButton.style.color = '#333';
          zoomInButton.style.borderBottom = '1px solid #ddd';
          zoomInButton.style.cursor = 'pointer';
          zoomInButton.style.width = '30px';
          zoomInButton.style.height = '30px';
          zoomInButton.style.display = 'flex';
          zoomInButton.style.alignItems = 'center';
          zoomInButton.style.justifyContent = 'center';

          const zoomOutButton = L.DomUtil.create('button', 'leaflet-control-zoom-out', container);
          zoomOutButton.innerHTML = '−';
          zoomOutButton.style.fontSize = '18px';
          zoomOutButton.style.fontWeight = 'bold';
          zoomOutButton.style.color = '#333';
          zoomOutButton.style.cursor = 'pointer';
          zoomOutButton.style.width = '30px';
          zoomOutButton.style.height = '30px';
          zoomOutButton.style.display = 'flex';
          zoomOutButton.style.alignItems = 'center';
          zoomOutButton.style.justifyContent = 'center';

          zoomInButton.onclick = () => map.zoomIn();
          zoomOutButton.onclick = () => map.zoomOut();

          return container;
        },
      });

      const control = new zoomControl({ position: 'topright' });
      control.addTo(map);

      return () => {
        control.remove();
      };
    }, [map]);

    return null;
  };

  // Custom "Home" button to reset the map view
  const CustomHomeButton = () => {
    const map = useMap();

    useEffect(() => {
      const homeControl = L.Control.extend({
        onAdd: function () {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          container.style.backgroundColor = 'white';
          container.style.borderRadius = '4px';
          container.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
          container.style.marginTop = '10px';

          const homeButton = L.DomUtil.create('button', 'leaflet-control-home', container);
          homeButton.innerHTML = '🏠';
          homeButton.style.fontSize = '18px';
          homeButton.style.cursor = 'pointer';
          homeButton.style.width = '30px';
          homeButton.style.height = '30px';
          homeButton.style.display = 'flex';
          homeButton.style.alignItems = 'center';
          homeButton.style.justifyContent = 'center';

          homeButton.onclick = () => {
            if (userLocation) {
              map.setView([userLocation.lat, userLocation.lng], mapZoom);
            }
          };

          return container;
        },
      });

      const control = new homeControl({ position: 'bottomright' });
      control.addTo(map);

      return () => {
        control.remove();
      };
    }, [map, userLocation, mapZoom]);

    return null;
  };

  // Custom control bar for switching between pharmacy, hotel, and restaurant views
  const CustomControlBar = () => {
    const map = useMap();

    useEffect(() => {
      const controlBar = L.Control.extend({
        onAdd: function () {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
          container.style.backgroundColor = 'white';
          container.style.borderRadius = '4px';
          container.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
          container.style.display = 'flex';
          container.style.flexDirection = 'column';
          container.style.gap = '5px';
          container.style.padding = '5px';

          const pharmacyButton = L.DomUtil.create('button', 'leaflet-control-pharmacy', container);
          pharmacyButton.innerHTML = `<img src="${pharmacyIcon}" alt="Pharmacy" style="width: 20px; height: 20px;" />`;
          pharmacyButton.style.cursor = 'pointer';
          pharmacyButton.style.width = '30px';
          pharmacyButton.style.height = '30px';
          pharmacyButton.style.display = 'flex';
          pharmacyButton.style.alignItems = 'center';
          pharmacyButton.style.justifyContent = 'center';

          const hotelButton = L.DomUtil.create('button', 'leaflet-control-hotel', container);
          hotelButton.innerHTML = `<img src="${hotelIcon}" alt="Hotel" style="width: 20px; height: 20px;" />`;
          hotelButton.style.cursor = 'pointer';
          hotelButton.style.width = '30px';
          hotelButton.style.height = '30px';
          hotelButton.style.display = 'flex';
          hotelButton.style.alignItems = 'center';
          hotelButton.style.justifyContent = 'center';

          const restaurantButton = L.DomUtil.create('button', 'leaflet-control-restaurant', container);
          restaurantButton.innerHTML = `<img src="${restaurantIcon}" alt="Restaurant" style="width: 20px; height: 20px;" />`;
          restaurantButton.style.cursor = 'pointer';
          restaurantButton.style.width = '30px';
          restaurantButton.style.height = '30px';
          restaurantButton.style.display = 'flex';
          restaurantButton.style.alignItems = 'center';
          restaurantButton.style.justifyContent = 'center';

          pharmacyButton.onclick = () => setSelectedType('pharmacy');
          hotelButton.onclick = () => setSelectedType('hotel');
          restaurantButton.onclick = () => setSelectedType('restaurant');

          return container;
        },
      });

      const control = new controlBar({ position: 'topleft' });
      control.addTo(map);

      return () => {
        control.remove();
      };
    }, [map]);

    return null;
  };

  return (
    <div className="p-4 mt-5">
      {userLocation ? (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={mapZoom}
          style={{ height: '500px', width: '100%' }}
          zoomControl={false} // Disable default zoom control
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          {/* Add custom zoom control */}
          <CustomZoomControl />
          {/* Add custom home button */}
          <CustomHomeButton />
          {/* Add custom control bar */}
          <CustomControlBar />
          <Marker position={[userLocation.lat, userLocation.lng]} icon={customUserIcon}>
            <Popup>
              <div>
                <h3>Your Location</h3>
                <p>Latitude: {userLocation.lat}</p>
                <p>Longitude: {userLocation.lng}</p>
              </div>
            </Popup>
          </Marker>
          {selectedType === 'pharmacy' &&
            pharmacies.map((pharmacy, index) => (
              <Marker
                key={index}
                position={[pharmacy.lat, pharmacy.lon]}
                icon={createCustomPharmacyIcon()}
              >
                <Popup>
                  <div>
                    <h3>{pharmacy.tags.name || 'Pharmacy'}</h3>
                    <p>{pharmacy.tags['addr:street'] || ''}</p>
                    <p>{pharmacy.tags['addr:city'] || ''}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          {selectedType === 'hotel' &&
            hotels.map((hotel, index) => (
              <Marker
                key={index}
                position={[hotel.lat, hotel.lon]}
                icon={createCustomHotelIcon()}
              >
                <Popup>
                  <div>
                    <h3>{hotel.tags.name || 'Hotel'}</h3>
                    <p>{hotel.tags['addr:street'] || ''}</p>
                    <p>{hotel.tags['addr:city'] || ''}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          {selectedType === 'restaurant' &&
            restaurants.map((restaurant, index) => (
              <Marker
                key={index}
                position={[restaurant.lat, restaurant.lon]}
                icon={createCustomRestaurantIcon()}
              >
                <Popup>
                  <div>
                    <h3>{restaurant.tags.name || 'Restaurant'}</h3>
                    <p>{restaurant.tags['addr:street'] || ''}</p>
                    <p>{restaurant.tags['addr:city'] || ''}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Locating...</p>
      )}
    </div>
  );
};

export default NearbyPharmacies;