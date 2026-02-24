"use client";

import { useEffect, useRef } from "react";

const GoogleMaps = ({ apiKey, latitude, longitude, zoom = 15, className = "", title = "Map" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!apiKey || !latitude || !longitude) {
      return;
    }

    if (typeof window !== "undefined" && window.google && window.google.maps) {
      initializeMap();
    } else {
      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initializeMap();
        };
        document.head.appendChild(script);
      }
    }

    function initializeMap() {
      if (!mapRef.current || mapInstanceRef.current) {
        return;
      }

      const getColorValue = (cssVar, fallback) => {
        if (typeof window === "undefined" || !document.documentElement) {
          return fallback;
        }
        const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
        return value || fallback;
      };

      const colorBlack = "#000000";
      const colorDark = getColorValue("--color-dark", getColorValue("--color-dark-grey", "#252424"));
      const colorMidDark = getColorValue("--color-mid-dark", "#333333");
      const colorGray = getColorValue("--color-gray", "#333333");
      const colorLightGray = getColorValue("--color-light-gray", "#B1B3B4");
      const colorWhite = "#FFFFFF";
      const colorAccentGold = getColorValue("--color-accent-gold", "#F9B200");

      const mapStyles = [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ color: colorMidDark }],
        },
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [{ color: colorLightGray }],
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [{ color: colorDark }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: colorGray }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: colorDark }],
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [{ color: colorMidDark }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: colorGray }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: colorLightGray }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [{ color: colorGray }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: colorGray }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: colorLightGray }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: colorBlack }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: colorLightGray }],
        },
      ];

      const mapOptions = {
        center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        zoom: parseInt(zoom),
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        styles: mapStyles,
      };

      const rect = mapRef.current.getBoundingClientRect()
      const mapWidth = rect.width || mapRef.current.offsetWidth || window.innerWidth

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      window.google.maps.event.addListenerOnce(mapInstanceRef.current, "idle", () => {
        if (!mapRef.current || !mapInstanceRef.current) return
        
        const currentRect = mapRef.current.getBoundingClientRect()
        const currentWidth = currentRect.width
        
        if (currentWidth === 0 || currentRect.height === 0) return
        
        const bounds = mapInstanceRef.current.getBounds()
        if (!bounds) return
        
        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()
        const lngSpan = ne.lng() - sw.lng()
        
        const offsetPercent = 0.25
        const offsetLng = lngSpan * offsetPercent
        
        const isMobile = window.innerWidth <= 800
        
        if (isMobile) {
          mapInstanceRef.current.setCenter({
            lat: parseFloat(latitude) + offsetLng,
            lng: parseFloat(longitude)
          })
        } else {
          mapInstanceRef.current.setCenter({
            lat: parseFloat(latitude),
            lng: parseFloat(longitude) - offsetLng
          })
        }
      })

      const svgIcon = encodeURIComponent(`<svg width="48" height="18" viewBox="0 0 48 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M45.8785 0C47.0502 0 48 0.962254 48 2.14925V15.8507C48 17.0377 47.0502 18 45.8785 18H2.12155C0.949849 18 0 17.0377 0 15.8507V2.14925C1.87944e-07 0.962254 0.949849 0 2.12155 0H45.8785ZM24.4087 1.76358C23.673 1.76359 22.9631 1.85497 22.2791 2.03801C21.6081 2.22104 21.008 2.50214 20.4789 2.88124C19.9627 3.2604 19.5495 3.75746 19.2397 4.37197C18.93 4.97336 18.7751 5.69241 18.7751 6.52909C18.7751 7.56196 19.1107 8.41191 19.7818 9.07871C20.4529 9.73244 21.4339 10.164 22.7245 10.3732L25.5896 10.8439C26.1058 10.9354 26.493 11.0791 26.7511 11.2752C27.0092 11.4582 27.1383 11.7263 27.1383 12.0793C27.1383 12.38 27.048 12.6349 26.8674 12.8441C26.6867 13.0533 26.4607 13.2234 26.1897 13.3541C25.9316 13.4718 25.6541 13.5568 25.3573 13.6091C25.0605 13.6614 24.7958 13.6876 24.5635 13.6876C23.7376 13.6876 23.0149 13.537 22.3954 13.2363C21.7888 12.9225 21.1821 12.4912 20.5755 11.9421L17.9428 13.6679C18.8849 14.7139 19.8594 15.4526 20.8661 15.8841C21.8856 16.3024 22.9826 16.5116 24.1569 16.5116C24.8022 16.5116 25.4929 16.4461 26.2285 16.3154C26.9641 16.1977 27.6483 15.9624 28.2806 15.6094C28.913 15.2433 29.4355 14.7335 29.8485 14.0798C30.2615 13.4261 30.4682 12.5762 30.4682 11.5302C30.4682 10.8634 30.3327 10.3011 30.0616 9.84349C29.8035 9.38593 29.4421 9.00686 28.9776 8.70616C28.5259 8.40545 27.9966 8.17012 27.39 8.00015C26.7834 7.8171 26.1382 7.66656 25.4542 7.54889L24.1378 7.33323C23.4796 7.22863 22.9954 7.07835 22.6857 6.88223C22.376 6.67304 22.2211 6.3788 22.2211 5.99965C22.2211 5.77738 22.2857 5.58115 22.4148 5.41118C22.5438 5.22818 22.7053 5.07783 22.8988 4.96018C23.0924 4.84256 23.3052 4.75111 23.5375 4.68575C23.7698 4.62038 23.9828 4.58763 24.1764 4.58763C24.912 4.58763 25.5961 4.74451 26.2285 5.0583C26.8738 5.35901 27.4224 5.79035 27.8741 6.35252L30.4874 4.45041C29.713 3.57443 28.7904 2.90753 27.7192 2.44992C26.6609 1.99231 25.5573 1.76358 24.4087 1.76358Z" fill="#F9B200"/></svg>`);
      const iconUrl = `data:image/svg+xml,${svgIcon}`;

      const marker = new window.google.maps.Marker({
        position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        map: mapInstanceRef.current,
        icon: {
          url: iconUrl,
          scaledSize: new window.google.maps.Size(48, 18),
          anchor: new window.google.maps.Point(24, 18),
        },
      });

      marker.addListener("click", () => {
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [apiKey, latitude, longitude, zoom]);

  if (!latitude || !longitude) {
    return null;
  }

  return (
    <div className={`google-maps ${className}`}>
      <div 
        ref={mapRef} 
        className="google-maps__container" 
        role="img"
        aria-label={title}
        title={title}
        tabIndex={0}
      />
    </div>
  );
};

export default GoogleMaps;

