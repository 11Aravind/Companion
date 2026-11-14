'use client';

import * as React from 'react';
import { CustomerHeader } from '@/components/shell/CustomerHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/hooks/useUser';
import { User, Phone, Mail, ShieldAlert, MapPin, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';

interface SavedPlace {
  id: string;
  label: string;
  address: string;
}

export default function CustomerProfilePage() {
  const { profile } = useUser();

  const [fullName, setFullName] = React.useState(profile?.fullName || 'Sanjay Varma');
  const [email] = React.useState(profile?.email || 'sanjay.varma@example.com');
  const [phone, setPhone] = React.useState(profile?.phone || '+91 98765 43210');

  // Emergency Contact (Critical for Safety)
  const [emergencyName, setEmergencyName] = React.useState('Lakshmi Varma');
  const [emergencyPhone, setEmergencyPhone] = React.useState('+91 98765 11223');
  const [emergencyRel, setEmergencyRel] = React.useState('Spouse');

  // Saved Places
  const [savedPlaces, setSavedPlaces] = React.useState<SavedPlace[]>([
    { id: '1', label: 'Home', address: 'Greams Road, Thousand Lights, Chennai' },
    { id: '2', label: "Mother's Clinic", address: 'Apollo Hospitals, Greams Road, Chennai' },
  ]);
  const [newPlaceLabel, setNewPlaceLabel] = React.useState('');
  const [newPlaceAddress, setNewPlaceAddress] = React.useState('');

  const [isSaved, setIsSaved] = React.useState(false);

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceLabel.trim() || !newPlaceAddress.trim()) return;
    setSavedPlaces([
      ...savedPlaces,
      { id: Date.now().toString(), label: newPlaceLabel.trim(), address: newPlaceAddress.trim() },
    ]);
    setNewPlaceLabel('');
    setNewPlaceAddress('');
  };

  const handleDeletePlace = (id: string) => {
    setSavedPlaces(savedPlaces.filter((p) => p.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col text-charcoal">
      <CustomerHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">Customer Profile & Safety</h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Manage your personal profile, safety emergency contacts, and saved meeting addresses
          </p>
        </div>

        {isSaved && (
          <div className="p-4 rounded-2xl bg-accent-light border border-accent/30 text-accent text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            <span>Profile and emergency preferences updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Personal Information */}
          <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
            <h3 className="text-base font-bold text-navy-900 mb-4 pb-2 border-b border-charcoal-border">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1.5">Full Name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  icon={<User className="h-4 w-4" />}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal block mb-1.5">Phone Number</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-charcoal block mb-1.5">Registered Email</label>
                <Input value={email} disabled icon={<Mail className="h-4 w-4" />} className="bg-navy-50 text-charcoal-muted" />
              </div>
            </div>
          </Card>

          {/* Emergency Contact Information */}
          <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6 border-l-4 border-l-accent">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="h-5 w-5 text-accent" />
              <h3 className="text-base font-bold text-navy-900">Emergency Contact (Safety First)</h3>
            </div>
            <p className="text-xs text-charcoal-muted mb-4">
              During any active companion booking, our safety center or your companion can notify this contact in case of an emergency.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1.5">Contact Name</label>
                <Input
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Spouse / Sibling"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1.5">Emergency Phone</label>
                <Input
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-charcoal block mb-1.5">Relationship</label>
                <Input
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  placeholder="e.g. Spouse, Parent, Friend"
                />
              </div>
            </div>
          </Card>

          {/* Saved Meeting Locations */}
          <Card className="rounded-3xl border border-charcoal-border shadow-subtle bg-white p-6">
            <h3 className="text-base font-bold text-navy-900 mb-2">Saved Meeting Addresses</h3>
            <p className="text-xs text-charcoal-muted mb-4">
              Quickly prefill frequent meeting spots when booking companions
            </p>

            <div className="space-y-2.5 mb-6">
              {savedPlaces.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F8FA] border border-charcoal-border text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-[#2583E8] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy-900 block">{place.label}</span>
                      <span className="text-charcoal-muted">{place.address}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePlace(place.id)}
                    className="p-1.5 text-charcoal-muted hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new place */}
            <div className="p-4 rounded-2xl bg-navy-50/50 border border-charcoal-border border-dashed space-y-3">
              <span className="text-xs font-bold text-navy-900 block">Add New Saved Location</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="Label (e.g. Office, Gym)"
                  value={newPlaceLabel}
                  onChange={(e) => setNewPlaceLabel(e.target.value)}
                  className="bg-white h-9 text-xs"
                />
                <Input
                  placeholder="Full meeting address"
                  value={newPlaceAddress}
                  onChange={(e) => setNewPlaceAddress(e.target.value)}
                  className="sm:col-span-2 bg-white h-9 text-xs"
                />
              </div>
              <Button
                type="button"
                onClick={handleAddPlace}
                variant="outline"
                size="sm"
                className="text-xs font-bold h-8 gap-1 bg-white border-charcoal-border"
              >
                <Plus className="h-3.5 w-3.5" /> Add Location
              </Button>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 h-11 rounded-xl shadow-subtle gap-2">
              <Save className="h-4 w-4" /> Save Profile Preferences
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
