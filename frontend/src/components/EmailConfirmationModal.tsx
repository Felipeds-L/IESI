// frontend/src/components/EmailConfirmationModal.tsx
import { useState } from "react";
import { X, Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentDetails: any; // Detalhes do agendamento recém-criado
}

export function EmailConfirmationModal({
  isOpen,
  onClose,
  appointmentDetails,
}: EmailConfirmationModalProps) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Por favor, digite um e-mail válido.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("http://localhost:3000/agendamentos/confirmacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          appointmentDetails,
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar e-mail");

      toast.success("Confirmação enviada com sucesso!");
      onClose();
      setEmail(""); // Limpa o campo
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar e-mail. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Envie a Confirmação</h2>
          <p className="text-gray-500 mb-6">
            O agendamento foi realizado! Digite o e-mail do paciente para enviar o comprovante.
          </p>

          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-600 mb-1 ml-1">E-mail do Paciente</label>
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                autoFocus
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Pular
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
              >
                {isSending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Enviar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}