import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  Layout
} from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(id ? true : false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      location: '',
      type: 'Flat',
      priceRange: '',
      status: 'Ongoing',
      image: '',
      description: '',
      amenities: [''],
      features: [''],
      gallery: [''],
      video: '',
      floorPlans: [''],
      brochure: ''
    }
  });

  const amenities = watch('amenities');
  const features = watch('features');
  const gallery = watch('gallery');
  const floorPlans = watch('floorPlans');

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'projects', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            Object.keys(data).forEach(key => {
              setValue(key as any, data[key]);
            });
          }
        } catch (error) {
          console.error('Error fetching project:', error);
        } finally {
          setFetching(false);
        }
      };
      fetchProject();
    }
  }, [id, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const projectData = {
        ...data,
        amenities: data.amenities.filter((a: string) => a.trim() !== ''),
        features: data.features.filter((f: string) => f.trim() !== ''),
        gallery: data.gallery.filter((g: string) => g.trim() !== ''),
        floorPlans: data.floorPlans.filter((fp: string) => fp.trim() !== ''),
        updatedAt: serverTimestamp(),
        createdAt: id ? data.createdAt : serverTimestamp()
      };

      if (id) {
        await setDoc(doc(db, 'projects', id), projectData);
      } else {
        await addDoc(collection(db, 'projects'), projectData);
      }
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const addField = (name: any) => {
    const current = watch(name);
    setValue(name, [...current, '']);
  };

  const removeField = (name: any, index: number) => {
    const current = watch(name);
    if (current.length > 1) {
      setValue(name, current.filter((_: any, i: number) => i !== index));
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
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/projects')}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-serif text-navy">{id ? 'Edit Project' : 'Add New Project'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-8 rounded-sm border border-slate-100 card-shadow">
          <h3 className="text-lg font-serif text-navy mb-6 pb-4 border-b border-slate-50">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Project Title</label>
              <input 
                {...register('title', { required: true })}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="e.g. Vanguard Heights"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Location</label>
              <input 
                {...register('location', { required: true })}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="e.g. Marine Drive, Mumbai"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Property Type</label>
              <select 
                {...register('type')}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors bg-transparent"
              >
                <option value="Flat">Flat</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Price Range</label>
              <input 
                {...register('priceRange', { required: true })}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="e.g. ₹ 2.5 Cr - 5.0 Cr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Status</label>
              <select 
                {...register('status')}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors bg-transparent"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Description</label>
              <textarea 
                {...register('description', { required: true })}
                rows={4}
                className="w-full border border-slate-200 p-3 focus:outline-none focus:border-gold text-sm transition-colors rounded-sm resize-none"
                placeholder="Detailed project description..."
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-8 rounded-sm border border-slate-100 card-shadow">
          <h3 className="text-lg font-serif text-navy mb-6 pb-4 border-b border-slate-50">Media & Assets</h3>
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <ImageIcon size={14} className="mr-2" /> Main Featured Image URL
              </label>
              <input 
                {...register('image', { required: true })}
                className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="https://.../featured.jpg"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Layout size={14} className="mr-2" /> Gallery Images
              </label>
              <div className="space-y-3">
                {gallery.map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input 
                      {...register(`gallery.${index}` as any)}
                      className="flex-grow border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                      placeholder={`Gallery image URL ${index + 1}`}
                    />
                    <button 
                      type="button"
                      onClick={() => removeField('gallery', index)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={() => addField('gallery')}
                  className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-navy transition-colors flex items-center"
                >
                  <Plus size={14} className="mr-1" /> Add Image
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                  <Video size={14} className="mr-2" /> Video Tour URL (Optional)
                </label>
                <input 
                  {...register('video')}
                  className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                  <FileText size={14} className="mr-2" /> Brochure URL (Optional)
                </label>
                <input 
                  {...register('brochure')}
                  className="w-full border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                  placeholder="https://.../brochure.pdf"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amenities & Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-sm border border-slate-100 card-shadow">
            <h3 className="text-lg font-serif text-navy mb-6 pb-4 border-b border-slate-50">Amenities</h3>
            <div className="space-y-3">
              {amenities.map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input 
                    {...register(`amenities.${index}` as any)}
                    className="flex-grow border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                    placeholder="e.g. Swimming Pool"
                  />
                  <button 
                    type="button"
                    onClick={() => removeField('amenities', index)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => addField('amenities')}
                className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-navy transition-colors flex items-center"
              >
                <Plus size={14} className="mr-1" /> Add Amenity
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-sm border border-slate-100 card-shadow">
            <h3 className="text-lg font-serif text-navy mb-6 pb-4 border-b border-slate-50">Key Features</h3>
            <div className="space-y-3">
              {features.map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input 
                    {...register(`features.${index}` as any)}
                    className="flex-grow border-b border-slate-200 py-2 focus:outline-none focus:border-gold text-sm transition-colors"
                    placeholder="e.g. 24/7 Security"
                  />
                  <button 
                    type="button"
                    onClick={() => removeField('features', index)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => addField('features')}
                className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-navy transition-colors flex items-center"
              >
                <Plus size={14} className="mr-1" /> Add Feature
              </button>
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
                <span>{id ? 'Update Project' : 'Publish Project'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
