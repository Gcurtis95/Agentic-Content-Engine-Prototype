'use client';
import { useEffect, useRef } from 'react';

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// Domain-coloring rational map: two blended complex rational functions
// whose poles and zeros orbit at incommensurable speeds (golden-ratio locked),
// creating swirling petal / field-line patterns that never fully repeat.
// Phase (angle) drives hue; log-modulus drives concentric ring detail.
const FRAG = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_res;

  #define PI  3.14159265359
  #define TAU 6.28318530718
  #define PHI 1.61803398875

  vec3 cosinePalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(TAU * (c * t + d));
  }

  float grain(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // ── Complex arithmetic ──
  vec2 cMul(vec2 a, vec2 b) {
    return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
  }
  vec2 cDiv(vec2 a, vec2 b) {
    float d = dot(b, b);
    return vec2(dot(a, b), a.y*b.x - a.x*b.y) / d;
  }
  vec2 cLog(vec2 z) { return vec2(log(length(z)), atan(z.y, z.x)); }
  vec2 cSq(vec2 z)  { return cMul(z, z); }
  vec2 cCb(vec2 z)  { return cMul(cSq(z), z); }
  vec2 cQu(vec2 z)  { return cSq(cSq(z)); }
  vec2 cQn(vec2 z)  { return cMul(cQu(z), z); }

  vec3 shade(vec2 fragCoord) {
    float aspect = u_res.x / u_res.y;
    vec2 uv  = (fragCoord / u_res - 0.5) * vec2(aspect, 1.0);
    vec2 scr = fragCoord / u_res;

    float t = u_time * 0.10;
    vec2 z = uv * 2.5;

    // ── Layer A: 5-zero / 3-pole ──
    vec2 zA = vec2(cos(2.0 * t),        sin(2.0 * t));
    vec2 pA = vec2(cos(t * PHI + 1.0),  sin(t * PHI + 1.0));
    vec2 fA = cDiv(cQn(z) - zA, cCb(z) - pA * 0.85);

    // ── Layer B: 4-zero / 2-pole, slower cadence ──
    vec2 zB = vec2(cos(t * 0.41 + 0.8), sin(t * 0.41 + 0.8));
    vec2 pB = vec2(cos(t * 0.67 + PI),  sin(t * 0.67 + PI));
    vec2 numB = cQu(z) + cMul(z, zB * 0.5) - pB * 0.7;
    vec2 fB   = cDiv(numB, cSq(z) - zB * 0.55);

    vec2 lgA = cLog(fA);
    vec2 lgB = cLog(fB);

    float angA = lgA.y / PI;
    float angB = lgB.y / PI;
    float rngA = fract(lgA.x * 0.45);
    float rngB = fract(lgB.x * 0.45);

    float blend = smoothstep(0.0, 1.0,
      0.5 + 0.5 * sin(uv.x * 1.3 + uv.y * 0.7 + t * 0.2));

    float colorT = mix(angA + rngA * 0.25,
                       angB + rngB * 0.25,
                       blend);
    colorT += t * 0.07;

    vec3 pa = vec3(0.52, 0.45, 0.61);
    vec3 pb = vec3(0.40, 0.42, 0.31);
    vec3 pc = vec3(0.26, 0.30, 0.35);
    vec3 pd = vec3(0.15, 0.40, 0.40);
    vec3 col = cosinePalette(colorT, pa, pb, pc, pd);

    col *= 0.52;

    float bloom = smoothstep(0.85, 1.0, 1.0 - abs(angA));
    col += vec3(0.49, 0.19, 0.31) * bloom * 0.12;

    col += grain(scr) * 0.05;

    return clamp(col, 0.0, 1.0);
  }

  void main() {
    // 4-tap Rotated Grid Super Sampling — smooths fract() discontinuities
    vec3 col = shade(gl_FragCoord.xy + vec2(-0.375, -0.125))
             + shade(gl_FragCoord.xy + vec2( 0.125, -0.375))
             + shade(gl_FragCoord.xy + vec2( 0.375,  0.125))
             + shade(gl_FragCoord.xy + vec2(-0.125,  0.375));
    gl_FragColor = vec4(col * 0.25, 1.0);
  }
`;

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function ShaderBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const start = performance.now();
    const render = () => {
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
