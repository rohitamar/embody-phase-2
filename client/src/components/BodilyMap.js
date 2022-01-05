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

          const { width, height } = this.getWindowDimensions();
          const canvasDimensions = {
               width: width,
               height: 0.94*height
          };
           
          const imageDimensions = {
               width: 0.9*width,
               height: 0.94*height
          };
           
          const canvas = this.canvasRef.current;
          const img = this.imageRef.current;

          canvas.width = canvasDimensions.width;
          canvas.height = canvasDimensions.height;

          const ctx = canvas.getContext("2d");

          img.onload = () => {
               ctx.drawImage(img, 0.05*width, 0, imageDimensions.width, imageDimensions.height);
          }

          var lastx, lasty, isDrawing;
          //note that props.color can only be red or blue
          ctx.fillStyle = this.props.color;
          ctx.strokeStyle = this.props.color;

          ctx.lineWidth = 0;
          ctx.globalCompositeOperation = "source-over"; 

          canvas.ontouchstart = function(event){                   
               event.preventDefault();           
               ctx.globalAlpha = "0.4";      
               isDrawing = true;
               lastx = event.touches[0].clientX;
               lasty = event.touches[0].clientY;
          }
           
          canvas.ontouchmove = function(event){                   
               event.preventDefault(); 
               
               ctx.globalAlpha = "0.4";                
               if(!isDrawing) return;
               
               var newx = event.touches[0].clientX;
               var newy = event.touches[0].clientY;
               
               arrX.push(parseInt(696 + (newx * 170/imageDimensions.width), 10));
               arrY.push(parseInt(10 + (newy*521/imageDimensions.height), 10));
               
               ctx.beginPath();
               ctx.arc(newx+10, newy+10, 4, false, Math.PI * 2, false);
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
          return (
               <div className = "BodilyMapCanvas">
                    <img className = "BodilyMapCanvas__humanImage" ref = {this.imageRef} src = {HumanImage} />
                    <canvas className = "BodilyMapCanvas__canvas" ref = {this.canvasRef} />
                    <button className = "BodilyMapCanvas__button">Next Bodily Map</button>
               </div>
          );
     }
}

export default BodilyMapCanvas;
