import React, { Component } from 'react';
import * as THREE from "three"; 
import classNames from 'classnames/bind';
import textImage from "./assets/404-error.png";
import './styles/text-cylinder.scss';

class TextCylinder extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.friction_coeff = (props.inertia) ? props.inertia : 0.98;
        this.currentx = null;
        this.currenty = null;
        this.storedx = null;
        this.storedy = null;
        this.time = Date.now();
        this.isDrag = false;
        this.velocity = {
            v: 0,
            x: 0,
            y: 0
        };
        this.direction = -1;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.update);

        this.ymidpoint = this.container.clientHeight / 2;
        this.xmidpoint = this.container.clientWidth / 2;

        this.frustumSize = 6;

        this.width = this.container.clientWidth * 0.4;
        this.height = this.container.clientWidth * 0.4;

        if(this.width < 300) {
            this.width = this.height = 300;
        }
        this.aspect = this.height / this.width;
        this.scene = new THREE.Scene();

        //ADD CAMERA
        /*this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );*/

        this.camera = new THREE.OrthographicCamera( this.frustumSize  / - 2, this.frustumSize / 2, this.frustumSize * 1 / 2, this.frustumSize * this.aspect / - 2, -100, 100 );

        //ADD RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMapCullFace = THREE.CullFaceBack;
        this.mount.appendChild(this.renderer.domElement);

        //ADD CYLINDER
        const geometry = new THREE.CylinderBufferGeometry( 2.8, 2.8, 2, 100, 1, true );
        const texture = new THREE.TextureLoader().load(textImage);
        texture.anisotropy = 1;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        const material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.DoubleSide, opacity: 1, depthWrite: false } );

        //const material = new THREE.MeshBasicMaterial({ color: '#433F81'     });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.rotation.x = 0.2;
        this.scene.add(this.cube);
        this.start();
    }

    componentWillUnmount(){
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
        window.removeEventListener("resize", this.update);
    }

    /*
    // Begin creating a dynamic text canvas texture
    createTextTexture() {
        var canvas = document.getElementById("myCanvas");
        canvas.width = 5300;
        canvas.height = 692;
        var ctx = canvas.getContext("2d");
        ctx.font = "500 100px Helvetica Neue";
        console.log(ctx.measureText("404 ERROR").width);
        console.log(ctx.measureText("404 ERROR").height);
        ctx.fillStyle = 'black';
        ctx.fillText("404 ERROR", 0, 200);
    }
    */

    update() {
        this.ymidpoint = this.container.clientHeight / 2;
        this.xmidpoint = this.container.clientWidth / 2;

        this.frustumSize = 6;

        this.width = this.container.clientWidth * 0.4;
        this.height = this.container.clientWidth * 0.4;
        if(this.width < 300) {
            this.width = this.height = 300;
        }
        this.aspect = this.height / this.width;

        this.camera.left = this.frustumSize  / - 2;
        this.camera.right = this.frustumSize  / 2;
        this.camera.top = this.frustumSize * 1 / 2;
        this.camera.bottom = this.frustumSize * this.aspect / - 2;

        this.renderer.setSize(this.width, this.height);
    }

    onMouseMove(e) {
        this.currentx = e.clientX;
        this.currenty = e.clientY;
        var yangleDelta = ((e.pageY - this.ymidpoint) / this.ymidpoint) * -1;
        var xangleDelta = ((e.pageX - this.xmidpoint) / this.xmidpoint) * -1;
        this.cube.rotation.x = yangleDelta * 0.2;
        this.cube.rotation.z = xangleDelta * 0.2;
    }

    onMouseUp(e) {
        this.isDrag = false;
    }

    onMouseDown(e) {
        this.isDrag = true;
    }

    calculateVelocity(dx,dy) {
     
        let newTime = Date.now();  
        let interval = newTime - this.time;
        let velocity = {
            v: Math.sqrt(dx*dx+dy*dy)/interval,
            x: dx / interval,
            y: dy / interval
        } 
        this.time = newTime;
        this.velocity = velocity;
        return velocity;
        
    }

    getVelocity() {
        let dy = this.currenty - this.storedy;
        let dx = this.currentx - this.storedx;
        if(dx > 0) {
            this.direction = 1;
        } else if(dx < 0) {
            this.direction = -1;
        }
        

        this.storedy = this.currenty;
        this.storedx = this.currentx;

        return this.calculateVelocity(dx,dy);
    }

    start = () => {
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId);
    }

    animate = () => {

        if(this.isDrag) {
            let v = this.getVelocity().v;
            if(this.direction > 0 ) {
                this.cube.rotation.y += v * 0.1;
            } else {
                this.cube.rotation.y -= v * 0.1;
            }
        } else {
            let normalizedV = (this.velocity.v * 0.1);

            if(normalizedV > 0.01) {
                this.velocity.v *= this.friction_coeff;
            } else {
                normalizedV = 0.01;
            }

            if(this.direction > 0 ) {
                this.cube.rotation.y += normalizedV;
            } else {
                this.cube.rotation.y -= normalizedV;
            }
            
        }
    
       this.renderScene()
       this.frameId = window.requestAnimationFrame(this.animate);
    }

    renderScene = () => {
      this.renderer.render(this.scene, this.camera);
    }
    
    

    render() {
        return (
            <div className="text-cylinder__full" ref={(container) => { this.container = container }} onMouseMove={this.onMouseMove} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
                <div ref={(mount) => { this.mount = mount }} /> 
            </div>
        );
    }
}

export default TextCylinder;