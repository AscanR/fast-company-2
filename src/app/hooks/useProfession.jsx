import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import professionService from "../../services/profession.service";
import { toast } from "react-toastify";

const ProfessionContext = React.createContext();

export const useProfessions = () => {
    return useContext(ProfessionContext);
};

export const ProfessionProvider = ({ children }) => {
    const [isLoading, setLoading] = useState(true);
    const [profession, setProfession] = useState([]);
    const [error, setError] = useState(null);

    function getProfession(id) {
        return profession.find(item => item._id === id);
    }
    async function getProfessionsList() {
        try {
            const { content } = await professionService.get();
            setProfession(content);
            setLoading(false);
        } catch (error) {
            errorCatcher(error);
        }
    }
    function errorCatcher(error) {
        const { message } = error.response.data;
        setError(message);
    }
    useEffect(() => { getProfessionsList(); }, []);
    useEffect(() => {
        if (error !== 0) {
            toast(error);
            setError(null);
        }
    }, [error]);
    return (
          <ProfessionContext.Provider value={{ isLoading, profession, getProfession, getProfessionsList }}>{ children } </ProfessionContext.Provider>
    );
};

ProfessionProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
