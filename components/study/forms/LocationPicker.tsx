'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { EGYPT_GOVERNORATES } from '@/lib/egypt-locations';

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  latKey?: string;
  lngKey?: string;
  lat?: string;
  lng?: string;
  onLatLngChange?: (lat: string, lng: string) => void;
  hideDistrict?: boolean;
}

export function LocationPicker({
  value, onChange,
  lat, lng, onLatLngChange,
  hideDistrict = false,
}: LocationPickerProps) {
  const t = useTranslations('easyStart');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [govId, setGovId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const governorate = EGYPT_GOVERNORATES.find(g => g.id === govId);

  // Sync dropdowns → parent value
  useEffect(() => {
    if (manualMode || !govId) return;
    const gov = EGYPT_GOVERNORATES.find(g => g.id === govId);
    if (!gov) return;
    const govName = isAr ? gov.nameAr : gov.name;
    if (!districtId) { onChange(govName); return; }
    const dist = gov.districts.find(d => d.id === districtId);
    if (!dist) return;
    const distName = isAr ? dist.nameAr : dist.name;
    onChange(`${distName}، ${govName}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [govId, districtId, manualMode, isAr]);

  // Load Google Maps
  const initMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const center = { lat: 30.0444, lng: 31.2357 }; // Cairo default
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    mapInstanceRef.current = map;

    const marker = new window.google.maps.Marker({
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      position: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : center,
    });
    markerRef.current = marker;

    const onPosChange = () => {
      const pos = marker.getPosition();
      if (!pos || !onLatLngChange) return;
      onLatLngChange(pos.lat().toFixed(6), pos.lng().toFixed(6));
    };

    marker.addListener('dragend', onPosChange);
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      marker.setPosition(e.latLng);
      onPosChange();
    });

    if (lat && lng) onLatLngChange?.(lat, lng);
  }, [lat, lng, onLatLngChange]);

  useEffect(() => {
    if (!showMap) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    if (window.google?.maps) { initMap(); return; }

    const existing = document.getElementById('gmaps-script');
    if (existing) { existing.addEventListener('load', initMap); return; }

    const script = document.createElement('script');
    script.id = 'gmaps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, [showMap, initMap]);

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const sel: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1.5px solid #E4E4EE', fontSize: '13px', outline: 'none',
    background: '#fff', cursor: 'pointer', color: '#1A1A2E',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {!manualMode ? (
        <div style={{ display: 'grid', gridTemplateColumns: hideDistrict ? '1fr' : '1fr 1fr', gap: '8px' }}>
          {/* Governorate */}
          <select style={sel} value={govId} onChange={e => { setGovId(e.target.value); setDistrictId(''); }}>
            <option value="">{t('locationPickGov')}</option>
            {EGYPT_GOVERNORATES.map(g => (
              <option key={g.id} value={g.id}>{isAr ? g.nameAr : g.name}</option>
            ))}
          </select>

          {/* District — hidden when hideDistrict=true */}
          {!hideDistrict && (
            <select
              style={{ ...sel, opacity: govId ? 1 : 0.5 }}
              value={districtId}
              onChange={e => setDistrictId(e.target.value)}
              disabled={!govId}
            >
              <option value="">{t('locationPickDistrict')}</option>
              {governorate?.districts.map(d => (
                <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.name}</option>
              ))}
            </select>
          )}
        </div>
      ) : (
        <input
          type="text"
          className="easy-form-input"
          placeholder={t('locationPlaceholder')}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      )}

      {/* Bottom row: toggle + map btn + pin display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => { setManualMode(m => !m); }}
          style={{
            fontSize: '11px', color: '#7C3AED', background: 'none',
            border: '1px solid #E4E4EE', borderRadius: '6px',
            padding: '4px 10px', cursor: 'pointer',
          }}
        >
          {manualMode ? t('locationUseDropdown') : t('locationTypeManually')}
        </button>

        <button
          type="button"
          onClick={() => setShowMap(m => !m)}
          style={{
            fontSize: '11px', color: '#fff',
            background: showMap ? '#e74c3c' : '#1A1A2E',
            border: 'none', borderRadius: '6px',
            padding: '4px 10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}
        >
          📍 {showMap ? t('locationHideMap') : t('locationShowMap')}
        </button>

        {lat && lng && (
          <span style={{ fontSize: '11px', color: '#27ae60', marginRight: 'auto' }}>
            ✅ {t('locationPinned')}: {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}
          </span>
        )}
      </div>

      {/* Map panel */}
      {showMap && (
        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #E4E4EE' }}>
          {mapsApiKey ? (
            <>
              <div style={{ padding: '8px 12px', background: '#F2F2F7', fontSize: '11px', color: '#666' }}>
                📍 {t('locationMapHint')}
              </div>
              <div ref={mapRef} style={{ width: '100%', height: '260px' }} />
            </>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', background: '#FFF8E1', fontSize: '12px', color: '#795548' }}>
              ⚠️ {t('locationMapNoKey')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
