import { Router } from "express";
import authenticate from "../Middleware/auth.js";
import { course } from "./adminRoute.js";
const userRoute=Router();
const cart=new Map();
userRoute.post('/addCart', authenticate, async (req, res) => {
    console.log("Hi");
    
    const UserRole = req.userrole;
    const UserName = req.username;
    console.log(UserRole, "hi user");
    console.log(UserName, "name");

    try {
        if (UserRole == 'user'||UserRole=='admin') {
            const  {CourseName}  = req.body;
            console.log(CourseName);

            const courseDetails = course.get(CourseName);
            console.log(courseDetails);

            const cartDetails = {
                CourseName,
                Price: courseDetails.Price,
            }
            let cartArray = [];
            cartArray.push(cartDetails);
            console.log(cartArray);

            try {
                const data = cart.get(UserName);
                console.log(data);
                
                if (data) {
                    console.log("old")
                    console.log(data);
                    let f=0;
                    data.forEach(x=>{
                        console.log(x.CourseName,CourseName);
                        
                        if(x.CourseName==CourseName){
                            // res.status(400).json({message:'Check the input'})
                            f=1;
                            
                        }
                    })
                        console.log(f);
                        
                        if(f==0){
                        data.push(cartDetails);
                        cart.set(UserName,data);
                        console.log(cart.get(UserName));
                        res.status(201).json({ message: "Item added to cart" })
                        }
                        else{
                            res.status(401).json({message:'Already on cart'})
                        }
                    
                    
                    
             
                    }
                else {
                    console.log("new");
                    
                    cart.set(UserName, cartArray);


                    console.log(cart.get(UserName));

                    res.status(201).json({ message: "Item added to cart" })
                }
            }

            catch (error) {
                res.status(400).json({ message: "Check the input" })
            }

        }
        else {
            res.status(400).json({ message: "Unauthorized Access" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Check the bookName" });
    }


})

userRoute.get('/viewCart', authenticate, async (req, res) => {
    const UserRole = req.userrole;
    const UserName = req.username;
    console.log(UserName);

    const result = cart.get(UserName);
    res.send(result);
})

userRoute.get('/buyCart', authenticate, async (req, res) => {
    try{
    const UserRole = req.userrole;
    const UserName = req.username;
    console.log(UserRole, "hi user");
    console.log(UserName, "name");
   
    const data = cart.get(UserName);
    console.log(data);
    let total = 0;
    let Price,CourseName;
    data.forEach(x=>{
        CourseName=x.CourseName;
        Price=x.Price;
        
        total+=Price;
        
    })
    
    console.log(total);
    // cart.delete(UserName);
    res.send(total.toString())
}
    catch{
        res.status(500).json({message:"Check Details"});
    }
   
})

userRoute.get('/logout',(req,res)=>{
    res.clearCookie('authToken'); // 'authToken' is the cookie name
    res.status(200).json({ message: 'Logout successful' });
})

export default userRoute;