import * as THREE from 'three';

// requires obj of type Body
class LineTrail {
  constructor(scene, obj, time = 1.5) {
    this.obj = obj;
    this.time = time;
    this.secondPos = new THREE.Vector3();
    this.thirdPos = new THREE.Vector3();
    this.count = 0;
    this.lines = [];
    this.scene = scene;
    this.disabled = false;
  }

  timerDone(lines, line) {
    this.scene.remove(line);
    if (lines.length > 1) {
      lines.shift();
    }
    if (line.material.map) {
      line.material.map.dispose();
    }
  }

  updateLines = () => {
    if (this.disabled) {
      return false;
    }
    const pos1 = this.obj.mesh.position.clone();
    const pos2 = this.secondPos.clone();
    const pos3 = this.thirdPos.clone();
    if (pos2.equals(new THREE.Vector3())) {
      this.secondPos.set(pos1.x, pos1.y, pos1.z);
    } else if (pos3.equals(new THREE.Vector3())) {
      this.thirdPos.set(pos2.x, pos2.y, pos2.z);
      this.secondPos.set(pos1.x, pos1.y, pos1.z);
    } else {
      this.count += 1;
      if (this.count % 2 === 0) {
        const curve = new THREE.CatmullRomCurve3([pos1, pos2, pos3]);
        const divisions = 10;
        const points = curve.getPoints(divisions);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: this.obj.color, transparent: true, opacity: 0.2 });
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        const opacityDecay = 0.015 / this.time;
        this.lines.forEach((item) => {
          item.material.opacity = Math.max(item.material.opacity - opacityDecay, 0);
        });
        this.lines.push(line);
        setTimeout(() => {
          this.timerDone(this.lines, line);
        }, this.time * 1000);
        this.count = 2;
      }
      this.thirdPos.set(pos2.x, pos2.y, pos2.z);
      this.secondPos.set(pos1.x, pos1.y, pos1.z);
    }
  }
}

export default LineTrail;