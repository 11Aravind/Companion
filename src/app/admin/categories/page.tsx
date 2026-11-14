'use client';

import { useState } from 'react';
import {
  Layers,
  Edit2,
  CheckCircle,
  XCircle,
  Plus,
  Clock,
  IndianRupee,
  Activity,
  Save,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { updateCategoryAction } from '@/app/actions/admin';
import { COMPANION_CATEGORIES } from '@/lib/constants';

interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  base_rate_per_hour: number;
  recommended_duration: string;
  is_active: boolean;
}

const initialCategories: CategoryItem[] = COMPANION_CATEGORIES.map((c: any, i: number) => ({
  id: `cat-00000000-0000-0000-0000-00000000000${i + 1}`,
  slug: c.id,
  name: c.name,
  description: c.description,
  icon: c.icon,
  base_rate_per_hour: c.baseRatePerHour,
  recommended_duration: c.recommendedDuration,
  is_active: true,
}));

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [rateInput, setRateInput] = useState<number>(0);
  const [nameInput, setNameInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setNameInput(cat.name);
    setDescInput(cat.description);
    setRateInput(cat.base_rate_per_hour);
    setDurationInput(cat.recommended_duration);
  };

  const handleSave = async () => {
    if (!editingCategory) return;
    setIsSaving(true);
    const updates = {
      name: nameInput,
      description: descInput,
      base_rate_per_hour: rateInput,
      recommended_duration: durationInput,
    };

    const res = await updateCategoryAction(editingCategory.id, updates);
    if (res.success) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updates } : c))
      );
      setEditingCategory(null);
    }
    setIsSaving(false);
  };

  const handleToggleActive = async (cat: CategoryItem) => {
    const newActive = !cat.is_active;
    const res = await updateCategoryAction(cat.id, { is_active: newActive });
    if (res.success) {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: newActive } : c))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">Activity Categories</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure companion activity domains, baseline pricing recommendations, and session durations.
          </p>
        </div>
        <Badge variant="primary" className="px-3 py-1 font-semibold text-xs">
          {categories.filter((c) => c.is_active).length} of {categories.length} Categories Live
        </Badge>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-5 flex flex-col justify-between border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{cat.icon}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    cat.is_active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>

              <h3 className="font-bold text-base text-navy-950">{cat.name}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{cat.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Baseline Rate</span>
                  <span className="font-bold text-navy-950 text-sm">₹{cat.base_rate_per_hour}/hr</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Duration</span>
                  <span className="font-medium text-slate-700">{cat.recommended_duration}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => startEdit(cat)}
                className="text-xs flex-1"
              >
                <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
              <Button
                size="sm"
                variant={cat.is_active ? 'danger' : 'secondary'}
                onClick={() => handleToggleActive(cat)}
                className="text-xs px-3"
              >
                {cat.is_active ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <Modal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          title={`Edit Category: ${editingCategory.name}`}
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-navy-950 block mb-1">Category Title</label>
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Fitness & Morning Walk"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-navy-950 block mb-1">Description</label>
              <textarea
                rows={3}
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-navy-950 block mb-1">
                  Base Rate (₹ / Hour)
                </label>
                <Input
                  type="number"
                  min={100}
                  step={50}
                  value={rateInput}
                  onChange={(e) => setRateInput(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-navy-950 block mb-1">
                  Recommended Duration
                </label>
                <Input
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  placeholder="e.g. 1 - 2 hours"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setEditingCategory(null)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-3.5 w-3.5 mr-1" /> Save Category
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
