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
}

const TicketEmail: React.FC<TicketEmailProps> = ({
  name,
  qrCodeUrl,
  ticketId,
}) => {
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
          {/* Encabezado y logo */}
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Img
              src="https://firebasestorage.googleapis.com/v0/b/passtix-f9e3e.firebasestorage.app/o/piso12%2Flogo_piso12_negro.png?alt=media&token=19ecaf49-ddec-48e2-bdfa-824f4ea8ebb4"
              alt="Logo Piso 12"
              width="220"
              style={{ margin: "0 auto 16px" }}
            />
            <Heading as="h1" style={{ fontSize: "24px", marginBottom: "8px" }}>
              ¡ Ya eres parte de la mejor fiesta de perreo !
            </Heading>
            <Text style={{ fontSize: "14px", color: "#333" }}>{ticketId}</Text>
            <Heading as="h2" style={{ fontSize: "20px", marginBottom: "8px" }}>
              ¡ESTA ENTRADA YA ES TUYA! 
            </Heading>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              Hola {name} !
            </Text>
            <Text style={{ fontSize: "14px", color: "#333" }}>
              LLEVA ESTE CÓDIGO QR A LA FIESTA, PUEDE SER IMPRESO O EN TU
              CELULAR
            </Text>
          </Section>

          {/* Código QR */}
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
              Presenta este código QR al ingresar al evento.
            </Text>
          </Section>

          {/* Detalles del evento */}
          <Section style={{ marginTop: "20px", textAlign: "center" }}>
            <Heading as="h2" style={{ fontSize: "18px", marginBottom: "12px" }}>
              Detalles de tu compra
            </Heading>
            <Text>
              <strong>Evento:</strong> BICHIYAL - Piso 12
            </Text>
            <Text>
              <strong>Fecha:</strong> 12 de abril de 2025
            </Text>
            <Text>
              <strong>Lugar:</strong> Hotel V1501
            </Text>
            <Text>
              <strong>Dirección:</strong> Cl 20 #33-60
            </Text>
            <Text>
              <strong>Ciudad:</strong> Pasto, Nariño
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ marginTop: "32px", textAlign: "center" }}>
            <Text><strong>Disfruta el espectáculo!</strong></Text>
            <Text>
              La fiesta no se vive, se siente… comparte la vibra con el mundo
              #RitmoYExperiencia
            </Text>
            <Text>instagram: @piso12____</Text>
            <Text>¡Gracias por su compra!</Text>
            <Text>PassTix agradece su preferencia.</Text>
            <Text>(+57)-305-206-59-63</Text>
            <Text
              style={{
                marginTop: "12px",
                fontSize: "10px",
                color: "#666",
                lineHeight: "1.4",
              }}
            >
              AVISO DE CONFIDENCIALIDAD: La información, incluyendo cualquier
              archivo adjunto, contenida en este mensaje es confidencial y
              solamente dirigido a la(s) persona(s) mencionadas arriba. Si el
              lector de este mensaje no es el interesado, favor de eliminarlo y
              notificar al remitente, quedando estrictamente prohibido la
              difusión, distribución o reproducción de este comunicado.
            </Text>
            <Text
              style={{
                fontSize: "10px",
                color: "#666",
                lineHeight: "1.4",
              }}
            >
              CONFIDENTIALITY NOTICE: The information contained in this
              electronic message including any attachments is privileged and
              confidential, and is intended for the use of the individual(s)
              named above and others who have been specifically authorized to
              receive it. If you are not the intended recipient, you are hereby
              notified that any dissemination, distribution or copying of this
              message is strictly prohibited. If you have received this message
              by mistake, please destroy it immediately, and notify the sender.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TicketEmail;
