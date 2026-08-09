import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign, Check, X, Sparkles, Layers } from 'lucide-react';
import { Service } from '../../types';

interface ServicesTabProps {
  services: Service[];
  onSaveService: (service: Partial<Service> & { id?: string }) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  onSaveService,
  onDeleteService
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [price, setPrice] = useState<number>(100);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleOpenCreate = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setDurationMinutes(30);
    setPrice(150);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setDescription(srv.description);
    setDurationMinutes(srv.duration_minutes);
    setPrice(srv.price);
    setIsActive(srv.is_active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await onSaveService({
        id: editingService?.id,
        name: name.trim(),
        description: description.trim(),
        duration_minutes: Number(durationMinutes),
        price: Number(price),
        is_active: isActive
      });
      setModalOpen(false);
    } catch (err) {
      console.error('Save service error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (srv: Service) => {
    await onSaveService({
      ...srv,
      is_active: !srv.is_active
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-slate-900 font-semibold">Services Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure clinical treatments, set appointment durations, and manage fees.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
          id="btn-add-new-service"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] bg-slate-50/70">
                <th className="py-3.5 px-4 font-bold">Service Name & Info</th>
                <th className="py-3.5 px-4 font-bold">Duration</th>
                <th className="py-3.5 px-4 font-bold">Price</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 max-w-sm">
                    <p className="font-bold text-slate-900 text-sm">{srv.name}</p>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">{srv.description}</p>
                  </td>

                  <td className="py-4 px-4 font-medium text-slate-700">
                    <span className="inline-flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{srv.duration_minutes} min</span>
                    </span>
                  </td>

                  <td className="py-4 px-4 font-bold text-teal-900">
                    {srv.price === 0 ? 'Free' : `$${srv.price}`}
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleActive(srv)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        srv.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${srv.is_active ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                      <span>{srv.is_active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEdit(srv)}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-teal-800 rounded-lg cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteService(srv.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Service Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-xl font-semibold text-slate-900">
                {editingService ? 'Edit Treatment Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ceramic Porcelain Crown"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Clinical treatment details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-800 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is-active-check"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-teal-800 border-slate-300 rounded focus:ring-teal-800 cursor-pointer"
                />
                <label htmlFor="is-active-check" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Service active and visible in online booking
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
