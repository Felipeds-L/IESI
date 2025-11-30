import { User } from 'lucide-react';

// 1. Removemos o 'type' de animal, pois agora são todos humanos
interface AppointmentCardProps {
  date: string;
  time: string;
  patient: string; // Nome do Paciente
  doctor: string;  // Médico(a)
  specialty: string; // Especialidade (ex: Cardiologista, Clínico Geral)
  status?: string; // Opcional: Para mostrar se está confirmado, pendente, etc.
  onViewDetails?: () => void;
}

export function AppointmentCard({ 
  date, 
  time, 
  patient, 
  doctor, 
  specialty, 
  status = "Agendado", // Valor padrão
  onViewDetails 
}: AppointmentCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col w-full max-w-sm hover:shadow-md transition-shadow">
      
      {/* Cabeçalho: Data e Ícone Genérico */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {date} às {time}
        </h3>
        <div className="p-2 rounded-full bg-blue-50 text-blue-600">
           {/* Ícone genérico de usuário/paciente */}
           <User size={20} />
        </div>
      </div>
      
      {/* Corpo: Informações */}
      <div className="flex-grow space-y-3 text-base text-gray-600 mb-6">
        <p className="flex justify-between border-b border-gray-50 pb-2">
          <span className="font-medium text-gray-800">Paciente:</span> 
          <span>{patient}</span>
        </p>
        <p className="flex justify-between border-b border-gray-50 pb-2">
          <span className="font-medium text-gray-800">Médico(a):</span> 
          <span>{doctor}</span>
        </p>
        <p className="flex justify-between border-b border-gray-50 pb-2">
          <span className="font-medium text-gray-800">Especialidade:</span> 
          <span className="text-blue-600 font-medium">{specialty}</span>
        </p>
        <p className="flex justify-between pt-1">
          <span className="font-medium text-gray-800">Status:</span> 
          <span className="px-2 py-0.5 rounded text-sm font-bold bg-green-100 text-green-700">
            {status}
          </span>
        </p>
      </div>

      {/* Botão */}
      <button 
        onClick={onViewDetails}
        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-base border border-gray-100"
      >
        Ver Prontuário
      </button>
    </div>
  );
}