"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { IndiaMap } from "@/components/status/india-map"
import { WorkerPanel } from "@/components/status/worker-panel"
import { WorkerDetail } from "@/components/status/worker-detail"
import { Loader2 } from "lucide-react"

export interface Worker {
  id: string
  helmet_number: string
  worker_name: string
  age: number | null
  gender: string | null
  health_condition: string | null
  worker_contact: string | null
  emergency_contact: string | null
  latitude: number
  longitude: number
  status: "safe" | "danger"
  danger_type: string | null
  created_at: string
}

export function StatusDashboard() {
  const supabase = createClient()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selected, setSelected] = useState<Worker | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchWorkers = useCallback(async () => {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setWorkers(data)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchWorkers()
  }, [fetchWorkers])

  const dangerWorkers = workers.filter((w) => w.status === "danger")

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Helmet Status
        </h1>
        <p className="mt-1 text-muted-foreground">
          Monitor all registered helmets in real time. Blue dots are safe, red
          dots indicate danger.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border bg-card">
            <IndiaMap
              workers={workers}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {selected ? (
            <WorkerDetail
              worker={selected}
              onClose={() => setSelected(null)}
            />
          ) : (
            <WorkerPanel
              dangerWorkers={dangerWorkers}
              totalWorkers={workers.length}
              onSelect={setSelected}
            />
          )}
        </div>
      </div>
    </div>
  )
}
