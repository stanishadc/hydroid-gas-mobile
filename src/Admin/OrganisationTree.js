import React from 'react';
import Block from './Block';
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
import { Tree, TreeNode } from 'react-organizational-chart';
const OrganisationTree = () => {
    const [organisation, setAdminTree] = useState({});
    const headerconfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            'Content-Type': 'application/json'
        }
    }
    const GetDashboardTree = () => {
        axios
            .get(config.APIACTIVATEURL + config.GETORGANISATIONTREE + "?OrganisationId=" + localStorage.getItem('organisationId'), { ...headerconfig })
            .then((response) => {
                setAdminTree(response.data.data);
            });
    };
    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0;
    };
    useEffect(() => {
        GetDashboardTree();
    }, [])
    return (
        <div>
            {isEmpty(organisation) ? (
                <p>Loading...</p>
            ) : (
                <Tree label={<div>{organisation.organisationName}</div>}>
                    {organisation.block.length > 0 && organisation.block.map((block, index) => (
                        <Block key={index} block={block} />
                    ))}
                </Tree>
            )}
        </div>)
}

export default OrganisationTree;
