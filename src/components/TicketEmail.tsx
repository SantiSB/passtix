import React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Img } from '@react-email/components';

interface TicketEmailProps {
  name: string;
  qrCodeUrl: string;
}

const TicketEmail: React.FC<TicketEmailProps> = ({
  name,
  qrCodeUrl,
}) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Heading>¡Tu entrada para BICHIYAL está lista!</Heading>
          </Section>
          <Section>
            <Text>Hola {name},</Text>
            <Text>¡Gracias por registrarte en BICHIYAL!</Text>
          </Section>
          <Section>
            <Text>Te confirmamos que tu entrada ha sido generada con éxito. A continuación encontrarás tu código QR, que deberás presentar al ingresar.</Text>
          </Section>
          <Section style={{ textAlign: 'center', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
            <Img src={qrCodeUrl} alt="Código QR" style={{ maxWidth: '200px', margin: '0 auto' }} />
          </Section>
          <Section>
            <Text>Evento: BICHIYAL</Text>
            <Text>Fecha y hora: 12 de abril, 20:00</Text>
            <Text>Lugar: Hotel V1501 – Cl 20 #33-60, Pasto</Text>
            <Text>Estado del ticket: Confirmado</Text>
          </Section>
          <Section>
            <Text>Instrucciones importantes:</Text>
            <Text>Presentá este código QR desde tu celular o impreso.</Text>
            <Text>Llegá con anticipación para evitar filas.</Text>
            <Text>El ticket es personal e intransferible.</Text>
            <Text>En caso de duda, respondé a este correo.</Text>
          </Section>
          <Section>
            <Text>Nos vemos en el evento,</Text>
            <Text>El equipo de Piso 12</Text>
          </Section>
          <Section>
            <Text>Instagram: @piso12___</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TicketEmail;
