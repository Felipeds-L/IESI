import nodemailer from "nodemailer";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail", // ou 'smtp.example.com'
      auth: {
        user: process.env.EMAIL_USER, // Defina no .env
        pass: process.env.EMAIL_PASS, // Defina no .env
      },
    });
  }

  async sendAppointmentConfirmation(to: string, appointmentDetails: any) {
    const { pacienteNome, data, hora, medicoNome, especialidade } = appointmentDetails;

    // Garante que a especialidade seja exibida, mesmo que vazia
    const especialidadeExibida = especialidade && especialidade.trim() !== '' 
      ? especialidade 
      : 'Não informada';

    const mailOptions = {
      from: '"HeathLink" <no-reply@heathlink.com>',
      to: to,
      subject: 'Confirmação de Agendamento - HeathLink',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6b21a8 0%, #9333ea 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="color: #ffffff; margin: 0;">Confirmação de Consulta</h2>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Olá, <strong>${pacienteNome}</strong>.</p>
            <p style="font-size: 14px; color: #4b5563; margin-bottom: 25px;">Sua consulta foi agendada com sucesso. Confira os detalhes abaixo:</p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Data:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${data}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Horário:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${hora}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Médico:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${medicoNome}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Especialidade:</td>
                  <td style="padding: 8px 0; color: #6b21a8; font-weight: 600;">${especialidadeExibida}</td>
                </tr>
              </table>
            </div>
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>Importante:</strong> Por favor, chegue com 15 minutos de antecedência.
              </p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
            <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
              HeathLink - Sistema de Gestão de Saúde<br />
              Este é um e-mail automático, por favor não responda.
            </p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}// backend/src/infra/services/EmailService.ts
