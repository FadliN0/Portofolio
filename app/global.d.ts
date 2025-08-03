export { };

// Asset declarations
declare module '*.glb' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

// Meshline declaration
declare module 'meshline' {
  import { BufferGeometry, Material, Vector3 } from 'three';
  
  export interface MeshLineGeometryParameters {
    points?: Float32Array | number[] | Vector3[];
  }
  
  export class MeshLineGeometry extends BufferGeometry {
    constructor(parameters?: MeshLineGeometryParameters);
    setPoints(points: Float32Array | number[] | Vector3[]): void;
  }

  export interface MeshLineMaterialParameters {
    color?: number | string;
    opacity?: number;
    resolution?: { x: number; y: number };
    lineWidth?: number;
    near?: number;
    far?: number;
    transparent?: boolean;
    alphaTest?: number;
    dashArray?: number;
    dashOffset?: number;
    dashRatio?: number;
    useMap?: boolean;
    map?: THREE.Texture;
    useAlphaMap?: boolean;
    alphaMap?: THREE.Texture;
    repeat?: { x: number; y: number };
    sizeAttenuation?: boolean;
  }

  export class MeshLineMaterial extends Material {
    constructor(parameters?: MeshLineMaterialParameters);
    color: THREE.Color;
    opacity: number;
    resolution: { x: number; y: number };
    lineWidth: number;
    near: number;
    far: number;
    dashArray: number;
    dashOffset: number;
    dashRatio: number;
    useMap: boolean;
    map: THREE.Texture | null;
    useAlphaMap: boolean;
    alphaMap: THREE.Texture | null;
    repeat: { x: number; y: number };
    sizeAttenuation: boolean;
  }
}

// JSX Custom Intrinsics for R3F
declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: ReactThreeFiber.Object3DNode<
        import('meshline').MeshLineGeometry,
        typeof import('meshline').MeshLineGeometry
      >;
      meshLineMaterial: ReactThreeFiber.Object3DNode<
        import('meshline').MeshLineMaterial,
        typeof import('meshline').MeshLineMaterial
      >;
    }
  }
}