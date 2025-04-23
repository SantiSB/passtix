import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Img,
} from "@react-email/components";

interface TicketEmailProps {
  name: string;
  qrCodeUrl: string;
  ticketId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
}

const IMG_URLS: Record<string, string> = {
  sortech:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/latribu%2Flogo.png?alt=media&token=7bbe940b-ae6e-4adf-8c41-5fd1dcd1dca5",
  ssoe: "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/arkhes%2Flogo.png?alt=media&token=35d7d18b-c030-4a3a-a285-bc0b64a54892",
  knockout:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/plazanorte%2Flogo.PNG?alt=media&token=ad0c3952-089f-4ebb-b848-f0d4fbbbe5f4",
  bichiyal:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/piso12%2FpN8CiNC5oheHobFlxakX.png?alt=media&token=862f102e-0433-4bb1-8eba-414429ba6d36",
  passtix:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/passtix%2Flogo.png?alt=media&token=40c581ba-c63d-440f-99d0-4ae4e8290d3f",
};

const TicketEmail: React.FC<TicketEmailProps> = ({
  name,
  qrCodeUrl,
  ticketId,
  eventName,
  eventDate,
  eventLocation,
}) => {
  const normalizedKey = eventName.toLowerCase().replace(/\s/g, "");
  const logoUrl = IMG_URLS[normalizedKey] || IMG_URLS["passtix"];

  return (
    <Html lang="es">
      <Head />
      <Body
        style={{
          backgroundColor: "#f9f9f9",
          fontFamily: "Helvetica, Arial, sans-serif",
          padding: "0",
          margin: "0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            maxWidth: "700px",
            margin: "0 auto",
            borderRadius: "8px",
            overflow: "hidden",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header */}
          <Section
            style={{
              background: "linear-gradient(90deg, #ffffff, #f0f0f0)",
              padding: "24px",
              borderBottom: "1px solid #eee",
            }}
          >
            <Img
              src={logoUrl}
              alt={`Logo de ${eventName}`}
              title={`Logo de ${eventName}`}
              width="180"
              style={{
                display: "block",
                margin: "0 auto",
                borderRadius: "8px",
              }}
            />
          </Section>

          {/* Contenido principal */}
          <Section style={{ padding: "32px 24px" }}>
            <Heading as="h1" style={{ fontSize: "24px", color: "#222" }}>
              🎟 ¡Entrada confirmada!
            </Heading>
            <Text
              style={{ fontSize: "14px", color: "#888", marginBottom: "16px" }}
            >
              ID de entrada: <strong>{ticketId}</strong>
            </Text>
            <Heading
              as="h2"
              style={{ fontSize: "20px", marginBottom: "4px", color: "#444" }}
            >
              {eventName}
            </Heading>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              Hola <strong>{name}</strong>, esta es tu entrada digital.
            </Text>
            <Text
              style={{ fontSize: "14px", color: "#333", marginBottom: "24px" }}
            >
              Preséntala al ingresar al evento.
            </Text>
            <Img
              src={qrCodeUrl}
              alt={`Código QR para tu entrada - Ticket URL: ${qrCodeUrl}`}
              title={`Código QR para tu entrada - Ticket URL: ${qrCodeUrl}`}
              width="280"
              style={{
                display: "block",
                border: "1px solid #ddd",
                padding: "12px",
                borderRadius: "10px",
                margin: "0 auto 8px",
              }}
            />
            <Text style={{ fontSize: "12px", color: "#aaa", marginTop: "8px" }}>
              Si no ves el código QR, activa las imágenes en este correo.
            </Text>
          </Section>

          {/* Detalles del evento */}
          <Section style={{ backgroundColor: "#fafafa", padding: "24px" }}>
            <Heading
              as="h3"
              style={{ fontSize: "16px", marginBottom: "12px", color: "#444" }}
            >
              📍 Detalles del evento
            </Heading>
            <Text style={{ fontSize: "14px", color: "#444" }}>
              <strong>Fecha:</strong> {eventDate}
            </Text>
            {eventLocation && (
              <Text style={{ fontSize: "14px", color: "#444" }}>
                <strong>Lugar:</strong> {eventLocation}
              </Text>
            )}
          </Section>

          {/* Footer */}
          <Section style={{ padding: "24px", backgroundColor: "#fff" }}>
            <Text style={{ fontSize: "14px", color: "#444" }}>
              Te esperamos para vivir una experiencia inolvidable.
            </Text>
            <Text
              style={{
                fontSize: "12px",
                color: "#aaa",
                marginTop: "12px",
                lineHeight: "1.5",
              }}
            >
              Este correo contiene tu entrada digital. No lo compartas con otras
              personas.
            </Text>
            <Text
              style={{
                fontSize: "10px",
                color: "#ccc",
                marginTop: "16px",
                lineHeight: "1.5",
              }}
            >
              AVISO DE CONFIDENCIALIDAD: La información contenida en este
              mensaje es confidencial y se dirige solo al destinatario.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TicketEmail;
