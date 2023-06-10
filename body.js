import * as THREE from 'three';

class Body {
  constructor(scene, size = 0.2, color = 0xffffff , isLightSource = false, interaction = false) {
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
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
    this.gravityArray = [];
    this.light = null;
    if (isLightSource) {
      this.light = new THREE.PointLight(0xffffff);
      this.mesh.add(this.light);
    }
    this.trail = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    this.collisionOccurred = false;
    this.cloud = null;
    this.lineTrail;
  }



  applyGravity = function() {
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
        if (distance > 0.1) {
          let gravity = this.calculateGravity(item.size, distance);
          let newGravity = gravity.toFixed(8);
          const velocity = direction.multiplyScalar(newGravity);
          this.velocity.add(velocity);
        }
        // check collision
        const sumRadii = this.size + item.size;
        if (!this.cloud) {
          if (distance < sumRadii) {
            // Collision occurred
            this.cloud = this.applyCollision(item, directionTemp);
            //console.log('1');
          }
        }
      }
    }
    if (this.cloud) {
      if (this.cloud.scale.x > 0.003) {
        this.cloud.scale.addScalar(-0.01);
      } else {
        this.cloud = null;
        this.scene.remove(this.cloud);
      }
    }
  }

  calculateGravity = function(otherMass, distance) {
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

  applyCollision(obj, direction) {
    let result = null;
    if (this.collisionOccurred) {
      return null;
    }
    if(this.isLightSource) {
      return null;
    }
    if (obj.isLightSource) {
      return null;
    }
    if (this.size > obj.size) {
      const size = this.size + obj.size;
      this.collisionOccurred = true;
      // create cloud
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const texture = new THREE.TextureLoader().load("/cloud.jpg");
      const material = new THREE.MeshBasicMaterial({
        opacity: 1,
        transparent: true,
        map: texture,
        color: 0xffdb61
      });
      const mesh = new THREE.Mesh(geometry, material);
      const spawnPosition = this.mesh.position.clone();
      spawnPosition.add(direction.multiplyScalar(this.size));
      mesh.position.copy(spawnPosition);
      this.scene.add(mesh);
      result = mesh;
      let ratio;
      if (this.size < obj.size) {
        ratio = this.size / obj.size;
        ratio = (ratio - 1) * -1;
      } else if (this.size == obj.size) {
        ratio = 0.5;
      } else {
        ratio = obj.size / this.size;
      }
      const velocityImpact = obj.velocity.clone();
      velocityImpact.multiplyScalar(ratio);
      this.velocity.add(velocityImpact);
      mesh.position.add(this.velocity);
      //mesh.position.z = 0.01;
    } else {
      //smaller planet
      obj.collisionOccurred = true;
      let ratio;
      if (this.size < obj.size) {
        ratio = this.size / obj.size;
        ratio = (ratio - 1) * -1;
      } else if (this.size == obj.size) {
        ratio = 0.5;
      } else {
        ratio = obj.size / this.size;
      }
      if (ratio > 0.8) {
        this.scene.remove(this.mesh);
        this.lineTrail.disabled = true;
        console.log('remove');
      } else {
        const velocityImpact = obj.velocity.clone();
        velocityImpact.multiplyScalar(ratio);
        console.log(ratio);
        this.velocity.add(velocityImpact);
      }
    }
    return result;
  }
  //<a href="https://www.freepik.com/free-vector/abstract-splashed-watercolor-textured-background_2632682.htm#query=cloud%20texture&position=16&from_view=keyword&track=ais">Image by rawpixel.com</a> on Freepik
}


export default Body;