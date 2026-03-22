import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  ArrowLeft, 
  Home, 
  Building2, 
  Tag, 
  Layout
} from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export default function UnitForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(id ? true : false);
  const [projects, setProjects] = useState<any[]>([]);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      projectId: '',
      unitNumber: '',
      size: 0,
      price: 0,
      availability: 'Available'
    }
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('title', 'asc'));
        const snap = await getDocs(q);
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();

    if (id) {
      const fetchUnit = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'units', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            Object.keys(data).forEach(key => {
              setValue(key as any, data[key]);
            });
          }
        } catch (error) {
          console.error('Error fetching unit:', error);
        } finally {
          setFetching(false);
        }
      };
      fetchUnit();
    }
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const unitData = {
        ...data,
        size: Number(data.size),
        price: Number(data.price)
      };

      if (id) {
        await setDoc(doc(db, 'units', id), unitData);
      } else {
        await addDoc(collection(db, 'units'), unitData);
      }
      navigate('/admin/units');
    } catch (error) {
      console.error('Error saving unit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/units')}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-serif text-navy">{id ? 'Edit Unit' : 'Add New Unit'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-8 rounded-sm border border-slate-100 card-shadow">
          <h3 className="text-lg font-serif text-navy mb-6 pb-4 border-b border-slate-50">Unit Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Building2 size={12} className="mr-2" /> Select Project
              </label>
              <select 
                {...register('projectId', { required: true })}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors bg-transparent"
              >
                <option value="">Select a project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Home size={12} className="mr-2" /> Unit Number
              </label>
              <input 
                {...register('unitNumber', { required: true })}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="e.g. 101, A-402"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Layout size={12} className="mr-2" /> Size (Sq.Ft)
              </label>
              <input 
                type="number"
                {...register('size', { required: true, min: 1 })}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="e.g. 1250"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Tag size={12} className="mr-2" /> Price (₹)
              </label>
              <input 
                type="number"
                {...register('price', { required: true, min: 1 })}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="e.g. 7500000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Availability</label>
              <select 
                {...register('availability')}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors bg-transparent"
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Booked">Booked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="bg-navy text-white px-10 py-4 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all flex items-center justify-center space-x-3 rounded-sm shadow-xl shadow-navy/20 disabled:bg-navy/50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />
                <span>{id ? 'Update Unit' : 'Add Unit'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
