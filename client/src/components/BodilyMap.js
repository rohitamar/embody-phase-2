import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import HumanImage from '../images/human.png';
import axios from 'axios';
import Cookies from 'universal-cookie';

class BodilyMapCanvas extends React.Component {

     constructor(props) {
          super(props);
          //React references created to build the canvas on the screen
          this.canvasRef = React.createRef();
          this.imageRef = React.createRef();

          //this binding event handler functions
          this.handleFinish = this.handleFinish.bind(this);
          this.handleRefresh = this.handleRefresh.bind(this);
          
          //accessing browser cookies to obtain participantID 
          this.cookies = new Cookies();

          //initializing initial state values
          this.state = {
               arrX: [],
               arrY: [],
               dateEntered: 0
          };
     }

     componentDidMount() {

          const TIME_COOKIE = 2592000;
          const PATH_COOKIE = '/';

          const COOKIE_SETTINGS = {
               path: PATH_COOKIE,
               maxAge: TIME_COOKIE
          };

          //we immediately log the dateEntered when the component mounts to the screen
          this.setState({
               dateEntered: Date.now()
          });

          if(this.props.color == "red") {
               this.cookies.set("dateEnteredActivation", this.state.dateEntered.toString(), COOKIE_SETTINGS);
          } else {
               this.cookies.set("dateEnteredDeactivation", this.state.dateEntered.toString(), COOKIE_SETTINGS);
          }

          var arrX = [], arrY = [];

          //We have taken a 1 to 3 ratio for height to width of the canvas itself
          //Note that the aspect ratio of the image can be changed for convenience of filling data
          //For example, it can be 0.84 * height and 0.84/4 * height (for a smaller aspect ratio) or a 0.84 * height and 0.84/2 * height (for a larger aspect ratio)
          //This doesn't change data collection by too much as the coordinates of whatever size the image is are scaled appropriately to the one that MATLAB uses
          //The MATLAB script uses a 170 x 521 sized canvas. Note that our canvas size is responsive and changes based on the phone screen width/height. 
          //More comments on this have been made when the coordinates are being pushed into the array.

          const { width, height } = this.getWindowDimensions();
          const canvasDimensions = {
               height: 0.84*height,
               width: 0.84/3 * height
          };
          const imageDimensions = {
               height: 0.84*height,
               width: 0.84/3*height,
          };
          
          //make canvasRef current and imageRef current objects, set their dimensions appropriately, and then load the "human" image onto the canvas
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
          //setting up the canvas with the color and linewidth
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
           
          canvas.ontouchmove = (event) => {                   
               event.preventDefault(); 
               ctx.globalAlpha = "0.4";                
               if(!isDrawing) return;               
               var newx = event.touches[0].clientX;
               var newy = event.touches[0].clientY;

               if(this.props.color == "red") {
                    arrX.push(parseInt(33 + (newx * 170/imageDimensions.width)));
                    arrY.push(parseInt(10 + (newy*521/imageDimensions.height), 10));
               } else {
                    arrX.push(parseInt(696 + (newx * 170/imageDimensions.width), 10));
                    arrY.push(parseInt(10 + (newy*521/imageDimensions.height), 10));
               }

               this.setState({
                    arrX,
                    arrY
               });

               ctx.beginPath();
               ctx.arc(newx+10, newy+10, 4, false, Math.PI * 2, false);
               ctx.closePath();
               ctx.fill();
               ctx.stroke();
          }
          
     }

     //The next two functions allow us to responsively change the canvas.
     //It was a bit of a hassle to get the dimensions of the window.
     //Note that the function useWindowDimensions uses React Hooks even though this component uses regular states just to isolate the window dimension collection process

     getWindowDimensions() {
          const { innerWidth: width, innerHeight: height } = window;
          return {
               width,
               height
          };
     }

     getTimeDifference(date1, date2) {
          const diff = Math.abs(date2 - date1);
          return Math.ceil(diff/(1000 * 60 * 60));
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
          const TIME_COOKIE = 2592000;
          const PATH_COOKIE = '/';

          const COOKIE_SETTINGS = {
               path: PATH_COOKIE,
               maxAge: TIME_COOKIE
          };

          if(this.props.color == "blue" && this.cookies.set("dateLeftActivation") == "NO DATE") {
               alert("Invalid Request. Try Again.");
               return;
          }

          let ID = this.cookies.get("participantID");
          let sessionNumber = this.cookies.get("sessionNumber");

          var dateLeft = Date.now();

          let differenceActivation = false;
          let differenceBetweenActivationAndDeactivation = false;

          //Note that we are only including the dateLeft on the participant coordinate data as the MATLAB scripts require this
          //For consistency, we make this dateLeft equal on both the logger and the participant coordinate data
          //Furthermore, note that this does assume that the participant finished at the moment that they pressed the submit button
          //We do not take into consideration if they stopped before this, and waited to press submit
          if(this.props.color == "red") {
               this.cookies.set("dateLeftActivation", dateLeft.toString(), COOKIE_SETTINGS);
          } else {
               this.cookies.set("dateLeftDeactivation", dateLeft.toString(), COOKIE_SETTINGS);
               let dateLeftActivation = this.cookies.get("dateLeftActivation");
               differenceBetweenActivationAndDeactivation = this.getTimeDifference(this.state.dateEntered, dateLeftActivation) >= 60;
          }

          differenceActivation = this.getTimeDifference(dateLeft, this.state.dateEntered) >= 3;

          if(differenceActivation || differenceBetweenActivationAndDeactivation) {
               let tempSessionNum = this.cookies.get("sessionNumber");
               this.cookies.set("sessionNumber", tempSessionNum, COOKIE_SETTINGS);
               this.cookies.set("repetition", 2, COOKIE_SETTINGS);
          }

          axios.post('https://bodily-maps.herokuapp.com/participantData/add', { 
               participantID: ID,
               coordXArray: this.state.arrX,
               coordYArray: this.state.arrY,
               sessionNumber: this.cookies.get("sessionNumber"),
               date: dateLeft
          });

          const canvas = this.canvasRef.current;
          var participantImageData = canvas.toDataURL();

          axios.post('https://bodily-maps.herokuapp.com/participantData/pushBodilyMap', {
               participantImagePath: sessionNumber + '__' + ID + '__' + dateLeft.toString(),
               participantImageData
          });

          axios.post('https://bodily-maps.herokuapp.com/log/add', {
               participantID: ID,
               dateEntered: this.state.dateEntered,
               dateLeft: dateLeft,
               type: (this.props.color == "red" ? "ACTIVATION" : "DEACTIVATION"),
               sessionNumber,
               dataValidity: (differenceActivation || differenceBetweenActivationAndDeactivation) ? "NOT VALID" : "VALID"
          }).then(res => {
               if(this.props.color == "red") {
                    this.props.navigate('/deactivation');
                    this.handleRefresh();
               } else {
                    this.props.navigate('/thankyou');
               }
          });
          
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



 