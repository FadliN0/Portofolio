import { Vector3 } from 'three';
import { RigidBody } from '@react-three/rapier';

declare module '@react-three/rapier' {
  interface RigidBody {
    lerped?: Vector3;
  }
}
