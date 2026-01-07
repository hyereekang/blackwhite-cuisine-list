
import React, { useEffect, useRef } from 'react';
import { GroundingSource } from '../types';

// Fix: Declaring google as any to bypass TypeScript errors when the Google Maps script is loaded dynamically
declare const google: any;

interface TravelMapProps {
  sources: GroundingSource[];
  userLocation?: { latitude: number; longitude: number };
}

const TravelMap: React.FC<TravelMapProps> = ({ sources, userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // Fix: Use any type for the map reference to avoid namespace 'google' errors
  const googleMap = useRef<any>(null);

  useEffect(() => {
    const loadMap = () => {
      // Fix: Cast window to any to check for the presence of the google object
      if (!mapRef.current || !(window as any).google) return;

      const center = userLocation 
        ? { lat: userLocation.latitude, lng: userLocation.longitude }
        : { lat: 37.5665, lng: 126.9780 }; // 기본값 서울

      // Fix: Use the declared google variable to initialize the map
      googleMap.current = new google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        styles: [
          { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#616773" }] },
          { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#e0e0e0" }] },
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] },
          { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
        ],
        disableDefaultUI: true,
        zoomControl: true,
      });

      // Fix: Use google namespace for LatLngBounds and Geocoder
      const bounds = new google.maps.LatLngBounds();
      const geocoder = new google.maps.Geocoder();

      // 사용자 현재 위치 마커
      if (userLocation) {
        const userLatLng = { lat: userLocation.latitude, lng: userLocation.longitude };
        // Fix: Use google.maps.Marker for user location
        new google.maps.Marker({
          position: userLatLng,
          map: googleMap.current,
          title: "현재 위치",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#4f46e5',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 8
          }
        });
        bounds.extend(userLatLng);
      }

      // 추천 장소 마커 표시
      sources.forEach((source) => {
        if (source.uri.includes('maps')) {
          geocoder.geocode({ address: source.title }, (results: any, status: any) => {
            if (status === 'OK' && results?.[0] && googleMap.current) {
              // Fix: Use google.maps.Marker and Animation
              const marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: googleMap.current,
                title: source.title,
                animation: google.maps.Animation.DROP,
              });

              // Fix: Use google.maps.InfoWindow
              const infoWindow = new google.maps.InfoWindow({
                content: `<div style="padding: 8px; font-family: sans-serif;">
                  <h4 style="margin: 0 0 4px; font-weight: 800; color: #1e293b;">${source.title}</h4>
                  <a href="${source.uri}" target="_blank" style="color: #4f46e5; font-size: 12px; font-weight: 600; text-decoration: none;">상세 보기 →</a>
                </div>`
              });

              marker.addListener('click', () => {
                infoWindow.open(googleMap.current, marker);
              });

              bounds.extend(results[0].geometry.location);
              googleMap.current.fitBounds(bounds);
            }
          });
        }
      });
    };

    // Fix: Cast window to any to check if google maps is already loaded
    if ((window as any).google) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    }
  }, [sources, userLocation]);

  return (
    <div className="w-full h-[350px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 border border-slate-100 mb-8 fade-in">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default TravelMap;
