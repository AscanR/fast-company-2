import React from "react";
import PropTypes from "prop-types";
import Quality from "./quality";
import { QualitiesProvider } from "../../../../hooks/useQualities";

const QualitiesList = ({ id }) => {
    const qualities = id;
    return (
          <>
              <QualitiesProvider>
                  {qualities.map((qual) => (
                        <Quality key={qual} id={qual} />
                  ))}
              </QualitiesProvider>
          </>
    );
};

QualitiesList.propTypes = {
    qualities: PropTypes.array
};

export default QualitiesList;
