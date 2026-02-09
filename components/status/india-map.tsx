"use client"

import { useEffect, useRef } from "react"
import type { Worker } from "./status-dashboard"

interface IndiaMapProps {
  workers: Worker[]
  selected: Worker | null
  onSelect: (worker: Worker) => void
}

export function IndiaMap({ workers, selected, onSelect }: IndiaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const mapInitializedRef = useRef(false)
  const markersRef = useRef<any[]>([])

  // 🔹 Initialize map ONCE (Strict Mode safe)
  useEffect(() => {
    if (!mapRef.current || mapInitializedRef.current) return

    mapInitializedRef.current = true
    let map: any

    const loadMap = async () => {
      const L = await import("leaflet")
      await import("leaflet/dist/leaflet.css")

      map = L.map(mapRef.current!, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map)

      mapInstanceRef.current = map
      updateMarkers(L, map)
    }

    loadMap()

    return () => {
      if (map) {
        map.remove()
        mapInstanceRef.current = null
        mapInitializedRef.current = false
      }
    }
  }, [])

  // 🔹 Update markers when workers / selection change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const loadL = async () => {
      const L = await import("leaflet")
      updateMarkers(L, mapInstanceRef.current)
    }

    loadL()
  }, [workers, selected])

  // 🔹 Marker handling
  const updateMarkers = (L: any, map: any) => {
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    workers.forEach((worker) => {
      const isSafe = worker.status === "safe"
      const isSelected = selected?.id === worker.id
      const size = isSelected ? 16 : 12

      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: ${isSafe ? "#2563eb" : "#ef4444"};
            border: 2px solid ${
              isSelected
                ? "#fff"
                : isSafe
                ? "#1d4ed8"
                : "#dc2626"
            };
            box-shadow: 0 0 ${
              isSelected ? "8" : "4"
            }px ${
              isSafe
                ? "rgba(37,99,235,0.5)"
                : "rgba(239,68,68,0.6)"
            };
            transition: all 0.2s;
          "></div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const marker = L.marker([worker.latitude, worker.longitude], {
        icon,
      })
        .addTo(map)
        .on("click", () => onSelect(worker))

      marker.bindTooltip(
        `${worker.helmet_number} - ${worker.worker_name}`,
        {
          direction: "top",
          offset: [0, -8],
        }
      )

      markersRef.current.push(marker)
    })
  }

  return (
    <div
      ref={mapRef}
      className="h-[500px] w-full lg:h-[600px]"
      style={{ zIndex: 0 }}
    />
  )
}
