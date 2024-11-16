import  Bottom  from "../component/Bottom"
import  Button  from "../component/Button"
import { Heading } from "../component/Heading"
import { InputBox } from "../component/InputBox"
import { SubHeading } from "../component/SubHeading"
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Signin = () => {

    const [formData, setFormData] = useState({
        username:"",
        password:""
    })

    const [error,setError] = useState(null);
    const [successMessage,setSuccessMessage] = useState("");


    const navigate = useNavigate();

    const handleSignin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/signin', formData,
                {headers: { "Content-Type": "application/json" } }
                );
            setSuccessMessage('Signed in successfully!');
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox
            placeholder="harkirat@gmail.com"
            label={"Email"}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <InputBox
            placeholder="123456"
            label={"Password"}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
        <div className="pt-4">
          <Button label="Sign in" type="submit" onClick={handleSignin}/>
        </div>
        <Bottom label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}

export default Signin;