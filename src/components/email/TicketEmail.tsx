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
      return "SSOE PASS";
    case "brunch":
      return "Brunch (válido hasta las 6:00 p.m.)";
    default:
      return "Entrada";
  }
};

const getTicketStyle = (type: TicketType) => {
  switch (type) {
    case "brunch":
      return { bg: "#fce4ec", color: "#c2185b" };
    case "courtesy":
      return { bg: "#e0f2f1", color: "#00695c" };
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
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Body
        style={{
          backgroundColor: "#ffffff",
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
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            overflow: "hidden",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Header con degradado plateado más brillante */}
          <Section
            style={{
              background: "linear-gradient(90deg, #bbbbbb, #eeeeee)",
              padding: "24px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <Img
              src={logoUrl}
              alt={`Logo de ${eventName}`}
              title={`Logo de ${eventName}`}
              width="180"
              style={{ display: "block", margin: "0 auto" }}
            />
          </Section>

          {/* Contenido principal */}
          <Section style={{ padding: "32px 24px", backgroundColor: "#ffffff" }}>
            <Heading as="h1" style={{ fontSize: "22px", color: "#222" }}>
              🎫 ¡Entrada confirmada!
            </Heading>
            <Text style={{ fontSize: "14px", color: "#666", margin: "8px 0" }}>
              ID de entrada: <strong>{ticketId}</strong>
            </Text>
            <Text
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: "999px",
                backgroundColor: bg,
                color,
                fontSize: "13px",
                fontWeight: "bold",
                marginTop: "12px",
              }}
            >
              {getTicketLabel(ticketType)}
            </Text>
            <Heading as="h2" style={{ fontSize: "18px", marginTop: "24px" }}>
              {eventName}
            </Heading>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              Hola <strong>{name}</strong>,
              {ticketType === "ticket" &&
                " esta es tu entrada. Preséntala al ingresar al evento."}
              {ticketType === "courtesy" &&
                " has recibido un SSOE PASS para este evento. Preséntalo al ingresar."}
              {ticketType === "brunch" &&
                " esta entrada es válida únicamente para el brunch (hasta las 6:00 p.m.). Preséntala al ingresar."}
            </Text>

            {/* Línea punteada tipo corte */}
            <div
              style={{
                margin: "24px auto 16px",
                width: "80%",
                borderBottom: "1px dashed #aaa",
              }}
            ></div>

            {/* QR centrado */}
            <Img
              src={qrCodeUrl}
              alt="Código QR"
              width="260"
              style={{
                display: "block",
                margin: "0 auto",
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "12px",
              }}
            />
            <Text
              style={{ fontSize: "12px", color: "#888", marginTop: "12px" }}
            >
              Si no ves el código QR, activa las imágenes en este correo.
            </Text>
          </Section>

          {/* Detalles del evento con fondo gris sólido adaptado */}
          <Section
            style={{
              padding: "24px",
              backgroundColor: "#f2f2f2",
              borderTop: "1px solid #ddd",
            }}
          >
            <Heading
              as="h3"
              style={{ fontSize: "15px", color: "#333", marginBottom: "8px" }}
            >
              📍 Detalles del evento
            </Heading>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              <strong>Fecha:</strong> {eventDate}
            </Text>
            {eventLocation && (
              <Text style={{ fontSize: "14px", color: "#333" }}>
                <strong>Lugar:</strong> {eventLocation}
              </Text>
            )}
          </Section>

          {/* Footer blanco sin cortes */}
          <Section style={{ padding: "24px", backgroundColor: "#ffffff" }}>
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
              Este correo contiene tu entrada digital. No la compartas.
            </Text>
            <Text
              style={{
                fontSize: "10px",
                color: "#bbb",
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
