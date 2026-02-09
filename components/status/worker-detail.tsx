'use client';

import React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Phone, AlertTriangle, ShieldCheck, User } from "lucide-react"
import type { Worker } from "./status-dashboard"

interface WorkerDetailProps {
  worker: Worker
  onClose: () => void
}

export function WorkerDetail({ worker, onClose }: WorkerDetailProps) {
  const isSafe = worker.status === "safe"

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-display text-lg">
            {worker.worker_name}
          </CardTitle>
          <Badge
            variant={isSafe ? "secondary" : "destructive"}
            className="w-fit text-xs"
          >
            {isSafe ? (
              <ShieldCheck className="mr-1 h-3 w-3" />
            ) : (
              <AlertTriangle className="mr-1 h-3 w-3" />
            )}
            {isSafe ? "Safe" : worker.danger_type || "Danger"}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DetailRow
          icon={<User className="h-4 w-4 text-primary" />}
          label="Helmet ID"
          value={worker.helmet_number}
        />
        <DetailRow
          icon={<MapPin className="h-4 w-4 text-primary" />}
          label="GPS Location"
          value={`${worker.latitude.toFixed(4)}, ${worker.longitude.toFixed(4)}`}
        />
        {worker.age && (
          <DetailRow
            icon={<User className="h-4 w-4 text-primary" />}
            label="Age / Gender"
            value={`${worker.age}${worker.gender ? ` / ${worker.gender}` : ""}`}
          />
        )}
        {worker.health_condition && (
          <DetailRow
            icon={<AlertTriangle className="h-4 w-4 text-accent" />}
            label="Health Condition"
            value={worker.health_condition}
          />
        )}
        {worker.worker_contact && (
          <DetailRow
            icon={<Phone className="h-4 w-4 text-primary" />}
            label="Worker Contact"
            value={worker.worker_contact}
          />
        )}
        {worker.emergency_contact && (
          <DetailRow
            icon={<Phone className="h-4 w-4 text-destructive" />}
            label="Emergency Contact"
            value={worker.emergency_contact}
          />
        )}

        {!isSafe && (
          <div className="mt-2 rounded-lg bg-destructive/10 p-3">
            <p className="text-xs font-medium text-destructive">
              Risk Detected: {worker.danger_type || "Unknown hazard"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Emergency services have been notified. Please take immediate
              action.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
