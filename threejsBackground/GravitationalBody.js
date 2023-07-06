import * as THREE from 'three';


class GravitationalBody {
  constructor(scene, size = 0.2, color = 0xffffff, isLightSource = false, isInteraction = false, isNewPlanet = false ) {
    this.scene = scene;
    this.color = color; // hex color
    this.size = size; // int
    this.velocity = new THREE.Vector3(0,0,0); // THREE.vector3
    this.isLightSource = isLightSource; // bool
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    if (isInteraction) {
      this.size = 0.1;
    }
    let material;
    if (isLightSource || isInteraction) {
      material = new THREE.MeshBasicMaterial({ color: color ,transparent: true});
    } else {
      material = new THREE.MeshStandardMaterial({ color: color });
    }
    this.isInteraction = isInteraction;
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
    this.gravityArray = [];
    this.light = null;
    if (isLightSource) {
      this.light = new THREE.PointLight(0xffffff);
      this.mesh.add(this.light);
    }
    this.lineTrail;
    this.collisionOccurred = false;
    this.isNewPlanet = isNewPlanet;
    this.disabled = isNewPlanet;
  }



  applyGravity() {
    if (this.disabled) {
      return false;
    }
    if (this.gravityArray == null || this.gravityArray.length == 0) {
      throw Error('gravity array not set');
    }
    for (let item of this.gravityArray) {
      if (item !== this) {
        const distance = this.calculateDistance(item.mesh.position);
        const direction = new THREE.Vector3();
        direction.subVectors(item.mesh.position, this.mesh.position);
        direction.normalize();
        const directionTemp = direction.clone();
       
        const sumRadii = this.size + item.size; 
        if (distance < sumRadii) {
          this.applyCollision(item, directionTemp);
        } else {
          let gravity = this.calculateGravity(item.size, distance);
          let newGravity = gravity.toFixed(8);
          const velocity = direction.multiplyScalar(newGravity);
          velocity.clampLength(0, 0.4)
          this.velocity.add(velocity);
        }
      }
    }
  }

  calculateGravity(otherMass, distance) {
    const gravitationalConstant = 0.13 * 0.8; // Gravitational constant in m^3 kg^−1 s^−2  // original 6.67
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

  applyCollision(obj) {
    if (this.isInteraction) {
      return null;
    }
    if (this.isNewPlanet && obj.isLightSource) {
      this.disabled = true;
      this.scene.remove(this.mesh);
      return null;
    }
    if (obj.isInteraction) {
      return null;
    }
    if (this.isLightSource) {
      return null;
    }
    if (!this.lineTrail.disabled) {
    // approximate mass
    const thisMass = this.size * this.size;
    const objMass = obj.size * obj.size;
    let ratio = thisMass / objMass;
    if (ratio < 0.3) {
        // Too small
          this.lineTrail.disabled = true;
          this.scene.remove(this.mesh);
      }
    }
  }

  calculateNewVelocity(m1, v1_initial, m2, v2_initial) {
    var v1_final;
    v1_final = (m1 * v1_initial + m2 * v2_initial - m2 * (v1_initial - v2_initial)) / (m1 + m2);
    return v1_final;
  }
}

function makeStars(number) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const material = new THREE.PointsMaterial({ size: 0.05 });
  for (let i = 0; i < number; i++) {
    const MIN_DISTANCE = 21;
    let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));

    while (Math.sqrt(x * x + y * y + z * z) < MIN_DISTANCE) {
      [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));
    }
    vertices.push(x, y, z);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const particles = new THREE.Points(geometry, material);
  return particles;
}

export { GravitationalBody, makeStars };