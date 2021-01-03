import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { vertex } from "./shaders/vertex";
import { fragment } from "./shaders/fragment";
import { vertex1 } from "./shaders/vertex1";
import { fragment1 } from "./shaders/fragment1";
import { vertex2 } from "./shaders/vertex2";
import { fragment2 } from "./shaders/fragment2";
import vid from "./img/sample.mp4";

class Font extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }
  componentDidMount() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.count = 40;
    this.width = this.mount.clientWidth;
    this.height = this.mount.clientHeight;
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.setSize(this.width, this.height);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container = document.getElementById("scene");

    this.mount.appendChild(this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
    //this.mouse = new THREE.Vector2();

    this.mouse = { x: 0, y: 0 };
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.001,
      1000
    );

    this.camera.position.set(0, 0, 2);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;
    this.setupResize();
    this.addSquares();
    this.addObjects();
    this.addPoints();
   

    this.addLines();
    this.animate();
    this.mouseEvents();
    this.resize();
  }

  addPoints() {
    this.materialPoints = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },

        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      transparent: true,
      vertexShader: vertex2,
      fragmentShader: fragment2,
    });
    this.pointsGeo = new THREE.BufferGeometry();

    let vertices = [];

    for (let i = -this.count / 2; i < this.count / 2; i++) {
      for (let j = -this.count / 2; j < this.count / 2; j++) {
        vertices.push(i / 10 + 0.05, j / 10 + 0.05, 0);
      }
    }

    this.pointsGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    this.particles = new THREE.Points(this.pointsGeo, this.materialPoints);

    this.scene.add(this.particles);
this.particles.position.z = 0.008

  }

  addLines() {
    let material = new THREE.LineBasicMaterial({
      color: 0xffffff,
   transparent: true,
   opacity: 0.5
    });
    let geometry = new THREE.Geometry();

    this.lines = new THREE.LineSegments(geometry, material);

    for (let i = -this.count / 2; i < this.count / 2; i++) {
      geometry.vertices.push(new THREE.Vector3(-5, i / 10 + 0.05, 0));
      geometry.vertices.push(new THREE.Vector3(5, i / 10 + 0.05, 0));
    }

    for (let i = -this.count / 2; i < this.count / 2; i++) {
      geometry.vertices.push(new THREE.Vector3(i / 10 + 0.05, -5, 0));
      geometry.vertices.push(new THREE.Vector3( i / 10 + 0.05, 5, 0));
    }
    this.scene.add(this.lines);

    this.lines.position.z = 0.009;
  }

  mouseEvents() {
    let that = this;
    this.testPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial()
    );
    function onMouseMove(event) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components

      that.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      that.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // update the picking ray with the camera and mouse position
      that.raycaster.setFromCamera(that.mouse, that.camera);

      // calculate objects intersecting the picking ray
      const intersects = that.raycaster.intersectObjects([that.testPlane]);
      if (intersects.length > 0) {
        that.materialSquares.uniforms.mouse.value = intersects[0].point;
      }
    }

    window.addEventListener("mousemove", onMouseMove, false);
  }

  addSquares() {
    this.materialSquares = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },

      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        mouse: { type: "v3", value: new THREE.Vector3() },

        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      transparent: true,
      vertexShader: vertex1,
      fragmentShader: fragment1,
    });

    this.geometrySquares = new THREE.PlaneBufferGeometry(0.1, 0.1);

    this.squares = new THREE.InstancedMesh(
      this.geometrySquares,
      this.materialSquares,
      this.count ** 2
    );

    this.scene.add(this.squares);
    this.test = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(0.3, 0.3),
      new THREE.MeshBasicMaterial()
    );

    this.test.position.z = -0.4;
    this.scene.add(this.test);

    let dummy = new THREE.Object3D();

    let counter = 0;
    for (let i = -this.count / 2; i < this.count / 2; i++) {
      for (let j = -this.count / 2; j < this.count / 2; j++) {
        dummy.position.set(i / 10, j / 10, 0);
        dummy.updateMatrix();

        this.squares.setMatrixAt(counter++, dummy.matrix);
      }
    }

    this.squares.position.z = 0.01;
  }

  addObjects() {
    var video = this.vid;

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    texture.format = THREE.RGBAFormat;

    this.vid.play();
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        texture: { type: "t", value: texture },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.plane);
  }

  setupResize = () => {
    window.addEventListener("resize", this.resize);
  };

  resize = () => {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    console.log("resize");

    this.imageAspect = 1080 / 1920;

    let a1;
    let a2;

    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    const dist = this.camera.position.z;
    const height = 0.8;
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    if (this.width / this.height > 1) {
      this.plane.scale.x = this.camera.aspect;
    } else {
      this.plane.scale.y = 1 / this.camera.aspect;
    }

    this.camera.updateProjectionMatrix();
    console.log(this.camera);
  };

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.time += 0.05;

    this.scene.rotation.x = -this.mouse.y/10
    this.scene.rotation.y = this.mouse.x/10
    this.material.uniforms.time.value = this.time;
    this.materialSquares.uniforms.time.value = this.time;
    this.materialPoints.uniforms.time.value = this.time;

    this.frameId = requestAnimationFrame(this.animate);

    this.renderScene();
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <>
        <video
          ref={(vid) => {
            this.vid = vid;
          }}
          style={{
            display: "none",
          }}
          src={vid}
          muted={true}
          playsInline={true}
        ></video>
        <div
          id="scene"
          ref={(mount) => {
            this.mount = mount;
          }}
        ></div>
      </>
    );
  }
}

export default Font;
