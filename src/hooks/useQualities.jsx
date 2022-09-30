import React, { useContext, useEffect, useState } from "react";
import qualityService from "../services/quality.service";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const QualitiesContext = React.createContext();

export const useQualities = () => {
    return useContext(QualitiesContext);
};

export const QualitiesProvider = ({ children }) => {
    const [qualities, setQualities] = useState([]);
    const [errors, setErrors] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const getQualities = async () => {
            try {
                const { content } = await qualityService.get();
                setQualities(content);
                setIsLoading(false);
            } catch (error) {
                errorCatcher(error);
            }
        };
        getQualities();
    }, []);
    const getQuality = (id) => {
        return qualities.find(item => item._id === id);
    };

    function errorCatcher(error) {
        const { message } = error.response.data;
        setErrors(message);
    }

    useEffect(() => {
        if (errors !== null) {
            toast(errors);
            setErrors(null);
        }
    }, [errors]);

    return (<QualitiesContext.Provider value={{ qualities, getQuality, isLoading }}>
              {children}
          </QualitiesContext.Provider>
    );
};

QualitiesProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
