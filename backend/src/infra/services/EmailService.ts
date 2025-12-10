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

    const mailOptions = {
      from: '"IESI Clínica" <no-reply@iesiclinica.com>',
      to: to,
      subject: 'Confirmação de Agendamento - IESI',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6b21a8;">Confirmação de Consulta</h2>
          <p>Olá, <strong>${pacienteNome}</strong>.</p>
          <p>Sua consulta foi agendada com sucesso. Confira os detalhes abaixo:</p>
          <ul>
            <li><strong>Data:</strong> ${data}</li>
            <li><strong>Horário:</strong> ${hora}</li>
            <li><strong>Médico:</strong> ${medicoNome}</li>
            <li><strong>Especialidade:</strong> ${especialidade}</li>
          </ul>
          <p>Por favor, chegue com 15 minutos de antecedência.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">IESI - Sistema de Gestão Hospitalar</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}// backend/src/infra/services/EmailService.ts
