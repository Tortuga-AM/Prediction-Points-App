import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirector = ({ auth }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            navigate("/dashboard");
        } else {
            navigate("/");
        }
    }, [navigate, auth]);

    return null;
};

export default Redirector;