import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import * as THREE from "three";
import {Slider,Divider,Typography} from '@material-ui/core';
import palettes from "nice-color-palettes";
import ColorScheme from "color-scheme";

import five from "../../assets/five.jpg";

import useStyles from "./App.style";

const Phi = (1+Math.sqrt(5))/2;
const goldenAngle = THREE.Math.degToRad(360 - (360/Phi));
const getRandom =(items) =>items[Math.floor(Math.random() * items.length)];

/*
var mouseDown = false,
        mouseX = 0,
        mouseY = 0;

    function onMouseMove(evt) {
        if (!mouseDown) {
            return;
        }

        evt.preventDefault();

        var deltaX = evt.clientX - mouseX,
            deltaY = evt.clientY - mouseY;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
        rotateScene(deltaX, deltaY);
    }

    function onMouseDown(evt) {
        evt.preventDefault();

        mouseDown = true;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
    }

    function onMouseUp(evt) {
        evt.preventDefault();

        mouseDown = false;
    }

    function addMouseHandler(canvas) {
    canvas.addEventListener('mousemove', function (e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function (e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function (e) {
        onMouseUp(e);
    }, false);
}

    function rotateScene(deltaX, deltaY) {
    root.rotation.y += deltaX / 100;
    root.rotation.x += deltaY / 100;
}
*/
const Box = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state 
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  const texture = useMemo(() => new THREE.TextureLoader().load(five), []);

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [2, 2, 2] : [1.5, 1.5, 1.5]}
      onClick={(e) => setActive(!active)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshBasicMaterial attach="material" transparent side={THREE.DoubleSide}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </mesh>
  );
}

const Flower = ({leafProps,leafs})=>{
  const mesh = useRef();


  return(
    <group      ref={mesh}>
      {Array(leafs).fill('').map((_,index)=>{
   
        const rotation = new THREE.Euler( 0, 0,goldenAngle*(index+1))
        return (

        <Leaf rotation={rotation} {...leafProps}></Leaf>

      )})}
    </group>
  )
}
const Leaf = ({initX=0,initY=0,width, height,rotation,hue,...props}) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  const extrudeSettings =  { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

  const cp11X = initX - width/2
  const cp11Y = initY;
  const cp12X = initX - width/2;
  const cp12Y = initY + height*0.6;

  const cp21X = initX + width/2;
  const cp21Y = initY + height*0.6;
  const cp22X = initX + width/2;
  const cp22Y = initY;

  const heartShape =  useMemo(()=>new THREE.Shape() 
  .moveTo( initX , initY  )
  .bezierCurveTo( cp11X,cp11Y,cp12X,cp12Y,initX,initY + height)
  .lineTo( initX,initY + height)
  .bezierCurveTo( cp21X,cp21Y,cp22X,cp22Y,initX,initY),[width,height,initX,initY])

  const color = useMemo(()=>{
    const scheme = new ColorScheme;
    scheme.from_hue(hue)         
          .scheme('analogic')
          .distance(0.05)    
          .variation('soft');
          console.log(scheme)
    return "#"+getRandom(scheme.colors())
  },[hue])
  return (
    <group rotation={rotation}>
      <mesh
        {...props}
        ref={mesh}
      > (
        <extrudeBufferGeometry  attach="geometry"  args={[heartShape,extrudeSettings]}/>)
          <meshPhongMaterial color={ color} />
    
      </mesh>
    </group>
  );
}
const App = () => {
  const classes = useStyles();
  const [width,setWidth] = useState(50)
  const [height,setHeight] = useState(100)
  const [hue,setHue] = useState(220)
  const [leafs,setLeafs] = useState(20)
  return (
    <>
      <CssBaseline />
      <div className={classes.controls}>
      <Typography  gutterBottom>
        Width
      </Typography>
      <Slider
        defaultValue={width}
        step={1}
        value={width}
        onChange={(e,value)=>setWidth(value)}
        min={1}
        max={100}
        valueLabelDisplay="auto"
      />
        <Typography  gutterBottom>
        Height
      </Typography>
      <Slider
        defaultValue={height}
        step={1}
        value={height}
        onChange={(e,value)=>setHeight(value)}
        min={1}
        max={100}
        valueLabelDisplay="auto"
      />
      <Typography  gutterBottom>
        Leafs
      </Typography>
      <Slider
        defaultValue={leafs}
        step={1}
        value={leafs}
        onChange={(e,value)=>setLeafs(value)}
        min={1}
        max={30}
        valueLabelDisplay="auto"
      />
              <Typography  gutterBottom>
        Hue
      </Typography>
      <Slider
        defaultValue={hue}
        step={1}
        value={hue}
        onChange={(e,value)=>setHue(value)}
        min={1}
        max={360}
        valueLabelDisplay="auto"
      />
      </div>

      <Canvas camera={{ position: [0, 0, 300] }} className={classes.canvas}>
        <ambientLight intensity={0.5} />
        <Flower leafs={leafs} leafProps={
          {
            width,
           height,
           hue,
          }
        }></Flower>
      </Canvas>
    </>
  );
};

export default App;
