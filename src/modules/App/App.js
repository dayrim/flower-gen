import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useRef, useState, useMemo,Suspense ,useEffect} from "react";
import { Canvas, useFrame,useLoader } from "react-three-fiber";
import * as THREE from "three";
import {Slider,Divider,Typography} from '@material-ui/core';
import palettes from "nice-color-palettes";
import ColorScheme from "color-scheme";
import { Flow } from "three/examples/jsm/modifiers/CurveModifier.js";
import { OrbitControls, Html ,Plane} from 'drei';

import elevation from "../../assets/elevation.png";
import normals from "../../assets/normals.png";
import five from "../../assets/five.jpg";

import useStyles from "./App.style";


const Phi = (1+Math.sqrt(5))/2;
const goldenAngle = THREE.Math.degToRad(360 - (360/Phi));
const getRandom =(items) =>items[Math.floor(Math.random() * items.length)];


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

const Flower = ({leafProps,leafs,scene,alongCurve})=>{
  const mesh = useRef();


  return(
    <group      ref={mesh}>
      {Array(leafs).fill('').map((_,index)=>{
   
        const rotation = new THREE.Euler( 0, 0,goldenAngle*(index+1))
        return (

        <Leaf scene={scene} rotation={rotation} leafIndex={index} leafs={leafs} {...leafProps}></Leaf>

      )})}
    </group>
  )
}
const Leaf = ({initX=0,initY=0,width, height,rotation,hue,scene,leafIndex,leafs,alongCurve,...props}) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const groupRef = useRef();
  const normalsMap = useLoader(THREE.TextureLoader, normals);
  const displacementMap = useLoader(THREE.TextureLoader, elevation);
  const extrudeSettings =  { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  console.log(scene,"scene")
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

 


  useEffect(()=>{
    console.log(mesh,scene)
    if(mesh && scene && groupRef){
      const points = [
        new THREE.Vector3( initX, initY, 0 ),
        new THREE.Vector3( initX, initY+height/2,  70 ),
        new THREE.Vector3( initX, initY+height,  0 ),
       ];
       const curveVertices = points.map( function ( handlePos ) {

				const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
				const boxMaterial = new THREE.MeshBasicMaterial( 0x99ff99 );
        const handle = new THREE.Mesh( boxGeometry, boxMaterial );
        handle.position.copy( handlePos );
        scene.add( handle );
        return handle.position;

      } );

       const curve = new THREE.CatmullRomCurve3(points.map(curvePoint=>curvePoint.applyEuler(rotation)) );
       curve.curveType = "centripetal";
       curve.closed = true;
        console.log(points,'points')
       const geometry = new THREE.ExtrudeBufferGeometry(heartShape,extrudeSettings)
       const material = new THREE.MeshStandardMaterial( {
        color
      } );
      geometry.rotateZ(THREE.Math.degToRad(90+180));
      // geometry.rotateY(THREE.Math.degToRad(180));
      // geometry.setRotationFromEuler(rotation);
      const lineGeometry = new THREE.BufferGeometry().setFromPoints( curve.getPoints(30));
      console.log(lineGeometry,'lineGeometry')
      console.log(lineGeometry.curveVertices,'lineGeometry')
      const lineMaterial = new THREE.LineBasicMaterial( { color  } );
      
      // Create the final object to add to the scene
      const curveObject = new THREE.Line( lineGeometry, lineMaterial );
      // curveObject.setRotationFromEuler(rotation)
      var curveVerts = new THREE.Vector3();
      
      let coordType= 0
      let xCoord;
      let yCoord;
      let zCoord;
      let rotatedCurvePoints =[]
      console.log(curveObject,"curveObject")
     curveObject.geometry.attributes.position.array.map((coord)=>{
       console.log(coordType,'coordType')
       console.log(coord,"coord")
        if(coordType ===0){
          xCoord = coord
          coordType++
        }
        else if (coordType ===1){
          yCoord = coord
          coordType++
        }
        else if (coordType ===2){
          zCoord = coord
          coordType++
        }
        else if (coordType ===3){
          rotatedCurvePoints.push(new THREE.Vector3(xCoord,yCoord,zCoord))
          xCoord=coord
          coordType = 1
        }
      })
      console.log(rotatedCurvePoints,'rotatedCurvePoints')
      // set tempVertex based on information from mesh.geometry.attributes.position

      curveObject.localToWorld(curveVerts);
      console.log(curveVerts,"curveVerts")
      // scene.add(curveObject)
      const objectToCurve = new THREE.Mesh( geometry, material );
       const flow = new Flow( objectToCurve );
       flow.updateCurve( 0, curve );
      //  scene.add( flow.object3D );
      console.log(alongCurve,'alongCurve')
      console.log(flow.object3D,'flow.object3')
      groupRef.current.add(curveObject)
      groupRef.current.add(flow.object3D)
      flow.moveAlongCurve(alongCurve)
      // groupRef.current.setRotationFromEuler(rotation)
    }
  },[mesh.current,scene,groupRef.current,alongCurve,height,width,hue])
  // console.log(mesh?.current?.geometry?.attributes?.position?.array,'mesh?.current?.geometry?.attributes?.position?.array')
  const color = useMemo(()=>{
    const scheme = new ColorScheme;
    scheme.from_hue(hue)         
          .scheme('analogic')
          .distance(0.05)    
          .variation('soft');
    return "#"+getRandom(scheme.colors())
  },[hue])
  return (
    <group ref={groupRef}>
      
    </group>
//     <group 
//     // rotation={rotation}
//     >
//       {/* <mesh
//         {...props}
//         ref={mesh}
//       > ( */}
//         {/* <extrudeBufferGeometry    args={[heartShape,extrudeSettings]}/>)
//           <meshStandardMaterial color={color} displacementMap={displacementMap} normalMap={normalsMap}/>
//      */}
//            {/* <Plane
//         rotation={[-Math.PI / 2, 0, 0]}
//         position={[0, -3, 0]}
//         args={[64, 64, 1024, 1024]}
//       >
//         <meshStandardMaterial
//           attach="material"
//           color="white"
// displacementMap={displacementMap} normalMap={normalsMap}
//         />
//       </Plane> */}
//       {/* </mesh> */}
//     </group>
  );
}
const App = () => {
  const classes = useStyles();
  const [width,setWidth] = useState(50)
  const [height,setHeight] = useState(100)
  const [hue,setHue] = useState(220)
  const [leafs,setLeafs] = useState(1)
  const [alongCurve,setAlongCurve] = useState(1)
  const sceneRef = useRef();
  const scene = useMemo(()=>{
    return sceneRef?.current},[sceneRef?.current])
  console.log(sceneRef,"sceneRef")

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
                    <Typography  gutterBottom>
        Move along Curve
      </Typography>
      <Slider
        defaultValue={alongCurve}
        step={1}
        value={alongCurve}
        onChange={(e,value)=>setAlongCurve(value)}
        min={1}
        max={360}
        valueLabelDisplay="auto"
      />
      </div>

      <Canvas camera={{ position: [0, 0, 300] }} className={classes.canvas}>
        <ambientLight intensity={0.5} />
        <Suspense fallback={<Html>loading..</Html>}>
        <scene ref={sceneRef}>
        <Flower leafs={leafs} scene={scene} leafProps={
          {
            width,
           height,
           hue,
           alongCurve
          }
        }></Flower>
      </scene>

        </Suspense>
        <OrbitControls />

      </Canvas>
    </>
  );
};

export default App;
