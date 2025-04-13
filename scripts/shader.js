export const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`;

export const fragmentShader = `
    uniform sampler2D uTexture;
    uniform mat3 uUVTransform;
    
    uniform vec3 uCameraPosition;
    uniform vec3 uColor;
    uniform float uFadeStart;
    uniform float uFadeEnd;
    
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    
    void main() {
        float dist = distance(vWorldPosition, uCameraPosition);
        float fadeFactor = clamp((dist - uFadeStart) / (uFadeEnd - uFadeStart), 0.0, 1.0);
    
        vec2 transformedUV = (uUVTransform * vec3(vUv, 1.0)).xy;
        vec4 texColor = texture2D(uTexture, transformedUV);
        vec4 baseColor = vec4(uColor, 1.0);
    
        gl_FragColor = mix(texColor, baseColor, fadeFactor);
    }
`;