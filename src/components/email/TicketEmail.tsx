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
import { TicketType } from "@/types/enums";

interface TicketEmailProps {
  name: string;
  qrCodeUrl: string;
  ticketId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  ticketType: TicketType;
}

const IMG_URLS: Record<string, string> = {
  sortech:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/latribu%2Flogo.png?alt=media&token=7bbe940b-ae6e-4adf-8c41-5fd1dcd1dca5",
  ssoe: "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/ssoe%2Flogo.png?alt=media&token=bd0423b8-f5e7-47fc-a530-d603ad5a11c3",
  knockout:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/knockout%2Flogo.png?alt=media&token=a0e94ec7-bda0-47cf-b8de-dbf103aa1406",
  bichiyal:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/piso12%2FpN8CiNC5oheHobFlxakX.png?alt=media&token=862f102e-0433-4bb1-8eba-414429ba6d36",
  passtix:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/passtix%2Flogo.png?alt=media&token=40c581ba-c63d-440f-99d0-4ae4e8290d3f",
};

const getTicketLabel = (type: TicketType) => {
  switch (type) {
    case "ticket":
      return "Entrada";
    case "courtesy":
      return "Cortesía";
    case "brunch":
      return "Brunch (válido hasta las 6:00 p.m.)";
    default:
      return "Entrada";
  }
};

const getTicketStyle = (type: TicketType) => {
  switch (type) {
    case "brunch":
      return { bg: "#ffe0e9", color: "#d81b60" };
    case "courtesy":
      return { bg: "#e0f7fa", color: "#00796b" };
    case "ticket":
    default:
      return { bg: "#e8eaf6", color: "#3f51b5" };
  }
};

const TicketEmail: React.FC<TicketEmailProps> = ({
  name,
  qrCodeUrl,
  ticketId,
  eventName,
  eventDate,
  eventLocation,
  ticketType,
}) => {
  const normalizedKey = eventName.toLowerCase().replace(/\s/g, "");
  const logoUrl = IMG_URLS[normalizedKey] || IMG_URLS["passtix"];
  const { bg, color } = getTicketStyle(ticketType);

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

          {/* Main Content */}
          <Section style={{ padding: "32px 24px" }}>
            <Heading as="h1" style={{ fontSize: "24px", color: "#222" }}>
              🎟 ¡Entrada confirmada!
            </Heading>
            <Text
              style={{ fontSize: "14px", color: "#888", marginBottom: "16px" }}
            >
              ID de entrada: <strong>{ticketId}</strong>
            </Text>
            <Text
              style={{
                display: "inline-block",
                padding: "6px 12px",
                fontSize: "13px",
                borderRadius: "20px",
                backgroundColor: bg,
                color,
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              {getTicketLabel(ticketType)}
            </Text>
            <Heading
              as="h2"
              style={{ fontSize: "20px", marginBottom: "4px", color: "#444" }}
            >
              {eventName}
            </Heading>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              Hola <strong>{name}</strong>,
              {ticketType === "ticket" &&
                " esta es tu entrada. Preséntala al ingresar al evento."}
              {ticketType === "courtesy" &&
                " has recibido una cortesía para este evento. Preséntala al ingresar."}
              {ticketType === "brunch" &&
                " esta entrada es válida únicamente para el brunch (hasta las 6:00 p.m.). Preséntala al ingresar."}
            </Text>
            <Img
              src={qrCodeUrl}
              alt="Código QR"
              width="280"
              style={{
                display: "block",
                border: "1px solid #ddd",
                padding: "12px",
                borderRadius: "10px",
                margin: "24px auto 8px",
              }}
            />
            <Text style={{ fontSize: "12px", color: "#aaa", marginTop: "8px" }}>
              Si no ves el código QR, activa las imágenes en este correo.
            </Text>
          </Section>

          {/* Event Details */}
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
