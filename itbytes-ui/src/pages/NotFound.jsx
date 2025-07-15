import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_colored.png"; // Adjust the path as necessary

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div
            style={{
                backgroundColor: "#f9f9f9",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "24px",
            }}
        >
            <Result
                status="404"
                // icon={
                //     <img
                //         src="https://res.cloudinary.com/dsayqafkn/image/upload/v1752586429/erien_tp4uho.png" 
                //         alt="Not Found"
                //         style={{ width: 200 }}
                //     />
                // }
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button type="primary" onClick={() => navigate("/")}>
                        Back Home
                    </Button>
                }
                style={{ backgroundColor: "#f9f9f9", fontFamily: "Poppins" }}
            />
        </div>
    );
};

export default NotFound;
