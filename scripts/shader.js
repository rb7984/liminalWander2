// Vertex Shader
export const vertexShader = `
    uniform vec3 cameraPosition;
    varying float vDistance;

    void main() {
        vDistance = length(cameraPosition - position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Fragment Shader
export const fragmentShader = `
    uniform sampler2D texture;
    varying float vDistance;
    uniform float fadeDistance;

    void main() {
        vec4 texColor = texture2D(texture, gl_PointCoord);

        // Calculate fade factor based on distance
        float fadeFactor = smoothstep(fadeDistance, 0.0, vDistance);

        // Apply fade effect (transparent for distant objects)
        texColor.a *= (1.0 - fadeFactor);
        gl_FragColor = texColor;
    }
`;