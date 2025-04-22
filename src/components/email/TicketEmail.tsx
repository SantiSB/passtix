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
  eventVenue: string;
  eventAddress: string;
  eventCity: string;
}

/* 🔗 Diccionario de logos por nombre de evento o productor */
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
  eventVenue,
  eventAddress,
  eventCity,
}) => {
  const normalizedKey = eventName.toLowerCase().replace(/\s/g, "");
  const logoUrl = IMG_URLS[normalizedKey] || IMG_URLS["passtix"];

  return (
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: "#f2f2f2",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor: "#fff",
            padding: "32px",
            maxWidth: "700px",
            margin: "0 auto",
            borderRadius: "8px",
          }}
        >
          {/* ---------- header ---------- */}
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Img
              src={logoUrl}
              alt={`${eventName} logo`}
              width="220"
              style={{ margin: "0 auto 16px" }}
            />
            <Heading as="h1" style={{ fontSize: "24px", marginBottom: "8px" }}>
              ¡Tu entrada ya está confirmada!
            </Heading>
            <Text style={{ fontSize: "14px", color: "#333" }}>{ticketId}</Text>
            <Heading as="h2" style={{ fontSize: "20px", marginBottom: "8px" }}>
              {eventName}
            </Heading>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              Hola {name}!
            </Text>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              Lleva este código QR al evento (impreso o en tu celular).
            </Text>
          </Section>

          {/* ---------- QR ---------- */}
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Img
              src={qrCodeUrl}
              alt="Código QR"
              width="360"
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                margin: "0 auto",
              }}
            />
            <Text style={{ marginTop: "8px", fontSize: "12px", color: "#999" }}>
              Presenta este código QR al ingresar.
            </Text>
          </Section>

          {/* ---------- detalles ---------- */}
          <Section style={{ marginTop: "20px", textAlign: "center" }}>
            <Heading as="h2" style={{ fontSize: "18px", marginBottom: "12px" }}>
              Detalles del evento
            </Heading>
            <Text>
              <strong>Evento:</strong> {eventName}
            </Text>
            <Text>
              <strong>Fecha:</strong> {eventDate}
            </Text>
            {eventVenue && (
              <Text>
                <strong>Lugar:</strong> {eventVenue}
              </Text>
            )}
            {eventAddress && (
              <Text>
                <strong>Dirección:</strong> {eventAddress}
              </Text>
            )}
            {eventCity && (
              <Text>
                <strong>Ciudad:</strong> {eventCity}
              </Text>
            )}
          </Section>

          {/* ---------- footer ---------- */}
          <Section style={{ marginTop: "32px", textAlign: "center" }}>
            <Text>
              <strong>¡Nos vemos pronto!</strong>
            </Text>
            <Text>Gracias por elegir PassTix.</Text>
            <Text
              style={{
                marginTop: "12px",
                fontSize: "10px",
                color: "#666",
                lineHeight: "1.4",
              }}
            >
              AVISO DE CONFIDENCIALIDAD: la información contenida en este
              mensaje es confidencial y se dirige sólo al destinatario.
            </Text>
            <Text
              style={{
                fontSize: "10px",
                color: "#666",
                lineHeight: "1.4",
              }}
            >
              CONFIDENTIALITY NOTICE: This e‑mail and any attachments are
              confidential and intended only for the named recipient.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TicketEmail;
