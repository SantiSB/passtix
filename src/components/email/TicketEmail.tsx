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
  ticketTypeName: string;
}

const IMG_URLS: Record<string, string> = {
  sortech:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/latribu%2Flogo.png?alt=media&token=7bbe940b-ae6e-4adf-8c41-5fd1dcd1dca5",
  ssoe: "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/ssoe%2Flogo.png?alt=media&token=bd0423b8-f5e7-47fc-a530-d603ad5a11c3",
  knockout:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/knockout%2Flogo.png?alt=media&token=a0e94ec7-bda0-47cf-b8de-dbf103aa1406",
  bichiyal:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/piso12%2FpN8CiNC5oheHobFlxakX.png?alt=media&token=862f102e-0433-4bb1-8eba-414429ba6d36",
  "Future Club":
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/distress%2Flogo.png?alt=media&token=54c9c3e4-3ca2-4806-9427-15eb3409018a",
  passtix:
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/passtix%2Flogo.png?alt=media&token=40c581ba-c63d-440f-99d0-4ae4e8290d3f",
  "Aniversario Hot Groove":
    "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/hotgroove%2Flogo.png?alt=media&token=378b45f5-1461-4718-9525-fbac2ba7df89",
  "DSTEV Sessions #3": "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/dstev%2Flogo.png?alt=media&token=45e920c1-5910-4853-a54f-9dbbdecf598a",
  Aimée: "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/zagara%2Flogo.png?alt=media&token=f02135ec-ec39-4034-a611-a82f9c7beac0",
  Extravaganzza: "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/extravaganzza%2Flogo.png?alt=media&token=e5ae8377-2251-4e5f-99d1-7e56fb8fb05d",
  Shamanika: "https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/1537%2Fpasstix.png?alt=media&token=04467520-1a59-44df-8d9e-0c6b2c5efb37",
};

const getTicketStyle = (type: string) => {
  const hash = Math.abs(
    type
      .toLowerCase()
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)
  );

  const COLORS = [
    { bg: "#e8eaf6", color: "#3f51b5" },
    { bg: "#fce4ec", color: "#c2185b" },
    { bg: "#e0f2f1", color: "#00695c" },
    { bg: "#fff3e0", color: "#ef6c00" },
    { bg: "#ede7f6", color: "#5e35b1" },
    { bg: "#f1f8e9", color: "#33691e" },
    { bg: "#f3e5f5", color: "#8e24aa" },
    { bg: "#e1f5fe", color: "#0277bd" },
    { bg: "#ffe0b2", color: "#e65100" },
  ];

  return COLORS[hash % COLORS.length];
};

const TicketEmail: React.FC<TicketEmailProps> = ({
  name,
  qrCodeUrl,
  ticketId,
  eventName,
  eventDate,
  eventLocation,
  ticketTypeName,
}) => {
  const logoUrl = IMG_URLS[eventName] || IMG_URLS["passtix"];
  const { bg, color } = getTicketStyle(ticketTypeName);

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
              width="360"
              style={{ display: "block", margin: "0 auto" }}
            />
          </Section>

          <Section style={{ padding: "32px 24px" }}>
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
              {ticketTypeName}
            </Text>
            <Heading as="h2" style={{ fontSize: "18px", marginTop: "24px" }}>
              {eventName}
            </Heading>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              Hola <strong>{name}</strong>, esta es tu entrada. Preséntala al
              ingresar al evento.
            </Text>

            <div
              style={{
                margin: "24px auto 16px",
                width: "80%",
                borderBottom: "1px dashed #aaa",
              }}
            ></div>

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

          <Section style={{ padding: "24px" }}>
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
