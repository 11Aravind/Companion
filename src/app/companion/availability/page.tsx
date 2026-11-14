'use client';

import * as React from 'react';
import { CompanionHeader } from '@/components/shell/CompanionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Save, CheckCircle2, ShieldCheck, Power } from 'lucide-react';

interface DaySlot {
  dayOfWeek: number;
  dayName: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

const INITIAL_DAYS: DaySlot[] = [
  { dayOfWeek: 1, dayName: 'Monday', isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 2, dayName: 'Tuesday', isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 3, dayName: 'Wednesday', isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 4, dayName: 'Thursday', isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 5, dayName: 'Friday', isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 6, dayName: 'Saturday', isActive: true, startTime: '10:00', endTime: '16:00' },
  { dayOfWeek: 0, dayName: 'Sunday', isActive: false, startTime: '10:00', endTime: '16:00' },
];

export default function CompanionAvailabilityPage() {
  const [schedule, setSchedule] = React.useState<DaySlot[]>(INITIAL_DAYS);
  const [isSaved, setIsSaved] = React.useState(false);

  const toggleDay = (dayOfWeek: number) => {
    setSchedule(
      schedule.map((slot) =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, isActive: !slot.isActive } : slot
      )
    );
  };

  const updateHours = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(
      schedule.map((slot) =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CompanionHeader isOnline={true} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8 max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy-950 tracking-tight">Weekly Availability Schedule</h1>
            <p className="text-xs text-slate-500 mt-1">
              Customers can only book appointments during your enabled working hours
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 h-10 rounded-xl shadow-md gap-2"
          >
            <Save className="h-4 w-4" /> Save Schedule
          </Button>
        </div>

        {isSaved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Weekly calendar availability saved successfully!</span>
          </div>
        )}

        <Card className="rounded-2xl border-slate-200/90 shadow-sm bg-white p-6">
          <div className="divide-y divide-slate-100">
            {schedule.map((day) => (
              <div
                key={day.dayOfWeek}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 w-40">
                  <button
                    type="button"
                    onClick={() => toggleDay(day.dayOfWeek)}
                    className={`h-6 w-11 rounded-full transition-colors relative p-0.5 ${
                      day.isActive ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white block transition-transform shadow-sm ${
                        day.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-bold ${day.isActive ? 'text-navy-950' : 'text-slate-400'}`}>
                    {day.dayName}
                  </span>
                </div>

                {day.isActive ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">From</span>
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => updateHours(day.dayOfWeek, 'startTime', e.target.value)}
                      className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold"
                    />
                    <span className="text-slate-500">To</span>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => updateHours(day.dayOfWeek, 'endTime', e.target.value)}
                      className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">Day off / Unavailable for bookings</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}

