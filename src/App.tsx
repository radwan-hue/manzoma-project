import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  User,
  Briefcase,
  GraduationCap,
  Send,
  Search,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Building2,
  Menu,
  X,
  Lock,
  LayoutDashboard,
  Filter,
  MessageSquare,
  LogOut,
  Download,
  Upload,
  Database,
  Eye,
  EyeOff,
  History,
  BarChart3,
  Calendar,
  Printer,
  PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

// Mock Data & Storage Key
export const REBASE_URL = 'https://rig-system-af597-default-rtdb.firebaseio.com';
const STORAGE_KEY = 'hirstr_complaints';
const SETTINGS_KEY = 'hirstr_settings';
const ADMIN_KEY = 'hirstr_admin_creds';
const DEFAULT_ADMIN = { email: 'admin@histr.edu.ly', password: 'admin123' };

// --- قسم الأصول الثابتة (روابط الصور الثلاثة الدائمة) ---
const ASSETS = {
  INSTITUTE_LOGO: 'https://i.ibb.co/gZbMxMdy/image.png',
  HERO_WELCOME_BG: 'https://i.ibb.co/prd75DYs/Whats-App-Image-2026-04-24-at-3-16-50-PM.jpg',
  INSTITUTE_BUILDING: 'https://i.ibb.co/gZXb0Bkm/Whats-App-Image-2026-04-24-at-2-21-40-PM.png'
};

const DEFAULT_SETTINGS = {
  instituteName: 'المعهد العالي للعلوم والتقنية',
  subTitle: 'رقدالين - منظومة الشكاوي',
  logoUrl: ASSETS.INSTITUTE_LOGO,
  heroBgImageUrl: ASSETS.HERO_WELCOME_BG,
  officeImageUrl: ASSETS.INSTITUTE_BUILDING,
  heroTitle: 'صوتكم مسموع، وخدمتكم غايتنا',
  heroDesc: 'نلتزم في المعهد العالي للعلوم والتقنية رقدالين بتوفير بيئة تعليمية وإدارية متميزة. استخدم هذه المنظومة لتقديم شكواك أو ملاحظاتك بكل سهولة وشفافية.',
  contactEmail: 'histr@histr.edu.ly',
  contactPhone: '021-XXX-XXXX',
  contactAddress: 'رقدالين، ليبيا - مبنى الإدارة العامة، الطابق الأول',
  firebaseUrl: '',
  projectStudents: 'تيسير محمد ترحبات، صفاء رجب قريبع، ميسم مسعود اونيس، مروى رجب قريبع، يقين نورالدين ترحبات',
  projectSupervisor: 'أ. مولود رمضان محمد قريبع',
  projectSemester: 'فصل الربيع 2026'
};

// Types
interface Settings {
  instituteName: string;
  subTitle: string;
  logoUrl: string;
  heroBgImageUrl: string;
  heroTitle: string;
  heroDesc: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  officeImageUrl: string;
  firebaseUrl: string;
  projectStudents: string; // أسماء الطلبة
  projectSupervisor: string; // الأستاذ المشرف
  projectSemester: string; // الفصل الدراسي
}

interface Complaint {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  userType: 'student' | 'staff' | 'faculty';
  category: string;
  subject: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  adminReply?: string;
  attachments: string[]; // المرفقات المتعددة
}

// Components
const Navbar = ({ onAdminClick, isAdmin, onLogout, settings, onProjectClick }: { onAdminClick: () => void, isAdmin: boolean, onLogout: () => void, settings: Settings, onProjectClick: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const OFFICIAL_LOGO = 'https://storage.googleapis.com/static.arena.ai/canvas/67c336e4f323a60216b5a3f2/input_file_0.png';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <img
                src={settings.logoUrl || OFFICIAL_LOGO}
                alt="Logo"
                className="max-w-full max-h-full object-contain"
                onError={(e: any) => e.target.src = OFFICIAL_LOGO}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{settings.instituteName}</h1>
              <p className="text-sm text-blue-600 font-medium">{settings.subTitle}</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-8 space-x-reverse">
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">الرئيسية</a>
            {!isAdmin && (
              <>
                <a href="#submit" className="text-gray-700 hover:text-blue-600 font-medium">تقديم شكوى</a>
                <a href="#track" className="text-gray-700 hover:text-blue-600 font-medium">متابعة حالة</a>
                <button onClick={onProjectClick} className="text-blue-600 hover:text-blue-800 font-bold border-r pr-8">عن المشروع</button>
              </>
            )}
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">اتصل بنا</a>

            {isAdmin ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors"
              >
                <LogOut size={18} /> خروج
              </button>
            ) : (
              <button
                onClick={onAdminClick}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                <Lock size={18} /> دخول الإدارة
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <a href="#" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md">الرئيسية</a>
              {!isAdmin && (
                <>
                  <a href="#submit" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md">تقديم شكوى</a>
                  <a href="#track" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md">متابعة حالة</a>
                  <button onClick={() => { onProjectClick(); setIsOpen(false); }} className="w-full text-right block px-3 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-md">عن المشروع</button>
                </>
              )}
              <a href="#contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md">اتصل بنا</a>

              <div className="pt-4 mt-4 border-t border-gray-100">
                {isAdmin ? (
                  <button
                    onClick={() => { onLogout(); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg font-bold hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={20} /> تسجيل الخروج
                  </button>
                ) : (
                  <button
                    onClick={() => { onAdminClick(); setIsOpen(false); }}
                    className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                  >
                    <Lock size={20} /> دخول الإدارة
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ settings }: { settings: Settings }) => (
  <section
    className="relative bg-blue-600 py-28 overflow-hidden bg-cover bg-center transition-all duration-700"
    style={{ backgroundImage: settings.heroBgImageUrl ? `url(${settings.heroBgImageUrl})` : 'none' }}
  >
    {/* Overlay if image exists */}
    {settings.heroBgImageUrl && <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-[2px]"></div>}

    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg"
      >
        {settings.heroTitle}
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl lg:text-2xl text-blue-50 mb-10 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md"
      >
        {settings.heroDesc}
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mt-12"
      >
        <a href="#submit" className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:scale-105">تقديم شكوى جديدة</a>
        <a href="#track" className="bg-blue-700/50 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-xl hover:scale-105">متابعة شكوى سابقة</a>
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    { icon: <ShieldCheck className="text-blue-600" />, title: "خصوصية تامة", desc: "تُعامل جميع الشكاوي بسرية تامة واحترافية عالية." },
    { icon: <Clock className="text-blue-600" />, title: "سرعة الاستجابة", desc: "فريق متخصص يعمل على معالجة طلباتكم في أسرع وقت ممكن." },
    { icon: <Mail className="text-blue-600" />, title: "إشعارات فورية", desc: "ستصلك رسالة تأكيد ومتابعة على بريدك الإلكتروني مباشرة." }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ComplaintForm = ({ onNewComplaint }: { onNewComplaint: (data: any) => Promise<string> }) => {
  const [userType, setUserType] = useState<'student' | 'staff' | 'faculty'>('student');
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (attachments.length >= 3) {
        toast.error('أقصى عدد للمرفقات هو 3 ملفات');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.6);
          setAttachments(prev => [...prev, base64]);
        };
        // For non-image files, we could handle them differently, but for now we assume images
        if (!file.type.startsWith('image/')) {
          setAttachments(prev => [...prev, event.target?.result as string]);
        }
      };
    });
  };

  const onSubmit = async (data: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const generatedId = await onNewComplaint({ ...data, userType, attachments });
      
      // Validate that ID was generated successfully
      if (!generatedId || generatedId.trim() === '') {
        toast.error('فشل توليد رقم المرجعية. يرجى المحاولة مرة أخرى.');
        return;
      }
      
      setRefNumber(generatedId);
      setSubmitted(true);
      
      // Log for debugging
      console.log('Complaint submitted successfully with ID:', generatedId);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('حدث خطأ أثناء إرسال الشكوى. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    reset();
  };

  if (submitted) {
    return (
      <div id="submit" className="py-20 max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-2xl shadow-xl border-t-8 border-green-500 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">تم إرسال شكواك بنجاح!</h2>
          <p className="text-gray-600 mb-6 text-lg">
            لقد استلمنا طلبك، وتم إرسال رسالة تأكيد تحتوي على رقم المرجعية وتفاصيل الشكوى إلى بريدك الإلكتروني.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <p className="text-sm text-gray-500 mb-1">رقم المرجعية الخاص بك:</p>
            {refNumber ? (
              <p className="text-2xl font-mono font-bold text-blue-600 tracking-wider">{refNumber}</p>
            ) : (
              <p className="text-sm text-red-600">⚠️ لم يتم توليد رقم المرجعية. يرجى التحقق من البريد الإلكتروني أو الاتصال بنا.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Mail size={18} /> تحميل نسخة من الشكوى (PDF)
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            >
              تقديم شكوى أخرى
            </button>
          </div>
          <p className="text-sm text-gray-400">
            ملاحظة: تم إرسال كافة التفاصيل إلى بريدك الإلكتروني. يرجى مراجعة صندوق الوارد (أو مجلد الرسائل غير المرغوب فيها).
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <section id="submit" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">نموذج تقديم شكوى</h2>
          <p className="text-gray-600">يرجى ملء البيانات التالية بدقة لضمان معالجة الشكوى بشكل صحيح.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { id: 'student', label: 'طالب', icon: <GraduationCap size={20} /> },
            { id: 'staff', label: 'موظف', icon: <Briefcase size={20} /> },
            { id: 'faculty', label: 'عضو هيئة تدريس', icon: <User size={20} /> }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setUserType(type.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all ${userType === type.id
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-500 hover:border-blue-200'
                }`}
            >
              {type.icon}
              <span className="font-bold">{type.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الاسم بالكامل</label>
              <input
                {...register('name', { required: 'الاسم مطلوب' })}
                type="text"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="أدخل اسمك الرباعي"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                {...register('email', {
                  required: 'البريد الإلكتروني مطلوب',
                  pattern: { value: /^\S+@\S+$/i, message: 'بريد إلكتروني غير صالح' }
                })}
                type="email"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="example@institute.edu.ly"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
              <input
                {...register('phone', { required: 'رقم الهاتف مطلوب' })}
                type="tel"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="09XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {userType === 'student' ? 'الرقم الدراسي' : 'الرقم الوظيفي'}
              </label>
              <input
                {...register('idNumber', { required: 'هذا الحقل مطلوب' })}
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={userType === 'student' ? 'أدخل رقمك الدراسي' : 'أدخل رقمك الوظيفي'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">نوع الشكوى / القسم</label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="administrative">إدارية</option>
              <option value="academic">أكاديمية / تعليمية</option>
              <option value="facilities">مرافق وخدمات</option>
              <option value="technical">تقنية / منظومات</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">موضوع الشكوى</label>
            <input
              {...register('subject', { required: 'الموضوع مطلوب' })}
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="عنوان مختصر للشكوى"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">وصف تفصيلي للشكوى</label>
            <textarea
              {...register('description', { required: 'الوصف مطلوب' })}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="يرجى كتابة كافة التفاصيل المتعلقة بالشكوى هنا..."
            ></textarea>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Upload size={16} className="text-blue-600" /> إرفاق صور أو وثائق (يمكن اختيار أكثر من ملف)
            </label>
            <div className="flex flex-col gap-4">
              <label className="w-full sm:w-auto px-6 py-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-100 transition-colors text-center">
                <span>+ إضافة ملفات من الجهاز</span>
                <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {attachments.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {attachments.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-50">
                      <img src={img} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">يمكنك إرفاق حتى 3 صور أو وثائق توضيحية لشكواك.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>إرسال الشكوى وتفعيل التنبيهات</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400">
            بمجرد الإرسال، سيتم توليد رقم مرجعي وإرساله لبريدك الإلكتروني لمتابعة حالة الطلب.
          </p>
        </form>
      </div>
    </section>
  );
};

const StatusTracker = ({ complaints }: { complaints: Complaint[] }) => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setLoading(true);
    setError('');

    // 1. البحث في الجهاز أولاً
    const foundLocal = complaints.find(c => c.id.toLowerCase() === searchId.toLowerCase());

    if (foundLocal) {
      setResult(foundLocal);
      setLoading(false);
      return;
    }

    // 2. إذا لم توجد، نبحث في السحاب (لربط الأجهزة ببعضها)
    const url = 'https://rig-system-af597-default-rtdb.firebaseio.com/';
    try {
      const res = await fetch(`${url}complaints.json`);
      const data = await res.json();
      if (data) {
        const cloudComplaints: Complaint[] = Object.values(data);
        const foundCloud = cloudComplaints.find(c => c.id.toLowerCase() === searchId.toLowerCase());
        if (foundCloud) {
          setResult(foundCloud);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Cloud search failed");
    }

    setError('عذراً، لم يتم العثور على شكوى بهذا الرقم المرجعي في النظام.');
    setResult(null);
    setLoading(false);
  };

  return (
  <section id="track" className="py-20 bg-blue-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-blue-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">تتبع حالة شكوى</h2>
          <p className="text-gray-600">أدخل رقم المرجعية الذي وصلك عبر البريد لمتابعة آخر المستجدات.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pr-12 pl-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="أدخل رقم المرجعية (مثال: RIG-2026-00001)"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            بحث
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <AnimatePresence>
          {error && <div className="text-red-500 text-center py-4">{error}</div>}
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-2xl p-6 bg-gray-50"
            >
              <div className="flex flex-wrap justify-between items-center mb-6 pb-6 border-b border-gray-200 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">رقم الشكوى</p>
                  <p className="text-lg font-bold">{result.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${result.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      result.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {result.status === 'resolved' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    {result.status === 'resolved' ? 'تامة' : result.status === 'in-progress' ? 'تحت الإنجاز' : 'معلقة'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div className="w-0.5 h-full bg-green-500 my-1"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">تم استلام الشكوى</p>
                    <p className="text-sm text-gray-500">{new Date(result.createdAt).toLocaleString('ar-LY')}</p>
                  </div>
                </div>

                <div className={`flex gap-4 ${result.status === 'pending' ? 'opacity-30' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${result.status !== 'pending' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">جاري المعالجة</p>
                    <p className="text-sm text-gray-600">يتم مراجعة الشكوى من قبل القسم المختص</p>
                  </div>
                </div>

                <div className={`flex gap-4 ${result.status !== 'resolved' ? 'opacity-30' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${result.status === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">تم الإنجاز</p>
                    <p className="text-sm text-gray-600">تمت معالجة الشكوى وإغلاق الملف</p>
                  </div>
                </div>
              </div>

              {result.attachments && result.attachments.length > 0 && (
                <div className="mt-8 p-4 border rounded-xl bg-gray-50">
                  <p className="text-[10px] font-bold text-gray-400 mb-2 font-mono">المرفقات التي قمت برفعها ({result.attachments.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {result.attachments.map((img, i) => (
                      <img key={i} src={img} className="w-24 h-24 object-cover rounded-lg border shadow-sm" />
                    ))}
                  </div>
                </div>
              )}

              {result.adminReply && (
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1">
                    <MessageSquare size={14} /> رد الإدارة:
                  </p>
                  <p className="text-gray-700 text-sm italic">{result.adminReply}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </section>
  );
};

const Contact = ({ settings }: { settings: Settings }) => (
  <section id="contact" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">تواصل مع مكتب الشكاوي</h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            إذا كان لديك استفسار عاجل أو تحتاج إلى مساعدة تقنية في استخدام المنظومة، يمكنك التواصل معنا مباشرة عبر القنوات التالية.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">الهاتف المباشر</p>
                <p className="font-bold text-lg dir-ltr text-right">{settings.contactPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">البريد الإلكتروني للإدارة</p>
                <p className="font-bold text-lg">{settings.contactEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">الموقع</p>
                <p className="font-bold text-lg">{settings.contactAddress}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-600 rounded-3xl p-1 overflow-hidden shadow-2xl">
          <img
            key={settings.officeImageUrl}
            src={settings.officeImageUrl}
            alt="Office"
            className="w-full h-96 object-cover rounded-3xl opacity-100"
          />
        </div>
      </div>
    </div>
  </section>
);

const AdminLogin = ({ onLogin, onCancel, adminCreds }: { onLogin: (data: any) => void, onCancel: () => void, adminCreds: any }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [lastEmail] = useState(localStorage.getItem('hirstr_last_admin_email') || '');

  const onSubmit = (data: any) => {
    if (data.email === adminCreds.email && data.password === adminCreds.password) {
      localStorage.setItem('hirstr_last_admin_email', data.email);
      onLogin(data);
    } else {
      setError('خطأ في البريد الإلكتروني أو كلمة المرور');
    }
  };

  const handleUseLastEmail = () => {
    if (lastEmail) {
      setValue('email', lastEmail);
      toast.success('تمت استعادة البريد المسجل مسبقاً', { style: { fontFamily: 'Tajawal', fontSize: '12px' } });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-y-auto max-h-[95vh] text-right border border-blue-50"
      >
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <Lock size={48} className="mx-auto mb-3 drop-shadow-lg" />
          <h2 className="text-3xl font-black mb-1">دخول الإدارة</h2>
          <p className="text-blue-100 text-base font-medium opacity-90">يرجى إدخال بيانات الاعتماد للوصول للصندوق</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium">{error}</div>}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700">البريد الإلكتروني</label>
              {lastEmail && (
                <button
                  type="button"
                  onClick={handleUseLastEmail}
                  className="text-blue-600 flex items-center gap-1 text-xs font-bold hover:underline"
                  title="استعادة آخر بريد تم استخدامه"
                >
                  <History size={12} /> استعادة البريد
                </button>
              )}
            </div>
            <input
              {...register('email', { required: true })}
              type="email"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-left"
              placeholder="admin@histr.edu.ly"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700">كلمة المرور</label>
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <input
              {...register('password', { required: true })}
              type={showPass ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-left"
              placeholder="••••••••"
            />
          </div>
          <div className="pt-2 flex gap-3">
            <button type="submit" className="flex-grow bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">دخول</button>
            <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-200">إلغاء</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ChangePasswordModal = ({ onSave, onCancel }: { onSave: (newPass: string) => void, onCancel: () => void }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data: any) => onSave(data.newPassword);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4 text-right">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Lock className="text-blue-600" /> تغيير كلمة المرور</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">كلمة المرور الجديدة</label>
            <input
              {...register('newPassword', { required: 'مطلوب', minLength: { value: 6, message: '6 أحرف على الأقل' } })}
              type="password" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">تأكيد كلمة المرور</label>
            <input
              {...register('confirmPassword', {
                validate: (val) => val === watch('newPassword') || 'كلمات المرور غير متطابقة'
              })}
              type="password" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-grow bg-blue-600 text-white py-2 rounded-lg font-bold">حفظ</button>
            <button type="button" onClick={onCancel} className="bg-gray-100 px-6 py-2 rounded-lg">إلغاء</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ProjectInfoModal = ({ settings, onCancel }: { settings: Settings, onCancel: () => void }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4 text-right overflow-y-auto">
    <motion.div
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative overflow-hidden border border-blue-50"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
      <button onClick={onCancel} className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full"><X size={20} /></button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600">
          <GraduationCap size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-900">مشروع التخرج</h2>
        <p className="text-blue-600 font-bold text-sm">منظومة متابعة الشكاوي الإلكترونية</p>
      </div>

      <div className="space-y-5">
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 border-r-4 border-r-blue-600">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">الجهة التعليمية:</p>
          <p className="text-lg font-black text-gray-800">{settings.instituteName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <p className="text-[10px] font-bold text-indigo-500 mb-1 flex items-center gap-1"><User size={12} /> المشرف:</p>
              <p className="text-base font-bold text-gray-700">{settings.projectSupervisor}</p>
            </div>
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <p className="text-[10px] font-bold text-purple-500 mb-1 flex items-center gap-1"><Clock size={12} /> الفصل:</p>
              <p className="text-base font-bold text-gray-700">{settings.projectSemester}</p>
            </div>
          </div>

          <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-100">
            <p className="text-[10px] font-bold text-blue-600 mb-4 border-b border-blue-100 pb-2 flex items-center gap-1"><User size={12} /> الطلبة المنفذون:</p>
            <div className="space-y-2">
              {settings.projectStudents.split(/[,،]/).map((name, i) => (
                <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-50 text-sm font-bold text-gray-700">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center text-[10px]">{i + 1}</span>
                  {name.trim()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onCancel}
        className="w-full mt-8 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
      >
        إغلاق
      </button>
    </motion.div>
  </div>
);

const SettingsModal = ({ settings, onSave, onCancel, onReset }: { settings: Settings, onSave: (newSettings: Settings) => void, onCancel: () => void, onReset: () => void }) => {
  const [previewOffice, setPreviewOffice] = useState(settings.officeImageUrl);
  const [previewLogo, setPreviewLogo] = useState(settings.logoUrl);
  const [previewHeroBg, setPreviewHeroBg] = useState(settings.heroBgImageUrl);
  const { register, handleSubmit, setValue } = useForm({ defaultValues: settings });

  const compressImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        callback(dataUrl);
      };
    };
  };

  const handleOfficeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (base64) => {
        setPreviewOffice(base64);
        setValue('officeImageUrl', base64);
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (base64) => {
        setPreviewLogo(base64);
        setValue('logoUrl', base64);
      });
    }
  };

  const handleHeroBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (base64) => {
        setPreviewHeroBg(base64);
        setValue('heroBgImageUrl', base64);
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex items-start justify-center p-0 md:p-4 text-right overflow-y-auto pt-4 md:pt-10">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-t-3xl md:rounded-2xl p-6 md:p-10 max-w-5xl w-full shadow-2xl mb-0 md:mb-10"
      >
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <h3 className="text-3xl font-extrabold flex items-center gap-3 text-gray-900">
            <LayoutDashboard size={32} className="text-blue-600" /> إعدادات المنظومة الشاملة
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-2"><X size={32} /></button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-700">اسم المعهد العالي</label>
              <input {...register('instituteName')} className="w-full px-5 py-3 text-lg border-2 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-700">العنوان الفرعي (يظهر تحت الاسم)</label>
              <input {...register('subTitle')} className="w-full px-5 py-3 text-lg border-2 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-base font-bold text-gray-700">عنوان الترحيب الرئيسي</label>
            <input {...register('heroTitle')} className="w-full px-5 py-3 text-lg border-2 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-bold text-gray-700">وصف المعهد والخدمة</label>
            <textarea {...register('heroDesc')} rows={4} className="w-full px-5 py-3 text-lg border-2 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-700">البريد الإلكتروني للإدارة</label>
              <input {...register('contactEmail')} className="w-full px-5 py-3 text-lg border-2 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-left" />
            </div>
            <div className="space-y-2">
              <label className="block text-base font-bold text-gray-700">رقم الهاتف للتواصل</label>
              <input {...register('contactPhone')} className="w-full px-5 py-3 text-lg border-2 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-left" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-base font-bold text-gray-700">عنوان المقر الإداري</label>
              <input {...register('contactAddress')} className="w-full px-5 py-3 text-lg border-2 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
            </div>
            <div className="md:col-span-2 space-y-2 pt-4 border-t border-gray-200">
              <label className="block text-base font-bold text-blue-700 flex items-center gap-2">
                <Database size={20} /> رابط الربط السحابي (Firebase URL)
              </label>
              <input
                {...register('firebaseUrl')}
                defaultValue="https://rig-system-af597-default-rtdb.firebaseio.com"
                className="w-full px-5 py-3 text-lg border-2 border-blue-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-left bg-blue-50/30"
              />
            </div>

            <div className="md:col-span-2 space-y-6 pt-6 border-t border-gray-200">
              <h4 className="font-black text-xl text-gray-900 border-r-4 border-indigo-600 pr-3">بيانات مشروع التخرج:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">أسماء الطلبة (افصل بينهم بفاصلة ،)</label>
                  <input {...register('projectStudents')} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">الأستاذ المشرف</label>
                  <input {...register('projectSupervisor')} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">الفصل الدراسي</label>
                  <input {...register('projectSemester')} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-12">
            <div className="bg-blue-50/50 p-6 md:p-8 rounded-3xl border-2 border-blue-100">
              <h4 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2 border-r-4 border-blue-600 pr-3">تخصيص الصور والهوية البصرية</h4>

              <div className="grid gap-12">
                {/* Logo Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-40 h-40 bg-white rounded-2xl overflow-hidden border-2 border-blue-200 flex items-center justify-center shadow-inner">
                    {previewLogo ? (
                      <img src={previewLogo} className="w-full h-full object-contain p-4" />
                    ) : (
                      <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"><Building2 size={32} /></div>
                    )}
                  </div>
                  <div className="flex-grow w-full space-y-4">
                    <p className="font-bold text-blue-900 text-lg">شعار المعهد المعتمد</p>
                    <p className="text-sm text-gray-500">يظهر الشعار في شريط التنقل العلوي وفي أسفل الصفحة.</p>
                    <label className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold cursor-pointer hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
                      <Upload size={22} />
                      <span>اختيار الشعار من الاستوديو</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Hero BG Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-64 h-40 bg-white rounded-2xl overflow-hidden border-2 border-blue-200 relative shadow-inner">
                    {previewHeroBg ? (
                      <img src={previewHeroBg} className="w-full h-full object-cover" />
                    ) : (
                      <div className="bg-blue-600 w-full h-full flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest text-center px-4 line-clamp-2">الخلفية الزرقاء<br />الافتراضية</div>
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="bg-white/90 text-blue-900 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">معاينة الواجهة</span>
                    </div>
                  </div>
                  <div className="flex-grow w-full space-y-4">
                    <p className="font-bold text-blue-900 text-lg">خلفية الترحيب الرئيسية</p>
                    <p className="text-sm text-gray-500">الصورة التي تظهر خلف جملة "صوتكم مسموع" في أعلى الصفحة.</p>
                    <label className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold cursor-pointer hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
                      <Upload size={22} />
                      <span>تغيير خلفية الواجهة</span>
                      <input type="file" accept="image/*" onChange={handleHeroBgUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Office Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-64 h-40 bg-white rounded-2xl overflow-hidden border-2 border-blue-200 shadow-inner">
                    {previewOffice ? (
                      <img src={previewOffice} className="w-full h-full object-cover" />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-400 font-bold">لا توجد صورة</div>
                    )}
                  </div>
                  <div className="flex-grow w-full space-y-4">
                    <p className="font-bold text-blue-900 text-lg">صورة مبنى المعهد</p>
                    <p className="text-sm text-gray-500">الصورة الكبيرة التي تظهر في قسم "اتصل بنا" في نهاية الصفحة.</p>
                    <label className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold cursor-pointer hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
                      <Upload size={22} />
                      <span>اختيار صورة المبنى</span>
                      <input type="file" accept="image/*" onChange={handleOfficeUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-center text-gray-400 italic">ملاحظة: المنظومة تقوم بضغط الصور تلقائياً لضمان بقائها محفوظة في الذاكرة وسرعة تصفح الطلاب للموقع.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-8 border-t-2">
            <button type="submit" className="flex-grow bg-green-600 text-white py-5 rounded-2xl text-xl font-extrabold hover:bg-green-700 transition-all shadow-xl hover:shadow-green-200 active:scale-95 order-1">
              حفظ كافة التغييرات وتحديث الموقع
            </button>
            <button type="button" onClick={onReset} className="bg-red-50 text-red-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-red-100 transition-colors order-2">
              إعادة ضبط المصنع
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-200 transition-colors order-3">
              إغلاق
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminDashboard = ({
  complaints = [],
  onUpdateStatus,
  onChangePassword,
  onExport,
  onImport,
  settings,
  onUpdateSettings,
  onResetSettings,
  onSync
}: {
  complaints: Complaint[],
  onUpdateStatus: (id: string, status: any, reply?: string) => void,
  onChangePassword: (newPass: string) => void,
  onExport: () => void,
  onImport: (file: File) => void,
  settings: Settings,
  onUpdateSettings: (s: Settings) => void,
  onResetSettings: () => void,
  onSync: () => Promise<any>
}) => {
  const [filter, setFilter] = useState('all');
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [showPassModal, setShowPassModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportStatus, setReportStatus] = useState('all');

  const filtered = (complaints || []).filter(c => filter === 'all' || c.status === filter);

  const reportData = (complaints || []).filter(c => {
    try {
      if (!c.createdAt) return false;
      const complaintDate = new Date(c.createdAt).toISOString().split('T')[0];
      const matchStatus = reportStatus === 'all' || c.status === reportStatus;
      const matchStart = !startDate || complaintDate >= startDate;
      const matchEnd = !endDate || complaintDate <= endDate;
      return matchStatus && matchStart && matchEnd;
    } catch (e) { return false; }
  });

  const stats = {
    total: reportData.length,
    resolved: reportData.filter(c => c.status === 'resolved').length,
    inProgress: reportData.filter(c => c.status === 'in-progress').length,
    pending: reportData.filter(c => c.status === 'pending').length
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'resolved': return { label: 'تامة', color: 'bg-green-100 text-green-700' };
      case 'in-progress': return { label: 'تحت الإنجاز', color: 'bg-blue-100 text-blue-700' };
      default: return { label: 'معلقة', color: 'bg-yellow-100 text-yellow-700' };
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'student': return 'طالب';
      case 'staff': return 'موظف';
      case 'faculty': return 'هيئة تدريس';
      default: return type;
    }
  };

  const handleReplyChange = (id: string, val: string) => {
    setReplies(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="text-blue-600" /> صندوق الشكاوي
          </h2>
          <p className="text-gray-500">مرحباً بك في لوحة تحكم الإدارة. يمكنك متابعة وتحديث حالة الشكاوي من هنا.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowReports(!showReports)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${showReports ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border border-gray-200 text-indigo-600 hover:bg-indigo-50'}`}
          >
            <BarChart3 size={16} /> التقارير والإحصائيات
          </button>

          <button
            onClick={() => {
              toast.promise(onSync(), {
                loading: 'جاري جلب البيانات من السحاب...',
                success: 'تم تحديث البيانات بنجاح',
                error: 'تأكد من إعدادات الرابط السحابي'
              });
            }}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <Database size={16} /> تحديث من السحاب
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <LayoutDashboard size={16} /> تعديل المنظومة
          </button>

          <div className="flex bg-white rounded-xl border border-gray-200 p-1">
            <button
              onClick={onExport}
              title="تصدير نسخة احتياطية للجهاز"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 text-blue-600 transition-colors"
            >
              <Download size={16} /> تصدير (نسخ)
            </button>
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer border-r ml-1 rounded-md shadow-sm">
              <Upload size={16} /> استيراد (استعادة)
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <button
            onClick={() => setShowPassModal(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            <Lock size={16} className="text-blue-600" /> تغيير كلمة المرور
          </button>

          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="outline-none bg-transparent font-medium"
            >
              <option value="all">الكل</option>
              <option value="pending">معلقة</option>
              <option value="in-progress">تحت الإنجاز</option>
              <option value="resolved">تامة</option>
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReports && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                    <PieChart className="text-indigo-600" /> إحصائيات وتقارير الشكاوي
                  </h3>
                  <p className="text-indigo-600/70 text-sm">فلترة الشكاوي حسب الفترة الزمنية والحالة لاستخراج التقارير</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <Printer size={18} /> طباعة التقرير
                </button>
              </div>

              {/* Print Header (Only visible when printing) */}
              <div className="hidden print:flex flex-col items-center gap-4 mb-10 border-b-2 border-indigo-100 pb-8 text-center">
                <div className="w-24 h-24 flex items-center justify-center mb-2 mx-auto">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center text-white"><Building2 size={32} /></div>
                  )}
                </div>
                <h1 className="text-2xl font-black text-gray-900">{settings.instituteName}</h1>
                <p className="text-lg font-bold text-blue-700 mt-1">منظومة متابعة الشكاوي - تقرير إحصائي</p>
                <div className="flex gap-4 justify-center mt-4 text-sm text-gray-500 font-bold">
                  <span>تاريخ التقرير: {new Date().toLocaleDateString('ar-LY')}</span>
                  {startDate && <span>من: {startDate}</span>}
                  {endDate && <span>إلى: {endDate}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 print:hidden">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-indigo-900 mr-2">من تاريخ:</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-indigo-900 mr-2">إلى تاريخ:</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-indigo-900 mr-2">حالة الشكوى:</label>
                  <select
                    value={reportStatus}
                    onChange={(e) => setReportStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold"
                  >
                    <option value="all">الكل</option>
                    <option value="pending">معلقة</option>
                    <option value="in-progress">تحت الإنجاز</option>
                    <option value="resolved">تامة</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => { setStartDate(''); setEndDate(''); setReportStatus('all'); }}
                    className="w-full py-2 text-indigo-600 font-bold hover:underline"
                  >
                    إعادة تعيين الفلاتر
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-indigo-100 text-center shadow-sm">
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase">إجمالي الشكاوي</p>
                  <p className="text-3xl font-black text-indigo-900">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-indigo-100 text-center shadow-sm">
                  <p className="text-xs text-green-500 font-bold mb-1 uppercase">شكاوي تامة</p>
                  <p className="text-3xl font-black text-green-600">{stats.resolved}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-indigo-100 text-center shadow-sm">
                  <p className="text-xs text-blue-500 font-bold mb-1 uppercase">تحت الإنجاز</p>
                  <p className="text-3xl font-black text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-indigo-100 text-center shadow-sm">
                  <p className="text-xs text-yellow-600 font-bold mb-1 uppercase">شكاوي معلقة</p>
                  <p className="text-3xl font-black text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 bg-blue-600 rounded-2xl p-4 text-white flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Database size={24} className="text-blue-200" />
          <div>
            <p className="text-sm font-bold">نظام الحماية: يرجى تحميل نسخة احتياطية من البيانات يومياً.</p>
            <p className="text-xs text-blue-100">
              {localStorage.getItem('hirstr_last_backup')
                ? `آخر نسخة تم تحميلها: ${new Date(localStorage.getItem('hirstr_last_backup')!).toLocaleString('ar-LY')}`
                : 'لم يتم إجراء نسخ احتياطي اليوم بعد.'}
            </p>
          </div>
        </div>
        <button
          onClick={onExport}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg"
        >
          إجراء نسخ احتياطي الآن
        </button>
      </div>

      <AnimatePresence>
        {showPassModal && (
          <ChangePasswordModal
            onSave={(newPass) => { onChangePassword(newPass); setShowPassModal(false); }}
            onCancel={() => setShowPassModal(false)}
          />
        )}
      </AnimatePresence>



      {filtered.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border border-dashed border-gray-300">
          <MessageSquare size={60} className="mx-auto text-gray-200 mb-4" />
          <p className="text-xl text-gray-400">لا توجد شكاوي في هذا التصنيف حالياً</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filtered.map((c) => (
            <motion.div
              layout
              key={c.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-400">{c.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusInfo(c.status).color}`}>
                      {getStatusInfo(c.status).label}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold">
                      {getUserTypeLabel(c.userType)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{c.subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><User size={14} /> {c.name} ({c.idNumber})</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(c.createdAt).toLocaleDateString('ar-LY')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={c.status}
                    onChange={(e) => onUpdateStatus(c.id, e.target.value, replies[c.id])}
                    className="text-xs border-2 border-gray-100 rounded-xl px-3 py-2 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-bold bg-white cursor-pointer"
                  >
                    <option value="pending">معلقة</option>
                    <option value="in-progress">تحت الإنجاز</option>
                    <option value="resolved">تامة</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-gray-50/30">
                <div className="flex flex-col gap-6 mb-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">نص الشكوى:</p>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{c.description}</p>
                  </div>
                  {c.attachments && c.attachments.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-blue-500 mb-2 uppercase tracking-wider">المرفقات المصاحبة ({c.attachments.length}):</p>
                      <div className="flex flex-wrap gap-3">
                        {c.attachments.map((attach, idx) => (
                          <div key={idx} className="border rounded-xl p-1 bg-white shadow-sm w-32 h-32 overflow-hidden">
                            <a href={attach} target="_blank" rel="noreferrer">
                              <img src={attach} className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-zoom-in" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-blue-600 mb-1">الرد الإداري (سيتم إرساله للبريد الإلكتروني):</label>
                  <textarea
                    value={replies[c.id] !== undefined ? replies[c.id] : (c.adminReply || '')}
                    onChange={(e) => handleReplyChange(c.id, e.target.value)}
                    placeholder="اكتب ردك هنا..."
                    className="w-full p-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white min-h-[100px]"
                  />
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-4">
                    <div className="flex flex-wrap gap-6 text-base text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm w-full md:w-auto">
                      <span><span className="font-bold text-gray-900">البريد:</span> {c.email}</span>
                      <span><span className="font-bold text-gray-900">الهاتف:</span> {c.phone}</span>
                    </div>
                    <button
                      onClick={() => onUpdateStatus(c.id, c.status, replies[c.id])}
                      className="w-full md:w-auto bg-indigo-600 text-white px-12 py-5 rounded-2xl text-xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-[0.98]"
                    >
                      <Send size={28} /> حفظ وإرسال الرد للطالب فوراً
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showSettingsModal && (
          <SettingsModal
            settings={settings}
            onSave={(s) => { onUpdateSettings(s); setShowSettingsModal(false); }}
            onCancel={() => setShowSettingsModal(false)}
            onReset={() => { onResetSettings(); setShowSettingsModal(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const Footer = ({ settings }: { settings: Settings }) => {
  const OFFICIAL_LOGO = 'https://storage.googleapis.com/static.arena.ai/canvas/67c336e4f323a60216b5a3f2/input_file_0.png';

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 overflow-hidden rounded-lg bg-white p-1 flex items-center justify-center border shadow-sm">
              <img
                src={settings.logoUrl || OFFICIAL_LOGO}
                alt="Logo"
                className="max-w-full max-h-full object-contain"
                onError={(e: any) => e.target.src = OFFICIAL_LOGO}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">{settings.instituteName}</h3>
              <p className="text-gray-400 text-sm">جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
            </div>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 text-sm">سياسة الخصوصية</a>
            <a href="#" className="hover:text-blue-400 text-sm">شروط الاستخدام</a>
            <a href="#" className="hover:text-blue-400 text-sm">البوابة الإلكترونية</a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          صمم لخدمة الطلاب والموظفين وأعضاء هيئة التدريس
        </div>
      </div>
    </footer>
  );
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // دمج لضمان عدم وجود خصائص مفقودة مع إعطاء أولوية لشعار المعهد الجديد إذا كان الحالي فارغاً
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          logoUrl: parsed.logoUrl || DEFAULT_SETTINGS.logoUrl
        };
      }
    } catch (e) {
      console.error("Settings recovery triggered");
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      const savedComplaints = localStorage.getItem(STORAGE_KEY);
      if (savedComplaints) {
        const parsed = JSON.parse(savedComplaints);
        if (Array.isArray(parsed)) {
          const validated = parsed.map(c => ({
            ...c,
            attachments: Array.isArray(c.attachments) ? c.attachments : (c.attachment ? [c.attachment] : [])
          }));
          setComplaints(validated);
        }
      }
    } catch (e) {
      console.error("Complaints data recovery triggered");
    }
  }, []);
  const [adminCreds, setAdminCreds] = useState(() => {
    const saved = localStorage.getItem(ADMIN_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
  });

  const saveComplaints = (updated: Complaint[]) => {
    setComplaints(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };
  if (settings) { settings.firebaseUrl = 'https://rig-system-af597-default-rtdb.firebaseio.com'; }
  const syncFromCloud = async () => {
    if (!settings.firebaseUrl) return;
    try {
      const url = settings.firebaseUrl.endsWith('/') ? settings.firebaseUrl : settings.firebaseUrl + '/';
      const res = await fetch(`${url}complaints.json`);
      const data = await res.json();
      if (data) {
        // تحويل الكائنات السحابية إلى مصفوفة
        const cloudComplaints: Complaint[] = Object.values(data);

        // جلب الشكاوي الحالية من الذاكرة المحلية
        const savedRaw = localStorage.getItem(STORAGE_KEY);
        const localList: Complaint[] = savedRaw ? JSON.parse(savedRaw) : [];

        const merged = [...localList];
        cloudComplaints.forEach(cc => {
          const index = merged.findIndex(c => c.id === cc.id);
          if (index === -1) {
            merged.push(cc);
          } else {
            // تحديث البيانات المحلية ببيانات السحاب (في حال تغيرت الحالة من جهاز آخر)
            merged[index] = cc;
          }
        });

        merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComplaints(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return true;
      }
    } catch (e) {
      console.error("Cloud sync failed", e);
    }
    return false;
  };

  useEffect(() => {
    if (isAdmin && settings.firebaseUrl) {
      syncFromCloud();
      const interval = setInterval(syncFromCloud, 10000); // تحديث كل 10 ثواني
      return () => clearInterval(interval);
    }
  }, [isAdmin, settings.firebaseUrl]);

  const handleUpdateSettings = (newSettings: Settings) => {
    try {
      setSettings(newSettings);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      toast.success('تم حفظ إعدادات المنظومة بنجاح', { style: { fontFamily: 'Tajawal' } });
    } catch (e) {
      console.error('Save failed', e);
      toast.error('فشل حفظ الإعدادات: قد تكون الصور المرفوعة كبيرة جداً. يرجى اختيار صور أصغر.', {
        style: { fontFamily: 'Tajawal' },
        duration: 5000
      });
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة كافة الإعدادات الافتراضية؟ سيتم حذف الصور والشعار المخصص.')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem(SETTINGS_KEY);
      toast.success('تمت استعادة الإعدادات الافتراضية');
    }
  };

  const handleChangePassword = (newPassword: string) => {
    const updated = { ...adminCreds, password: newPassword };
    setAdminCreds(updated);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(updated));
    toast.success('تم تغيير كلمة المرور بنجاح', { style: { fontFamily: 'Tajawal' } });
  };

  const handleExportData = () => {
    const now = new Date().toISOString();
    const filename = `RIG_Backup_${now.split('T')[0]}.json`;

    try {
      const data = {
        complaints,
        settings,
        exportDate: now
      };

      const jsonString = JSON.stringify(data);
      const blob = new Blob([jsonString], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      localStorage.setItem('hirstr_last_backup', now);
      toast.success('نجح التحميل! تجده الآن في مجلد التنزيلات بجهازك');

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);

      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error("Backup failed", e);
      toast.error('فشل التحميل التلقائي. يرجى التأكد من مساحة الذاكرة.');
    }
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        if (!json.complaints && !json.settings) {
          throw new Error("Invalid format");
        }

        // 1. استعادة الإعدادات والصور أولاً
        if (json.settings) {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(json.settings));
          setSettings(json.settings);
        }

        // 2. استعادة ودمج الشكاوي
        if (json.complaints) {
          const savedRaw = localStorage.getItem(STORAGE_KEY);
          let currentList: Complaint[] = savedRaw ? JSON.parse(savedRaw) : [];

          json.complaints.forEach((importedC: Complaint) => {
            const index = currentList.findIndex(c => c.id === importedC.id);
            if (index !== -1) {
              currentList[index] = importedC;
            } else {
              currentList.push(importedC);
            }
          });

          currentList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
          setComplaints(currentList);
        }

        toast.success('تمت استعادة البيانات بنجاح! جاري تحديث الصفحة...', {
          style: { fontFamily: 'Tajawal', fontWeight: 'bold' },
          duration: 2000
        });

        // 3. تحديث الصفحة إجبارياً لضمان مزامنة كل شيء
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } catch (err) {
        console.error("Import failed", err);
        toast.error('فشل الاستيراد: تأكد من اختيار ملف النسخ الاحتياطي الصحيح.');
      }
    };
    reader.readAsText(file);
  };

  const handleNewComplaint = async (formData: any) => {
    const currentYear = new Date().getFullYear();
    const prefix = `RIG-${currentYear}-`;
    const firebaseUrl = 'https://rig-system-af597-default-rtdb.firebaseio.com/';

    console.log('=== handleNewComplaint START ===');
    console.log('Form Data:', formData);
    console.log('Current Year:', currentYear, 'Prefix:', prefix);

    try {
      // 1. Fetch all complaints from the database
      console.log('📡 Attempting to fetch complaints from Firebase...');
      console.log('Fetch URL:', `${firebaseUrl}complaints.json`);
      
      const response = await fetch(`${firebaseUrl}complaints.json`);
      console.log('📊 Firebase Response Status:', response.status, response.statusText);
      
      let allComplaints: Complaint[] = [];
      
      if (response.ok) {
        const cloudData = await response.json();
        console.log('☁️ Cloud Data Retrieved:', cloudData);
        if (cloudData) {
          allComplaints = Object.values(cloudData);
          console.log('☁️ Parsed Cloud Complaints Count:', allComplaints.length);
        }
      } else {
        console.warn('⚠️ Firebase Response not OK. Status:', response.status);
        console.warn('⚠️ This might indicate Firebase Rules are blocking reads');
        const errorText = await response.text();
        console.error('⚠️ Firebase Error Response:', errorText);
      }

      // 2. Merge with local complaints to get complete list
      console.log('💾 Local Complaints Count:', complaints.length);
      
      const localComplaints = complaints || [];
      const allExistingIds = new Set<string>();
      const allComplaintsList: Complaint[] = [];
      
      [...allComplaints, ...localComplaints].forEach((c, index) => {
        // 🛡️ Safety check: Ensure complaint object and ID exist
        if (!c) {
          console.warn('⚠️ SAFETY CHECK: Null/undefined complaint at index:', index);
          return;
        }

        if (!c.id) {
          console.warn('⚠️ SAFETY CHECK: Complaint at index', index, 'has no ID:', c);
          return;
        }

        if (typeof c.id !== 'string') {
          console.warn('⚠️ SAFETY CHECK: Complaint ID is not a string at index', index, '- Type:', typeof c.id);
          return;
        }

        if (!allExistingIds.has(c.id)) {
          allExistingIds.add(c.id);
          allComplaintsList.push(c);
        }
      });

      console.log('🔗 Total Unique Complaints After Merge:', allComplaintsList.length);
      console.log('📋 All Existing IDs:', Array.from(allExistingIds));

      // 3. Extract sequence numbers from IDs matching the current year
      console.log('🔍 Extracting sequence numbers for prefix:', prefix);
      
      const sequenceNumbers: number[] = allComplaintsList
        .map(c => {
          // 🛡️ Safety check: Ensure ID exists before calling .match()
          if (!c || !c.id) {
            console.warn('⚠️ SAFETY CHECK: Complaint object missing ID or is invalid:', c);
            return 0;
          }

          // Validate ID is a string
          if (typeof c.id !== 'string') {
            console.warn('⚠️ SAFETY CHECK: ID is not a string, type:', typeof c.id, 'Value:', c.id);
            return 0;
          }

          const pattern = new RegExp(`^${prefix}(\\d+)$`);
          const match = c.id.match(pattern);
          const seq = match ? parseInt(match[1], 10) : 0;
          if (seq > 0) {
            console.log(`  ✓ ID: ${c.id} → Sequence: ${seq}`);
          } else if (c.id) {
            console.log(`  ⊘ ID: ${c.id} → Does not match prefix (skipped)`);
          }
          return seq;
        })
        .filter(num => num > 0);

      console.log('📊 Extracted Sequence Numbers:', sequenceNumbers);

      // 4. Find the maximum sequence number and increment
      const maxSeq = sequenceNumbers.length > 0 ? Math.max(...sequenceNumbers) : 0;
      const nextSeq = maxSeq + 1;

      console.log('📈 Max Sequence:', maxSeq, '→ Next Sequence:', nextSeq);

      const generatedId = `${prefix}${nextSeq.toString().padStart(5, '0')}`;
      console.log('✅ Generated ID:', generatedId);

      const newComplaint: Complaint = {
        ...formData,
        id: generatedId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      console.log('📝 New Complaint Object:', newComplaint);

      // Validate complaint data
      if (!newComplaint.name || !newComplaint.email || !newComplaint.phone) {
        console.error('❌ VALIDATION ERROR: Missing required fields');
        console.error('  - name:', newComplaint.name);
        console.error('  - email:', newComplaint.email);
        console.error('  - phone:', newComplaint.phone);
        toast.error('خطأ: بيانات ناقصة (الاسم، البريد، أو الهاتف)');
        return '';
      }

      // 5. Save complaint locally
      console.log('💾 Saving complaint to local storage...');
      saveComplaints([newComplaint, ...complaints]);
      console.log('✅ Local save successful');

      // 6. Push to cloud database
      console.log('🌐 Pushing complaint to Firebase...');
      console.log('Push URL:', `${firebaseUrl}complaints.json`);
      
      try {
        const pushResponse = await fetch(`${firebaseUrl}complaints.json`, {
          method: 'POST',
          body: JSON.stringify(newComplaint),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📤 Firebase Push Response Status:', pushResponse.status, pushResponse.statusText);
        
        if (pushResponse.ok) {
          const pushData = await pushResponse.json();
          console.log('✅ Firebase Push Successful:', pushData);
        } else {
          const errorText = await pushResponse.text();
          console.error('❌ Firebase Push Failed. Status:', pushResponse.status);
          console.error('❌ Firebase Error Response:', errorText);
          console.warn('⚠️ Complaint saved locally, but cloud push failed');
          console.warn('⚠️ This might indicate Firebase Rules are blocking writes');
        }
      } catch (pushErr) {
        console.error('❌ Cloud Push Network Error:', pushErr);
        console.warn('⚠️ Complaint saved locally, but cloud push failed (network error)');
      }

      console.log('=== handleNewComplaint SUCCESS ===');
      console.log('Returning ID:', generatedId);
      return generatedId;
    } catch (error) {
      console.error('❌ =================================');
      console.error('❌ ERROR in handleNewComplaint');
      console.error('❌ Error Type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('❌ Error Message:', error instanceof Error ? error.message : String(error));
      console.error('❌ Error Stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('❌ Full Error Object:', error);
      console.error('❌ =================================');
      
      toast.error('حدث خطأ في معالجة الشكوى. تحقق من وحدة التحكم للمزيد من التفاصيل.');
      return '';
    }
  };

  const handleUpdateStatus = (id: string, status: any, reply?: string) => {
    const updated = complaints.map(c => {
      if (c.id === id) {
        const statusLabel = status === 'resolved' ? 'تامة' : status === 'in-progress' ? 'تحت الإنجاز' : 'معلقة';
        const subject = `تحديث حالة الشكوى رقم ${c.id}`;
        const body = `عزيزي/عزيزتي ${c.name}،\n\nنود إخطاركم بتحديث حالة شكواكم إلى: ${statusLabel}.\nالرد الإداري: ${reply || 'جاري المعالجة'}\n\nشكراً لكم.`;

        const mailtoUrl = `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        toast.success('تم الحفظ.. جاري فتح تطبيق Gmail الإفتراضي...', {
          duration: 3000,
          style: {
            fontFamily: 'Tajawal',
            fontWeight: 'bold',
            backgroundColor: '#1e40af',
            color: '#fff'
          }
        });

        window.location.href = mailtoUrl;

        return { ...c, status, adminReply: reply || c.adminReply };
      }
      return c;
    });
  saveComplaints(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right font-['Tajawal']" dir="rtl">
    <Toaster
      position="top-center"
      toastOptions={{
        className: 'z-[9999]',
        style: {
          fontFamily: 'Tajawal',
          zIndex: 9999
        }
      }}
    />
    <Navbar
      settings={settings}
      isAdmin={isAdmin}
      onAdminClick={() => setShowLogin(true)}
      onLogout={() => setIsAdmin(false)}
      onProjectClick={() => setShowProjectInfo(true)}
    />

    <AnimatePresence>
      {showLogin && (
        <AdminLogin
          adminCreds={adminCreds}
          onLogin={() => { setIsAdmin(true); setShowLogin(false); }}
          onCancel={() => setShowLogin(false)}
        />
      )}
    </AnimatePresence>

    <AnimatePresence>
      {showProjectInfo && (
        <ProjectInfoModal
          settings={settings}
          onCancel={() => setShowProjectInfo(false)}
        />
      )}
    </AnimatePresence>

    {isAdmin ? (
      <div className="relative">
        <AdminDashboard
          complaints={complaints}
          onUpdateStatus={handleUpdateStatus}
          onChangePassword={handleChangePassword}
          onExport={handleExportData}
          onImport={handleImportData}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetSettings={handleResetSettings}
          onSync={syncFromCloud}
        />
      </div>
    ) : (
      <>
        <Hero settings={settings} />
        <Features />
        <ComplaintForm onNewComplaint={handleNewComplaint} />
        <StatusTracker complaints={complaints} />
        <Contact settings={settings} />
      </>
    )}

      <Footer settings={settings} />
    </div>
  );
}

export default App;
