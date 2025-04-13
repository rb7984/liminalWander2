// Vertex Shader
export const vertexShader = `
    uniform vec3 cameraPosition;
    varying float vDistance;

    void main() {
        vDistance = length(cameraPosition - position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

export const vertexShader2 = `
    uniform vec2 uOffset;
        uniform vec2 uRepeat;
        uniform float uRotation;

        varying vec2 vUv;
        varying vec3 vWorldPosition;

        void main() {
            vec2 uv = uv;

            uv -= 0.5;
            float cosR = cos(uRotation);
            float sinR = sin(uRotation);
            mat2 rot = mat2(cosR, -sinR, sinR, cosR);
            uv = rot * uv;
            uv += 0.5;

            uv *= uRepeat;
            uv += uOffset;

            vUv = uv;

            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;

            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
`;

// Fragment Shader
export const fragmentShader =  `
    uniform sampler2D uTexture;
    uniform vec3 uCameraPosition;
    uniform vec3 uColor;
    uniform float uFadeStart;
    uniform float uFadeEnd;
    
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    
    void main() {
        float dist = distance(vWorldPosition, uCameraPosition);
        float fadeFactor = clamp((dist - uFadeStart) / (uFadeEnd - uFadeStart), 0.0, 1.0);
    
        vec4 texColor = texture2D(uTexture, vUv);
        vec4 baseColor = vec4(uColor, 1.0);
    
        gl_FragColor = mix(texColor, baseColor, fadeFactor);
    }
`;

export const fragmentShader2 = `
    uniform sampler2D uTexture;
    varying vec2 vUv;
    
    void main() {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`;