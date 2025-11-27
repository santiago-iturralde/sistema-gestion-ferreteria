import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Box } from "@mui/material";

interface ScannerProps {
  onScan: (decodedText: string) => void;
}

export const Scanner = ({ onScan }: ScannerProps) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, // Velocidad de lectura
        qrbox: undefined, // <--- TRUCO: Al poner undefined, usa todo el ancho de la cámara
        aspectRatio: 1.0,
        disableFlip: false, // A veces ayuda si la cámara está espejada
      },
      false
    );

    const success = (decodedText: string) => {
      scanner.clear();
      onScan(decodedText);
    };

    const error = (_err: any) => { 
      // console.warn(err); // Comentado para que no ensucie la consola
    };

    scanner.render(success, error);

    return () => {
      scanner.clear().catch(error => console.error("Error limpiando scanner", error));
    };
  }, []);

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <div id="reader" style={{ width: "100%" }}></div> 
    </Box>
  );
};