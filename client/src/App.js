import React, { Component} from 'react';
import {
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Button,
  Grid,
  createMuiTheme,
  CircularProgress,
  Typography
} from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';
import {
  withStyles
} from "@material-ui/core/styles";
import BGImage from "./bgimage.jpg";
import SandwichImage from "./sandwich.png";
import FrenchFriesImage from "./frenchfries.png";
import PizzaImage from "./pizza.png";
import PirimixImage from "./pirimix.png";
import axios from "axios";
import * as _ from "lodash";
import './App.css';
import { fontSize } from '@material-ui/system';

const style = theme => ({
  root: {
    display: 'flex',
  },
  group: {
    margin: theme.spacing(1, 0),
  },
  bgImage:{
    width: "100%",
    height:"100%",
    backgroundImage: `url(${BGImage})`,
    backgroundSize:"cover",
  },
  message:{
    color:"#ffffff",
    textAlign:"center"
  }
});

const theme = createMuiTheme({
  overrides:{
    MuiTypography:{
      body1:{
        fontFamily:"'Indie Flower', cursive",
        fontSize:"1.3rem"
      }
    }
  }
})

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      message:"",
      loading:false,
      hideControl: false,
      foodChoice:{
        sandwich: {
          title:"Mcdonald Sandwich",
          image: SandwichImage,
          style:{
            transform: "translate(320px)",
            width:80,
            height:60,
            opacity:0,
            transition:"2s",
          },
          value: false
        },
        frenchFries: {
          title:"Mcdonald French Fries",
          image: FrenchFriesImage,
          style:{
            transform: "translate(320px)",
            width:80,
            height:60,
            opacity:0,
            transition:"2s",
          },
          value: false
        },
        piripiri: {
          title:"Piri Piri Mix",
          image: PirimixImage,
          style:{
            transform: "translate(320px)",
            width:80,
            height:60,
            opacity:0,
            transition:"2s",
          },
          value: false
        },
        pizza: {
          title:"Dominos Pizza",
          image: PizzaImage,
          style:{    
            transform: "translate(320px)",
            width:80,
            height:60,
            opacity:0,
            transition: "2s"
          },
          value: false
        },
      },
      imageComponent:[],
      foodType:"",
      user:null
    }
  }

  componentDidMount(){
    axios.get("http://localhost:7000/api/user")
    .then(response =>{
        this.setState(prevState => ({
          ...prevState,
          user: response.data,
          hideControl: response.data.alreadySubmitted,
          message: response.data.alreadySubmitted ? "You have already submitted your order." : ""
        }));
    })
  }

  foodChoiceChange = name => (event) =>{

    let foodLength = 0;
    for(let key in this.state.foodChoice){
      if(this.state.foodChoice[key].value){
        foodLength ++;
      }
    }

    const foodChoice = event.target.checked;
    this.setState(prevState => ({
      ...prevState,
      foodChoice:{
        ...prevState.foodChoice,
        [name]: {
          ...prevState.foodChoice[name],
          style:{
            ...prevState.foodChoice[name].style,
            transform: `translate(${foodLength*320}px)`
          },
          value: foodChoice
        }
      }
    }))
  }

  foodTypeChange = (event) =>{
    const foodType =  event.target.value;
    this.setState(prevState => ({
      ...prevState,
      foodType
    }))
  }

  onSubmitOrder = () =>{

    const foodChoice = [];

    for(let key in this.state.foodChoice){
      if(this.state.foodChoice[key].value){
        foodChoice.push(this.state.foodChoice[key].title);
      }
    }
    const foodType = this.state.foodType;
    const user = this.state.user.name || "vipin";

    const data = `${user}, ${foodType}, ${foodChoice.join("-")}`;

    this.setState(prevState => ({
      ...prevState,
      loading: true
    }));

    axios.post("/api/order", {
      data
    }).then(res=>{
      this.setState(prevState => ({
        ...prevState,
        loading: false,
        message: res.data,
        hideControl: true
      }));
    });
  }

  render(){
    const {classes} = this.props;

  let BtnDisabled = true;
    if(this.state.foodType !== ""){
      for(let key in this.state.foodChoice){
        if(this.state.foodChoice[key].value){
          BtnDisabled = false;
        }
      }
    }
    const user = this.state.user;

    const FoodArray = [];
    for(let key in this.state.foodChoice){
      FoodArray.push({
        id:key,
        ...this.state.foodChoice[key]
      })
    }


  return (
    <ThemeProvider theme={theme}>
     <Grid container justify="center"
       className={classes.bgImage}
       >
       <Grid item xs={12} lg={4} md={4} sm={6}>
       <header className="header">
      Swapnil's farewell party
    </header>
    <Typography variant="h5" component="h5" className={classes.message}>
      {this.state.message}
    </Typography>
 {
   !this.state.hideControl &&    <div className="container">
   {
     this.state.user !== null && <div style={{
       fontSize:"1.3rem"
     }}>Hello {user.name},<br />
     Please select your food choice
     </div>
   }
 <FormControl component="fieldset">
     <FormLabel component="legend"></FormLabel>
     <RadioGroup
       aria-label="foodType"
       name="foodType"
       className={classes.group}
       value={this.state.foodType}
       onChange={this.foodTypeChange}
     >
       <FormControlLabel
         value="Vegetarian"
         control={<Radio 
         style={
           {color:"green"
         }
         }
         />}
         label="Vegetarian"
       />
       <FormControlLabel
         value="Non Vegetarian"
         control={<Radio style={
           {color:"red"}
         } />}
         label="Non Vegetarian"
       />
       </RadioGroup>
       </FormControl>
   {
     this.state.foodType !== "" && <FormGroup>
       {
         FoodArray.map(choice => {
           let color = "red";
           if(_.isEqual(this.state.foodType, "Vegetarian")){
             color = "green";
           }
           else{
             if(_.isEqual(choice.id, "piripiri")
             || _.isEqual(choice.id, "frenchFries")
             ){
               color = "green";
             }
           }
           return (<FormControlLabel
             key={choice.id}
               control={
                 <Checkbox checked={choice.value} 
                 onChange={this.foodChoiceChange(choice.id)} 
                 value={choice.value}
                 style={{color}}
                 />
               }
               label={choice.title}
             />)
         })
       }
   
     </FormGroup>
     
   }
   <Button onSubmit={()=>{}}
   color="primary"
   variant="contained"
   style={{
     display:"block",
     marginTop:"1rem"
   }}
   onClick={this.onSubmitOrder}
   disabled={BtnDisabled}
   >
     Order
   </Button>
   <div style={{
     position:"relative"
   }}>
       {
 FoodArray
 .map((food) => (<img key={food.id} src={food.image} 
   style={{
     ...food.style,
     transform:  food.value ? `translate(0px)` : food.style.transform,
     opacity: food.value ? 1 : 0,
   }}
    />))
}
   </div>
</div>

 }
 {
   this.state.loading &&  <div className="loader">
   <CircularProgress />
 </div>
 }

       </Grid>
       </Grid>
  
    </ThemeProvider>
  
  );
  }
}


export default withStyles(style)(App);
