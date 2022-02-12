import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { withCookies, Cookies } from "react-cookie";
import HumanImage from '../images/human.png';

class BodilyMapCanvas extends React.Component {

     constructor(props) {
          super(props);
          this.canvasRef = React.createRef();
          this.imageRef = React.createRef();

          this.handleFinish = this.handleFinish.bind(this);
          this.handleRefresh = this.handleRefresh.bind(this);
     }

     componentDidUpdate(prevProps, prevState) {
          this.handleRefresh();
          console.log(this.props);
     }

     componentDidMount() {
          var arrX = [];
          var arrY = [];

          const { width, height } = this.getWindowDimensions();
          const canvasDimensions = {
               height: 0.84*height,
               width: 0.84/3 * height
          };
           
          const imageDimensions = {
               height: 0.84*height,
               width: 0.84/3*height,
          };
           
          const canvas = this.canvasRef.current;
          const img = this.imageRef.current;

          canvas.width = canvasDimensions.width;
          canvas.height = canvasDimensions.height;

          const ctx = canvas.getContext("2d");

          img.onload = () => {
               ctx.drawImage(img, 0, 0, imageDimensions.width, imageDimensions.height);
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

     handleFinish() {
          if(this.props.color == "red") {
               this.props.navigate('/deactivation');
          } else {
               this.props.navigate('/thankyou');
          }
     }

     handleRefresh() {
          window.location.reload();
     }

     render() {
          return (
               <div className = "BodilyMapCanvas">
                    <img className = "BodilyMapCanvas__humanImage" ref = {this.imageRef} src = {HumanImage} />
                    <div className = "BodilyMap__canvas">
                         <canvas className = "BodilyMapCanvas__canvas" ref = {this.canvasRef} />
                         <div className = "BodilyMap__buttons">
                              <button onClick = {this.handleFinish} className = "BodilyMapCanvas__button">Click Here When Finished</button>
                              <button onClick = {this.handleRefresh} className = "BodilyMapCanvas__button">Reset</button>
                         </div>
                    </div>
                    <h1 className = "BodilyMapCanvas__header">
                         Indicate where you feel {
                              this.props.color == "red" ? 
                              <span className = "BodilyMapCanvas__header--bold">activation</span> :
                              <span className = "BodilyMapCanvas__header--bold">deactivation</span>
                         } now.
                    </h1>
               </div>
          );
     }
}

export default function App(props) {
     const navigation = useNavigate();
     return <BodilyMapCanvas {...props} navigate = {navigation} />; 
}



 