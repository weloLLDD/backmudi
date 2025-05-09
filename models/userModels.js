import mongoose from "mongoose";  
import bcrypt from "bcryptjs";


const userSchema = mongoose.Schema({

    name:{
        type: String,
        required:[true, "please add a name"]
    },
    email :{
        type:String,
        required:[true,"please add a email"],
        unique:true,
        trim:true,
        Match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"please enter a valid email"
        ]
    }
    ,
    password :{
        type: String,
        required:[true, "please add a password"],
        minLength:[6, "Password must be up to 6 characters "],
       // maxLength:[23,"Password must not 6 more than 23 characters "],
    },
    isAdmin : {
        
        type: Boolean, 
        require:true,
        default:false
     
    }

}, {
    timestamps: true,
})

// login

userSchema.methods.matchPassword = async function (enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
};

//register
userSchema.pre("save",async function(next) {
    
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema)

export default User
