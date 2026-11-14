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
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-charcoal">
      <CompanionHeader isOnline={true} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">Weekly Availability</h1>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Customers can only book appointments during your enabled working hours
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 h-10 rounded-xl shadow-subtle gap-2"
          >
            <Save className="h-4 w-4" /> Save Schedule
          </Button>
        </div>

        {isSaved && (
          <div className="p-4 rounded-2xl bg-accent-light border border-accent/30 text-accent text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span>Weekly calendar availability saved successfully!</span>
          </div>
        )}

        <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
          <div className="divide-y divide-charcoal-border">
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
                      day.isActive ? 'bg-accent' : 'bg-charcoal-border'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white block transition-transform shadow-subtle ${
                        day.isActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-bold ${day.isActive ? 'text-navy-900' : 'text-charcoal-muted'}`}>
                    {day.dayName}
                  </span>
                </div>

                {day.isActive ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-charcoal-muted font-medium">From</span>
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => updateHours(day.dayOfWeek, 'startTime', e.target.value)}
                      className="h-9 rounded-xl border border-charcoal-border bg-white px-2.5 text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    />
                    <span className="text-charcoal-muted font-medium">To</span>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => updateHours(day.dayOfWeek, 'endTime', e.target.value)}
                      className="h-9 rounded-xl border border-charcoal-border bg-white px-2.5 text-xs font-bold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-charcoal-muted italic">Day off / Unavailable for bookings</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
