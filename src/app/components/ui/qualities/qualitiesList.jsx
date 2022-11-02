import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Quality from "./quality";
import { useDispatch, useSelector } from "react-redux";
import { getQualitiesById, getQualitiesLoadingStatus, loadQualitiesList } from "../../../store/qualities";

const QualitiesList = ({ id }) => {
    const qualities = id;
    const dispatch = useDispatch();
    const isLoading = useSelector(getQualitiesLoadingStatus());
    const qualitiesList = useSelector(getQualitiesById(qualities));
    useEffect(() => {
        dispatch(loadQualitiesList());
    }, []);
    if (isLoading) return "Loading ...";
    return (
          <>
              {qualities && qualitiesList.map((quality) => (
                    <Quality key={quality._id} {...quality}/>
              ))}
          </>
    );
};

QualitiesList.propTypes = {
    id: PropTypes.array
};

export default QualitiesList;
