import { useState } from "react";
import axios from "axios";
import Bottom from "../component/Bottom";
import Button from "../component/Button";
import { Heading } from "../component/Heading";
import { InputBox } from "../component/InputBox";
import { SubHeading } from "../component/SubHeading";
import {Link, useNavigate} from "react-router-dom";

export default function Signup() {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
    });

    const [error, setError] = useState(null); // For error message
    const [successMessage, setSuccessMessage] = useState(""); // For success message

   const navigate = useNavigate();  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Input change:", name, value); // Log the name and value of the input
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateFormData = () => {
        const { firstname, lastname, username, password } = formData;
        console.log("Validating form data:", formData);
        if (!firstname || !lastname || !username || !password) {
            setError("All fields are required.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");

        console.log("Form data before validation:", formData);

        if (!validateFormData()) return;

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/user/signup",
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Signup successful:", response.data);
            setSuccessMessage(response.data.message);
            navigate('/signin')
        } catch (error) {
            console.error("Signup error:", error.response?.data);
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex justify-center bg-slate-300 h-screen">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your information to create an account"} />

                    <form onSubmit={handleSubmit}>
                        <InputBox
                            placeholder="John"
                            label="First Name"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                        />
                        <InputBox
                            placeholder="Doe"
                            label="Last Name"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                        />
                        <InputBox
                            placeholder="nitinwalia@gmail.com"
                            label="Email"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        <InputBox
                            placeholder="********"
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}

                        <div className="pt-4">
                            <Button label="Sign up" type="submit" />
                        </div>
                    </form>
                    <div className="flex flex-row justify-center items-center ">
                        <Bottom label="Already have an account?" buttonText="Sign in" to="/signin" />
                        <Link  className="text-sm" to="/signin">Sign In</Link>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
