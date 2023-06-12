import * as THREE from 'three';


class Body {
  constructor(scene, size = 0.2, color = 0xffffff, isLightSource = false, interaction = false, ) {
    this.scene = scene;
    this.color = color; // hex color
    this.size = size; // int
    this.velocity = new THREE.Vector3(0,0,0); // THREE.vector3
    this.isLightSource = isLightSource; // bool
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    let material;
    if (isLightSource || interaction) {
      material = new THREE.MeshBasicMaterial({ color: color ,transparent: true});
    } else {
      material = new THREE.MeshStandardMaterial({ color: color });
    }
    this.interaction = interaction;
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
    this.gravityArray = [];
    this.light = null;
    if (isLightSource) {
      this.light = new THREE.PointLight(0xffffff);
      this.mesh.add(this.light);
    }
    this.trail = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    this.lineTrail;
    this.collisionOccurred = false;
  }



  applyGravity() {
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
    if (this.interaction) {
      return null;
    }
    if (obj.interaction) {
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
  //<a href="https://www.freepik.com/free-vector/abstract-splashed-watercolor-textured-background_2632682.htm#query=cloud%20texture&position=16&from_view=keyword&track=ais">Image by rawpixel.com</a> on Freepik
}


export default Body;