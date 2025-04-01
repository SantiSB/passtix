import React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Button, Img } from '@react-email/components';

interface TicketEmailProps {
  firstName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  ticketStatus: string;
  qrCodeUrl: string;
  producerName: string;
}

const TicketEmail: React.FC<TicketEmailProps> = ({
  firstName,
  eventName,
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  ticketStatus,
  qrCodeUrl,
  producerName,
}) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Heading>¡Tu entrada para {eventName} está lista!</Heading>
          </Section>
          <Section>
            <Text>Hola {firstName},</Text>
            <Text>¡Gracias por registrarte en {eventName}!</Text>
          </Section>
          <Section>
            <Text>Te confirmamos que tu entrada ha sido generada con éxito. A continuación encontrarás tu código QR, que deberás presentar al ingresar.</Text>
          </Section>
          <Section style={{ textAlign: 'center', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
            <Img src={qrCodeUrl} alt="Código QR" style={{ maxWidth: '200px', margin: '0 auto' }} />
          </Section>
          <Section>
            <Text>Evento: {eventName}</Text>
            <Text>Fecha y hora: {eventDate}, {eventTime}</Text>
            <Text>Lugar: {venueName} – {venueAddress}</Text>
            <Text>Estado del ticket: {ticketStatus}</Text>
          </Section>
          <Section>
            <Text>Instrucciones importantes:</Text>
            <Text>Presentá este código QR desde tu celular o impreso.</Text>
            <Text>Llegá con anticipación para evitar filas.</Text>
            <Text>El ticket es personal e intransferible.</Text>
            <Text>En caso de duda, respondé a este correo.</Text>
          </Section>
          {/* <Section>
            <Button href="#">Descargar Ticket PDF</Button>
          </Section> */}
          <Section>
            <Text>Nos vemos en el evento,</Text>
            <Text>El equipo de {producerName}</Text>
          </Section>
          <Section>
            <Text>Redes sociales (opcional)</Text>
            <Text>Información legal o disclaimer</Text>
            <Text>Link para contacto o soporte</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TicketEmail;
