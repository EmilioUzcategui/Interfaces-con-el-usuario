-- Insertar paleta original
INSERT INTO colors (name, color1, color2, color3, color4, color5, active) 
VALUES ('original', '#007bff', '#ff5900', '#343a40', '#28a745', '#ffffff', false)
ON CONFLICT (name) DO NOTHING;

-- Insertar paleta daltónica (colores optimizados para daltónicos)
INSERT INTO colors (name, color1, color2, color3, color4, color5, active) 
VALUES ('daltonicos', '#1e3a8a', '#dc2626', '#1f2937', '#059669', '#f8fafc', false)
ON CONFLICT (name) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT * FROM colors WHERE name IN ('original', 'daltonicos');
