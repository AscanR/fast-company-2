import React from "react";
import PropTypes from "prop-types";
import Quality from "./quality";
import { useQualities } from "../../../../hooks/useQualities";

const QualitiesList = ({ id }) => {
    const qualities = id;
    const { isLoading } = useQualities();
    if (!isLoading) {
        return (
              <>
                  {qualities.map((qual) => (
                        <Quality key={qual} id={qual}/>
                  ))}
              </>
        );
    } else return "Loading ...";
};

QualitiesList.propTypes = {
    id: PropTypes.array
};

export default QualitiesList;
