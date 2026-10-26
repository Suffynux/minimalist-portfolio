import * as THREE from "three";

export type AvatarAction = "idle" | "wave" | "dance" | "think" | "glitch" | "fly" | "talk" | "nod" | "surprise";
export type AvatarPose = "audience" | "present-right" | "present-left" | "read";

/** An original, articulated character. Every feature rotates in real 3D. */
export function createAvatarRig() {
  const root = new THREE.Group();
  const head = new THREE.Group();
  head.position.set(0, .8, 0);
  root.add(head);
  const sphere = new THREE.SphereGeometry(1, 36, 28);
  const skin = new THREE.MeshStandardMaterial({ color: 0xe9e9e9, roughness: .82 });
  const hair = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: .85 });
  const beard = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: .9 });
  const cloth = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, roughness: 1 });
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .3 });
  const ink = new THREE.MeshStandardMaterial({ color: 0x090909, roughness: .24 });
  const inner = new THREE.MeshStandardMaterial({ color: 0x999999, roughness: .8 });
  const materials: THREE.Material[] = [skin, hair, beard, cloth, white, ink, inner];
  const geometries: THREE.BufferGeometry[] = [sphere];
  const ball = (parent: THREE.Object3D, material: THREE.Material, position: number[], scale: number[]) => {
    const mesh = new THREE.Mesh(sphere, material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    parent.add(mesh);
    return mesh;
  };
  const curve = (parent: THREE.Object3D, material: THREE.Material, points: number[][], radius: number) => {
    const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p as [number, number, number]))), 20, radius, 8, false);
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    parent.add(mesh);
    return mesh;
  };

  // Broad sweater shoulders and a visible neck: a bust, rather than a tiny body.
  ball(root, cloth, [0, -1.02, -.12], [1.05, .89, .52]);
  ball(root, skin, [0, -.28, 0], [.25, .4, .25]);
  curve(root, cloth, [[-.33,-.53,.2],[-.2,-.65,.38],[0,-.69,.41],[.2,-.65,.38],[.33,-.53,.2]], .065);

  // A single soft face surface. Simple oval eyes read cleanly through coarse dithering.
  ball(head, skin, [0, -.03, 0], [.82, .97, .69]);
  ball(head, skin, [0, -.43, .08], [.69, .54, .59]);
  for (const side of [-1, 1]) {
    ball(head, skin, [side*.8, -.04, -.01], [.15,.25,.14]);
    ball(head, inner, [side*.835, -.035, .105], [.06,.14,.026]);
  }
  ball(head, skin, [0,-.16,.665], [.105,.135,.12]);
  // The smile is a shaped opening, without a separate lip ring or protruding muzzle.
  const smileShape = new THREE.Shape();
  smileShape.moveTo(-.21,-.01);
  smileShape.quadraticCurveTo(0,-.075,.21,-.01);
  smileShape.quadraticCurveTo(.15,-.23,0,-.24);
  smileShape.quadraticCurveTo(-.14,-.23,-.21,-.01);
  const smileGeometry = new THREE.ShapeGeometry(smileShape,24);
  geometries.push(smileGeometry);
  const mouth = new THREE.Mesh(smileGeometry,new THREE.MeshBasicMaterial({color:0x080808,side:THREE.DoubleSide}));
  materials.push(mouth.material);
  mouth.position.set(0,-.38,.705);head.add(mouth);

  const eyes: THREE.Group[] = [];
  const pupils: THREE.Group[] = [];
  const brows: THREE.Object3D[] = [];
  for (const side of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(side*.3,.1,.627);
    head.add(eye); eyes.push(eye);
    const pupil = new THREE.Group();
    eye.add(pupil); pupils.push(pupil);
    ball(pupil, ink, [0,0,0], [.105,.176,.043]);
    ball(pupil, white, [-.026,.065,.041], [.022,.025,.007]);
    const brow = curve(head, ink, [[side*.19,.39,.61],[side*.29,.415,.62],[side*.4,.395,.58]], .034);
    brows.push(brow);
  }
  // A continuous swept cap with an asymmetric hairline. No rows of bead-like curls.
  const capGeometry = new THREE.SphereGeometry(1,48,28,0,Math.PI*2,0,Math.PI/2);
  const positions=capGeometry.attributes.position;
  for(let i=0;i<positions.count;i++) {
    const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i);
    const phi=Math.atan2(z,x);
    const theta=Math.acos(Math.min(1,Math.max(-1,y)));
    const front=Math.max(0,Math.sin(phi));
    const edge=1.73-front*(.26+.20*Math.exp(-Math.pow((Math.cos(phi)+.22)*3,2)));
    const t=theta/(Math.PI/2)*edge;
    positions.setXYZ(i,Math.sin(t)*Math.cos(phi)*.875,Math.cos(t)*.71+.44,Math.sin(t)*Math.sin(phi)*.735-.04);
  }
  capGeometry.computeVertexNormals();geometries.push(capGeometry);
  head.add(new THREE.Mesh(capGeometry,hair));
  const sweep=ball(head,hair,[-.27,.91,.13],[.57,.29,.55]);sweep.rotation.z=.24;
  const sweep2=ball(head,hair,[.34,.88,-.01],[.45,.26,.49]);sweep2.rotation.z=-.27;

  function arm(side: number) {
    const pivot = new THREE.Group();
    pivot.position.set(side*.65,-.55,0);
    root.add(pivot);
    ball(pivot, cloth, [0,-.28,0], [.23,.41,.26]);
    const hand = new THREE.Group();
    hand.position.set(0,-.69,.02);
    pivot.add(hand);
    ball(hand, white, [0,.08,0], [.2,.13,.2]);
    ball(hand, skin, [0,-.13,0], [.17,.2,.105]);
    // Four rounded fingers and a separate thumb.
    for(let i=0;i<4;i++) {
      const finger = ball(hand,skin,[(i-1.5)*.075,-.32+(i===0||i===3?.035:0),0],[.043,.13,.06]);
      finger.rotation.z=(i-1.5)*-.045;
    }
    const thumb=ball(hand,skin,[-side*.17,-.1,.04],[.065,.13,.065]);
    thumb.rotation.z=side*.65;
    return {pivot,hand};
  }
  const left = arm(-1), right = arm(1);
  const lerp = THREE.MathUtils.lerp;
  let lastTime = 0;
  const update = (time: number, pose: AvatarPose, action: AvatarAction, pointer: {x:number;y:number}, reduced: boolean) => {
    const dt = Math.min(.06, Math.max(.001, time-lastTime)); lastTime=time;
    const blend=reduced ? 1 : 1-Math.exp(-dt*7);
    const direction = pose === "present-right" ? 1 : pose === "present-left" ? -1 : 0;
    const moving=!reduced;
    const t=moving?time:0;
    let yaw=direction*.72 + (direction===0 ? pointer.x*.24 : pointer.x*.035);
    let pitch=pose==="read"?.16:direction?-.055:pointer.y*.1;
    let lean=0, bob=moving?Math.sin(t*1.7)*.025:0;
    let leftAngle=direction===-1?-1.7:-.12, rightAngle=direction===1?1.7:.12;
    const talking=action==="talk";
    if(talking && moving) { pitch+=Math.sin(t*4.2)*.04; rightAngle+=direction===1?Math.sin(t*3)*.12:0; }
    mouth.scale.y=reduced?1:talking?.6+Math.abs(Math.sin(t*12))*.65:1;
    mouth.scale.x=action==="surprise"?.55:1;
    if(action==="surprise"){pitch=-.12;rightAngle=2.6;leftAngle=-2.6;}
    if(action==="nod" && moving){yaw=0;pitch=Math.sin(t*7)*.14;}
    brows.forEach(brow=>brow.position.y=action==="surprise"?.09:talking&&moving?Math.sin(t*3)*.015:0);
    if(action==="wave") rightAngle=2.6+(moving?Math.sin(t*10)*.16:0);
    if(action==="dance" && moving) { lean=Math.sin(t*7)*.14; bob=Math.abs(Math.sin(t*7))*.12;leftAngle=-1.5+Math.sin(t*7)*.3;rightAngle=1.5+Math.sin(t*7)*.3; }
    if(action==="think") {yaw=-.18;pitch=.15;rightAngle=2.5;lean=.07;}
    if(action==="glitch" && moving) lean=Math.sin(t*35)*.08;
    if(action==="fly" && moving) {leftAngle=-2.5;rightAngle=2.5;}
    root.rotation.z=lerp(root.rotation.z,lean,blend);
    root.rotation.y=lerp(root.rotation.y,direction*.12,blend);
    root.position.y=lerp(root.position.y,bob,blend);
    head.rotation.y=lerp(head.rotation.y,yaw,blend);
    head.rotation.x=lerp(head.rotation.x,pitch,blend);
    left.pivot.rotation.z=lerp(left.pivot.rotation.z,leftAngle,blend);
    right.pivot.rotation.z=lerp(right.pivot.rotation.z,rightAngle,blend);
    left.hand.rotation.x=direction===-1?-.55:0;
    right.hand.rotation.x=direction===1?-.55:0;
    for(const pupil of pupils) {
      pupil.position.x=lerp(pupil.position.x,direction*.025+pointer.x*.023,blend);
      pupil.position.y=lerp(pupil.position.y,-pointer.y*.025,blend);
    }
    const blink = moving && t%5.3>5.12;
    eyes.forEach(eye=>eye.scale.y=lerp(eye.scale.y,blink?.08:1,1-Math.exp(-dt*35)));
  };
  return {root,update,dispose:()=>{geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
