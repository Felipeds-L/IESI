import { User, CheckCircle, Trash2, FileText } from 'lucide-react';

interface AppointmentCardProps {
  id: number;
  date: string;
  time: string;
  patient: string; 
  doctor: string;  
  specialty: string; 
  status?: string; 
  onViewDetails?: () => void;
  onDelete?: (id: number) => void;
  onConfirm?: (id: number) => void;
}

export function AppointmentCard({ 
  id,
  date, 
  time, 
  patient, 
  doctor, 
  specialty, 
  status = "Agendado", 
  onViewDetails,
  onDelete,
  onConfirm
}: AppointmentCardProps) {

  const getStatusStyle = (currentStatus: string) => {
      switch(currentStatus) {
          case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          case 'Realizado': return 'bg-blue-100 text-blue-800 border-blue-200';
          case 'Cancelado': return 'bg-red-100 text-red-800 border-red-200';
          case 'Confirmado': return 'bg-green-100 text-green-800 border-green-200';
          default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
  };

  const isCompleted = status === 'Realizado' || status === 'Cancelado';

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col w-full hover:shadow-md transition-all duration-200">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          {time} <span className="text-sm font-normal text-gray-400 ml-1">({date})</span>
        </h3>
        <div className="p-2 rounded-full bg-purple-50 text-purple-600">
           <User size={20} />
        </div>
      </div>
      
      {/* Corpo */}
      <div className="flex-grow space-y-3 text-base text-gray-600 mb-6">
        <p className="flex justify-between border-b border-gray-50 pb-2">
          <span className="font-medium text-gray-800">Paciente:</span> 
          <span className="truncate max-w-[150px]" title={patient}>{patient}</span>
        </p>
        <p className="flex justify-between border-b border-gray-50 pb-2">
          <span className="font-medium text-gray-800">Médico(a):</span> 
          <span className="truncate max-w-[150px]" title={doctor}>{doctor}</span>
        </p>
        <p className="flex justify-between border-b border-gray-50 pb-2">
          <span className="font-medium text-gray-800">Especialidade:</span> 
          <span className="text-purple-600 font-medium">{specialty}</span>
        </p>
        <p className="flex justify-between items-center pt-1">
          <span className="font-medium text-gray-800">Status:</span> 
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getStatusStyle(status)}`}>
            {status}
          </span>
        </p>
      </div>

      {/* Ações (Grid de Botões) */}
      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-50">
         {/* Botão Confirmar (Só aparece se não estiver finalizado) */}
         {!isCompleted && (
             <button 
                onClick={() => onConfirm && onConfirm(id)}
                title="Confirmar Atendimento"
                className="col-span-1 flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 rounded-lg py-2 transition-colors border border-green-100"
             >
                <CheckCircle size={20} />
             </button>
         )}

         {/* Botão Excluir */}
         <button 
            onClick={() => onDelete && onDelete(id)}
            title="Excluir Agendamento"
            className={`${isCompleted ? 'col-span-1' : 'col-span-1'} flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg py-2 transition-colors border border-red-100`}
         >
            <Trash2 size={20} />
         </button>

         {/* Botão Prontuário (Ocupa o resto do espaço) */}
         <button 
           onClick={onViewDetails}
           className={`${isCompleted ? 'col-span-3' : 'col-span-2'} bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-colors text-sm border border-gray-200 flex items-center justify-center gap-2`}
         >
           <FileText size={18} />
           Prontuário
         </button>
      </div>
    </div>
  );
}