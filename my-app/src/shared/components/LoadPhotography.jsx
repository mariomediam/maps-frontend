import React, { useRef, useState } from "react";

export default function LoadPhotography() {
  const [fileInfo, setFileInfo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const anySourceInputRef = useRef(null);
  const cameraOnlyInputRef = useRef(null);

  const MAX_MB = 10;                // cambia el límite si necesitas
  const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

  function openAnySource() {
    anySourceInputRef.current?.click();
  }
  function openCamera() {
    cameraOnlyInputRef.current?.click();
  }

  function reset() {
    setFileInfo(null);
    setPreviewUrl(null);
    setError(null);
  }

  function handleChange(e) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones básicas
    if (!ACCEPTED.includes(file.type) && !file.type.startsWith("image/")) {
      setError("Archivo no soportado. Sube una imagen (JPG, PNG, WEBP, HEIC).");
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_MB) {
      setError(`La imagen supera ${MAX_MB} MB (${sizeMB.toFixed(1)} MB).`);
      return;
    }

    setFileInfo({
      name: file.name || "photo",
      type: file.type || "image/*",
      sizeMB: sizeMB.toFixed(2),
      lastModified: file.lastModified,
    });

    // Preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Aquí puedes subir el file al backend / S3 / Cloudflare R2, etc.
    // const form = new FormData();
    // form.append("photo", file);
    // await fetch("/upload", { method: "POST", body: form });
  }

  return (
    <div style={{ maxWidth: 520, margin: "2rem auto", padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
      <h2 style={{ marginBottom: 12 }}>Cargar fotografía</h2>
      <p style={{ marginBottom: 16, color: "#374151" }}>
        Elige una opción: cámara, archivos o fotos/galería. (Depende del sistema del teléfono)
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <button onClick={openAnySource} style={btnStyle}>
          Elegir foto (cámara / archivos / galería)
        </button>
        <button onClick={openCamera} style={{ ...btnStyle, background: "#111827" }}>
          Tomar foto ahora (forzar cámara)
        </button>
        {previewUrl && (
          <button onClick={reset} style={{ ...btnStyle, background: "#6b7280" }}>
            Quitar / Reintentar
          </button>
        )}
      </div>

      {/* Input que muestra la hoja del sistema con opciones (recomendado) */}
      <input
        ref={anySourceInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {/* Input que intenta abrir directamente la cámara */}
      {/* iOS suele respetar `capture`, Android también; si no, vuelve a la hoja estándar */}
      <input
        ref={cameraOnlyInputRef}
        type="file"
        accept="image/*"
        capture="environment"              // para cámara trasera; usa "user" para frontal
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {error && <p style={{ color: "#b91c1c", marginTop: 8 }}>{error}</p>}

      {fileInfo && (
        <div style={{ marginTop: 16, fontSize: 14, color: "#374151" }}>
          <div><strong>Archivo:</strong> {fileInfo.name}</div>
          <div><strong>Tipo:</strong> {fileInfo.type}</div>
          <div><strong>Tamaño:</strong> {fileInfo.sizeMB} MB</div>
        </div>
      )}

      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <img
            src={previewUrl}
            alt="Vista previa"
            style={{ width: "100%", maxHeight: 420, objectFit: "contain", borderRadius: 8, border: "1px solid #e5e7eb" }}
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "10px 14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};
