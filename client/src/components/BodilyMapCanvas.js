import { string } from 'prop-types';
import React from 'react';
import { useState, useEffect } from 'react';

//human picture
import HumanImage from '../images/human.png';

class BodilyMapCanvas extends React.Component {
     constructor(props) {
          super(props);
          this.canvasRef = React.createRef();
          this.imageRef = React.createRef();
     }

     componentDidMount() {
          var arrX = [];
          var arrY = [];
          
          const canvas = this.canvasRef.current;
          const img = this.imageRef.current;

          canvas.width = 900;
          canvas.height = 1500;
          const ctx = canvas.getContext("2d");

          img.onload = () => {
               ctx.drawImage(img, 0, 0, 900, 1500);
          }
          
          var lastx, lasty, isDrawing;
          var canvastop = canvas.offsetTop;
          //setting presets for canvas context
          ctx.fillStyle = "red";
          ctx.strokeStyle = "red";
          ctx.lineWidth = 0;
          ctx.globalCompositeOperation = "source-over"; 

          canvas.ontouchstart = function(event){        
               ctx.globalAlpha = "0.4";            
               event.preventDefault();                 
               isDrawing = true;
               lastx = event.touches[0].clientX;
               lasty = event.touches[0].clientY - canvastop;
             }
           
             canvas.ontouchmove = function(event){                   
               event.preventDefault();                 
               if(!isDrawing) return;
               var newx = event.touches[0].clientX;
               var newy = event.touches[0].clientY - canvastop;
               console.log(newx);
               console.log(newy);
                 ctx.beginPath();
                 ctx.arc(newx, newy, 10, false, Math.PI * 2, false);
                 ctx.closePath();
                 ctx.fill();
                 ctx.stroke();
         
             }
     }

     getWindowDimensions() {
          const { innerWidth: width, innerHeight: height } = window;
     
          return {
               width,
               height
          };
     }
        
     useWindowDimensions = () => {
          const [windowDimensions, setWindowDimensions] = useState(this.getWindowDimensions());
        
          useEffect(() => {
               function handleResize() {
                    setWindowDimensions(this.getWindowDimensions());
               }
        
               window.addEventListener("resize", handleResize);
               return () => window.removeEventListener("resize", handleResize);
          }, []);
        
          return windowDimensions;
     };

     render() {

          const { width, height } = this.getWindowDimensions();
          return (
               <div>
                    <img className = "BodilyMapCanvas__humanImage" ref = {this.imageRef} src = {HumanImage} />
                    <canvas className = "BodilyMapCanvas__canvas" ref = {this.canvasRef} />
                    <button className = "BodilyMapCanvas__button">Next Bodily Map</button>
               </div>
          );
     }
}

export default BodilyMapCanvas;
