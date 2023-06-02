import * as THREE from 'three';

class Body {
  constructor(size = 0.2, color = 0xffffff, velocity = new THREE.Vector3(0, 0, 0), isLightSource = false) {
    this.color = color; // hex color
    this.size = size; // int
    this.velocity = velocity // THREE.vector3
    this.isLightSource = isLightSource; // bool
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
    this.gravityArray = [];
  }

  // set gravityArray(newValue) {
  //   this.gravityArray = newValue;
  // }

  applyGravity = function() {
    if (this.gravityArray == null || this.gravityArray.length == 0) {
      throw Error('gravity array not set');
    }
    for (let item of this.gravityArray) {
      if (item !== this) {
        const distance = this.calculateDistance(item.mesh.position);

        let gravity = this.calculateGravity(item.size, distance);
        let newGravity = gravity.toFixed(8);
        const direction = new THREE.Vector3();
        direction.subVectors(item.mesh.position, this.mesh.position);
        direction.normalize();
        const velocity = direction.multiplyScalar(newGravity);
        velocity.clampLength(0,1);
        this.velocity.add(velocity);
      }
    }
  }

  calculateGravity(otherMass, distance) {
    const gravitationalConstant = 0.13; // Gravitational constant in m^3 kg^−1 s^−2  // original 6.67
    const gravity = (gravitationalConstant * this.size * otherMass) / (distance * distance);
    let ratio;
    if (this.size > otherMass) {
      ratio = this.size / otherMass;
      ratio = (ratio - 1) * -1;
    } else if (this.size == otherMass){
      ratio = 0.5;
    } else {
      ratio = otherMass / this.size;
    }
    return Math.min(Math.max(gravity * ratio, 0), 1);
  }

  calculateDistance(objPos) {
    const distanceVector = new THREE.Vector3();
    distanceVector.subVectors(objPos, this.mesh.position);
    const distance = distanceVector.length();
    return distance;
  }
}

export default Body;