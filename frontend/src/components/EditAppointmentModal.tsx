import { useState, useEffect } from 'react';
import { X, Save, User, Stethoscope, Clock, Calendar, Hash, Users, Activity, Syringe } from 'lucide-react';

export interface AppointmentData {
  id: number;
  date: string;
  time: string;
  patient: string;
  doctor: string;
  specialty: string;
  status: string;
  doctorId?: string;
  patientId?: string;
  patientGender?: string;
  patientAge?: string;
  patientGuardian?: string;
  problemDescription?: string;
  procedureType?: string;
}

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentData | null;
  onSave: (updatedData: AppointmentData) => void;
  isReadOnly?: boolean; 
}

export function EditAppointmentModal({ 
  isOpen, 
  onClose, 
  appointment, 
  onSave,
  isReadOnly = false 
}: EditAppointmentModalProps) {
  
  const [formData, setFormData] = useState<AppointmentData | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        setFormData(appointment);
      } else {
        setFormData({
          id: 0,
          date: '',
          time: '',
          patient: '',
          doctor: '',
          specialty: '',
          status: 'Agendado',
          doctorId: '',
          patientId: '',
          patientGender: '',
          patientAge: '',
          patientGuardian: '',
          problemDescription: '',
          procedureType: ''
        });
      }
    }
  }, [appointment, isOpen]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof AppointmentData, value: string) => {
    // Se for apenas leitura, bloqueamos a edição
    if (isReadOnly) return;
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData && !isReadOnly) {
      onSave(formData);
      onClose();
    }
  };

  const isEditing = formData.id !== 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        
        {/* Cabeçalho adapta a cor se for apenas leitura */}
        <div className={`${isReadOnly ? 'bg-gray-600' : 'bg-purple-600'} p-6 flex justify-between items-center text-white sticky top-0 z-10`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isReadOnly 
              ? '👁️ Prontuário (Visualização)' 
              : (isEditing ? '✏️ Editar Prontuário' : '➕ Novo Agendamento')}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Dados do Agendamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Data
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="DD/MM"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                  <Clock size={12} /> Hora
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="HH:MM"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Status</label>
                <select
                  disabled={isReadOnly}
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none bg-white text-sm disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="Agendado">Agendado</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Realizado">Realizado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Urgência">Urgência</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </div>
          </div>

          <div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={16} /> Dados do Paciente
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-2">
                   <label className="block text-sm font-semibold text-gray-500 mb-1">ID Paciente</label>
                   <div className="relative">
                      <Hash size={12} className="absolute left-2 top-3 text-gray-400" />
                      <input 
                        disabled={isReadOnly}
                        className="w-full border rounded-lg p-2 pl-6 bg-gray-50 text-sm disabled:bg-gray-100 disabled:text-gray-500" 
                        value={formData.patientId || ''} 
                        onChange={(e) => handleChange('patientId', e.target.value)}
                        placeholder="000"
                      />
                   </div>
                </div>

                <div className="md:col-span-6">
                   <label className="block text-sm font-semibold text-gray-500 mb-1">Nome Completo</label>
                   <input 
                      disabled={isReadOnly}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none font-medium disabled:bg-gray-100 disabled:text-gray-500"
                      value={formData.patient}
                      onChange={(e) => handleChange('patient', e.target.value)}
                      placeholder="Nome do Paciente"
                   />
                </div>

                <div className="md:col-span-2">
                   <label className="block text-sm font-semibold text-gray-500 mb-1">Idade</label>
                   <input 
                      disabled={isReadOnly}
                      type="text"
                      className="w-full border rounded-lg p-2 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                      value={formData.patientAge || ''}
                      onChange={(e) => handleChange('patientAge', e.target.value)}
                      placeholder="Anos"
                   />
                </div>

                <div className="md:col-span-2">
                   <label className="block text-sm font-semibold text-gray-500 mb-1">Gênero</label>
                   <select 
                      disabled={isReadOnly}
                      className="w-full border rounded-lg p-2 text-sm bg-white disabled:bg-gray-100 disabled:text-gray-500"
                      value={formData.patientGender || ''}
                      onChange={(e) => handleChange('patientGender', e.target.value)}
                   >
                      <option value="">Selecione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="Outro">Outro</option>
                   </select>
                </div>

                <div className="md:col-span-12">
                   <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                      <Users size={12} /> Nome do Responsável
                   </label>
                   <input 
                      disabled={isReadOnly}
                      className="w-full border rounded-lg p-2 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                      value={formData.patientGuardian || ''}
                      onChange={(e) => handleChange('patientGuardian', e.target.value)}
                      placeholder="Nome do pai, mãe ou responsável legal"
                   />
                </div>
             </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Stethoscope size={16} /> Dados Clínicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                   <label className="block text-sm font-semibold text-gray-500 mb-1">ID Médico</label>
                   <input 
                      disabled={isReadOnly}
                      className="w-full border rounded-lg p-2 bg-gray-50 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                      value={formData.doctorId || ''}
                      onChange={(e) => handleChange('doctorId', e.target.value)}
                      placeholder="CRM/ID"
                   />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Médico Responsável</label>
                  <input
                    disabled={isReadOnly}
                    type="text"
                    value={formData.doctor}
                    onChange={(e) => handleChange('doctor', e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Nome do Doutor(a)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1">Especialidade</label>
                  <input
                    disabled={isReadOnly}
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => handleChange('specialty', e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                    <Syringe size={12} /> Tipo de Procedimento
                  </label>
                  <input
                    disabled={isReadOnly}
                    type="text"
                    value={formData.procedureType || ''}
                    onChange={(e) => handleChange('procedureType', e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Ex: Consulta, Cirurgia, Exame..."
                  />
                </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-500 mb-1 flex items-center gap-1">
                  <Activity size={12} /> Descrição do Problema / Queixa Principal
               </label>
               <textarea 
                  disabled={isReadOnly}
                  className="w-full border rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-purple-500 outline-none resize-none disabled:bg-gray-100 disabled:text-gray-500"
                  value={formData.problemDescription || ''}
                  onChange={(e) => handleChange('problemDescription', e.target.value)}
                  placeholder="Descreva os sintomas, histórico ou motivo da consulta..."
               />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {isReadOnly ? 'Fechar' : 'Cancelar'}
            </button>
            
            {/* Escondemos o botão de salvar se for Apenas Leitura */}
            {!isReadOnly && (
                <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-md"
                >
                <Save size={18} /> {isEditing ? 'Salvar Alterações' : 'Criar Agendamento'}
                </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}